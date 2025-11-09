"""
Elasticsearch Loader - Prepare and Bulk Index Documents

Purpose:
    Prepares news documents for Elasticsearch indexing.
    Handles deduplication, bulk indexing, and index creation.

Expected Output:
    - Documents indexed into stock_news or stock_event_news index
    - Deduplication by URL to avoid duplicate entries
"""

import logging
import hashlib
from typing import List, Dict

import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def prepare_doc(row: pd.Series) -> Dict:
    """
    Convert a DataFrame row to an Elasticsearch document.
    
    Maps DataFrame columns to ES index fields and adds document ID based on URL hash.
    
    Args:
        row: pandas Series (one row from DataFrame)
        
    Returns:
        Dict: Document ready for Elasticsearch indexing
    """
    # Helper to convert datetime safely
    def to_iso(value):
        if pd.isna(value) or value is None:
            return None
        if isinstance(value, str):
            return value
        if hasattr(value, 'isoformat'):
            return value.isoformat()
        return str(value)
    
    doc = {
        "title": str(row.get("title", "")),
        "url": str(row.get("url", "")),
        "company": str(row.get("company", "")),
        "seendate": to_iso(row.get("seendate")),
        "sourceCountry": str(row.get("sourceCountry", "")),
        "domain": str(row.get("domain", "")),
        "language": str(row.get("language", "")),
        "fetched_at": to_iso(row.get("fetched_at")) or datetime.now().isoformat(),
        "sentiment_label": str(row.get("sentiment_label", "neutral")),
        "sentiment_score": float(row.get("sentiment_score", 0.5)) if pd.notna(row.get("sentiment_score")) else 0.5,
        "summary": str(row.get("summary", "")),
        "keywords": row.get("keywords", []),
        "related_entities": row.get("related_entities", []),
        "price_before": float(row.get("price_before")) if pd.notna(row.get("price_before")) else None,
        "price_after": float(row.get("price_after")) if pd.notna(row.get("price_after")) else None,
        "price_change_pct": float(row.get("price_change_pct")) if pd.notna(row.get("price_change_pct")) else None,
        "volume_before": float(row.get("volume_before")) if pd.notna(row.get("volume_before")) else None,
        "volume_after": float(row.get("volume_after")) if pd.notna(row.get("volume_after")) else None,
        "volatility_change": float(row.get("volatility_change")) if pd.notna(row.get("volatility_change")) else None,
        "impact_score": float(row.get("impact_score", 0.0)) if pd.notna(row.get("impact_score")) else 0.0
    }
    
    # Generate document ID from URL hash (for deduplication)
    url = doc["url"]
    doc_id = hashlib.md5(url.encode()).hexdigest() if url else None
    doc["_id"] = doc_id
    
    return doc


def deduplicate_by_url(df: pd.DataFrame) -> pd.DataFrame:
    """
    Deduplicate DataFrame by URL (keep first occurrence).
    
    Args:
        df: News DataFrame
        
    Returns:
        pd.DataFrame: Deduplicated DataFrame
    """
    if df.empty or "url" not in df.columns:
        return df
    
    initial_count = len(df)
    df_deduped = df.drop_duplicates(subset=["url"], keep="first")
    removed_count = initial_count - len(df_deduped)
    
    if removed_count > 0:
        logger.info(f"Removed {removed_count} duplicate URLs")
    
    return df_deduped


def index_dataframe(
    es,
    index_name: str,
    df: pd.DataFrame,
    batch_size: int = 500,
    create_index: bool = True
) -> Dict:
    """
    Index a pandas DataFrame into Elasticsearch with deduplication and bulk indexing.
    
    Process:
        1. Deduplicate by URL
        2. Create index if it doesn't exist (optional)
        3. Prepare documents
        4. Bulk index in batches
    
    Args:
        es: Elasticsearch client instance
        index_name: Target index name
        df: DataFrame to index
        batch_size: Batch size for bulk indexing (default: 500)
        create_index: Whether to create index if missing (default: True)
        
    Returns:
        Dict: Indexing summary {"success": int, "failed": int, "errors": list}
    """
    from .elastic_client import create_index_if_not_exists, get_default_news_mapping, bulk_index
    
    if df.empty:
        logger.warning("Empty DataFrame. Nothing to index.")
        return {"success": 0, "failed": 0, "errors": []}
    
    # Deduplicate
    df = deduplicate_by_url(df)
    
    # Create index if needed
    if create_index:
        try:
            mapping = get_default_news_mapping()
            create_index_if_not_exists(es, index_name, mapping)
        except Exception as e:
            logger.error(f"Failed to create index: {e}")
            raise
    
    # Prepare documents
    logger.info(f"Preparing {len(df)} documents for indexing...")
    docs = [prepare_doc(row) for _, row in df.iterrows()]
    
    # Bulk index
    logger.info(f"Bulk indexing {len(docs)} documents into '{index_name}'...")
    result = bulk_index(es, index_name, docs, batch_size=batch_size)
    
    logger.info(f"Indexing complete: {result['success']} indexed, {result['failed']} failed")
    
    return result


def update_document_field(es, index_name: str, doc_id: str, field: str, value) -> bool:
    """
    Update a single field in an existing document.
    
    Args:
        es: Elasticsearch client
        index_name: Index name
        doc_id: Document ID
        field: Field name to update
        value: New value
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        es.update(
            index=index_name,
            id=doc_id,
            body={"doc": {field: value}}
        )
        logger.debug(f"Updated document {doc_id}: {field} = {value}")
        return True
    except Exception as e:
        logger.error(f"Failed to update document {doc_id}: {e}")
        return False
