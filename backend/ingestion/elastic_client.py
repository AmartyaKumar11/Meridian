"""
Elasticsearch Client Factory and Helper Functions

Purpose:
    Provides reusable Elasticsearch client initialization and indexing utilities.
    Handles index creation, document indexing, and bulk operations.

Expected Output:
    - ES client instance configured from environment variables
    - Index creation with custom mappings
    - Single and bulk document indexing capabilities
"""

import logging
import os
from typing import Dict, List, Optional
from elasticsearch import Elasticsearch, helpers
from elasticsearch.exceptions import ConnectionError as ESConnectionError, RequestError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_es_client() -> Elasticsearch:
    """
    Create and return an Elasticsearch client instance.
    
    Reads configuration from environment variables:
        - ES_HOST: Elasticsearch host URL (default: http://localhost:9200)
        - ES_API_KEY: Optional API key for authentication
    
    Returns:
        Elasticsearch: Configured ES client instance
        
    Raises:
        ValueError: If connection to Elasticsearch fails
    """
    es_host = os.getenv("ES_HOST", "http://localhost:9200")
    es_api_key = os.getenv("ES_API_KEY")
    
    try:
        if es_api_key:
            es = Elasticsearch(
                es_host,
                api_key=es_api_key,
                verify_certs=False
            )
        else:
            es = Elasticsearch(
                es_host,
                verify_certs=False,
                request_timeout=30
            )
        
        # Test connection
        try:
            es.info()
            logger.info(f"Successfully connected to Elasticsearch at {es_host}")
        except Exception as e:
            logger.error(f"Elasticsearch ping failed: {e}")
            raise ValueError(f"Could not connect to Elasticsearch at {es_host}")
        
        return es
        
    except ESConnectionError as e:
        logger.error(f"Elasticsearch connection error: {e}")
        raise ValueError(f"Failed to connect to Elasticsearch: {e}")


def create_index_if_not_exists(es: Elasticsearch, index_name: str, mapping: Dict) -> bool:
    """
    Create an Elasticsearch index with the provided mapping if it doesn't exist.
    
    Args:
        es: Elasticsearch client instance
        index_name: Name of the index to create
        mapping: Index mapping configuration (mappings and settings)
        
    Returns:
        bool: True if index was created, False if it already existed
        
    Raises:
        RequestError: If index creation fails due to invalid mapping
    """
    try:
        if es.indices.exists(index=index_name):
            logger.info(f"Index '{index_name}' already exists")
            return False
        
        es.indices.create(index=index_name, body=mapping)
        logger.info(f"Successfully created index '{index_name}'")
        return True
        
    except RequestError as e:
        logger.error(f"Error creating index '{index_name}': {e}")
        raise


def index_document(es: Elasticsearch, index_name: str, doc: Dict, doc_id: Optional[str] = None) -> Dict:
    """
    Index a single document into Elasticsearch.
    
    Args:
        es: Elasticsearch client instance
        index_name: Target index name
        doc: Document to index (as dictionary)
        doc_id: Optional document ID (auto-generated if not provided)
        
    Returns:
        Dict: Elasticsearch response with indexing result
    """
    try:
        response = es.index(index=index_name, id=doc_id, document=doc)
        logger.debug(f"Indexed document into '{index_name}': {response['result']}")
        return response
        
    except Exception as e:
        logger.error(f"Error indexing document into '{index_name}': {e}")
        raise


def bulk_index(es: Elasticsearch, index_name: str, docs: List[Dict], batch_size: int = 500) -> Dict:
    """
    Bulk index multiple documents into Elasticsearch.
    
    Args:
        es: Elasticsearch client instance
        index_name: Target index name
        docs: List of documents to index
        batch_size: Number of documents to index per batch (default: 500)
        
    Returns:
        Dict: Summary with success/failure counts
        
    Example:
        result = bulk_index(es, "news", [{"title": "..."}, {"title": "..."}])
        # Returns: {"success": 2, "failed": 0, "errors": []}
    """
    if not docs:
        logger.warning("No documents to index")
        return {"success": 0, "failed": 0, "errors": []}
    
    # Prepare bulk actions
    actions = []
    for doc in docs:
        doc_copy = {k: v for k, v in doc.items() if k != "_id"}  # Remove _id from source
        action = {
            "_index": index_name,
            "_source": doc_copy,
        }
        if "_id" in doc and doc["_id"]:
            action["_id"] = doc["_id"]
        actions.append(action)
    
    try:
        success_count = 0
        failed_count = 0
        errors = []
        
        # Use helpers.bulk for efficient batching
        for ok, result in helpers.streaming_bulk(
            es,
            actions,
            chunk_size=batch_size,
            raise_on_error=False,
            raise_on_exception=False
        ):
            if ok:
                success_count += 1
            else:
                failed_count += 1
                errors.append(result)
                logger.warning(f"Failed to index document: {result}")
        
        logger.info(f"Bulk indexing complete: {success_count} successful, {failed_count} failed")
        
        return {
            "success": success_count,
            "failed": failed_count,
            "errors": errors
        }
        
    except Exception as e:
        logger.error(f"Error during bulk indexing: {e}")
        raise


def get_default_news_mapping() -> Dict:
    """
    Return default mapping for stock_news index.
    
    Returns:
        Dict: Elasticsearch mapping with all required fields
    """
    return {
        "mappings": {
            "properties": {
                "title": {"type": "text", "analyzer": "english"},
                "url": {"type": "keyword"},
                "company": {"type": "keyword"},
                "seendate": {"type": "date", "format": "strict_date_optional_time||epoch_millis"},
                "sourceCountry": {"type": "keyword"},
                "domain": {"type": "keyword"},
                "language": {"type": "keyword"},
                "fetched_at": {"type": "date", "format": "strict_date_optional_time||epoch_millis"},
                "sentiment_label": {"type": "keyword"},
                "sentiment_score": {"type": "float"},
                "summary": {"type": "text"},
                "keywords": {"type": "keyword"},
                "related_entities": {"type": "keyword"},
                "price_before": {"type": "float"},
                "price_after": {"type": "float"},
                "price_change_pct": {"type": "float"},
                "volume_before": {"type": "float"},
                "volume_after": {"type": "float"},
                "volatility_change": {"type": "float"},
                "impact_score": {"type": "float"},
                "embedding": {
                    "type": "dense_vector",
                    "dims": 768,
                    "index": True,
                    "similarity": "cosine"
                }
            }
        },
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "analysis": {
                "analyzer": {
                    "english": {
                        "type": "standard",
                        "stopwords": "_english_"
                    }
                }
            }
        }
    }
