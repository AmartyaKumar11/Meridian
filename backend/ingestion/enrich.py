"""
Data Enrichment and Entity Extraction

Purpose:
    Cleans text, extracts entities, aligns news with stock prices,
    and computes impact scores combining sentiment and price movement.

Expected Output:
    Enriched DataFrame with price metrics, impact scores, and entities
"""

import logging
import re
from typing import List, Optional

import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lazy-load spaCy for NER
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    SPACY_AVAILABLE = True
    logger.info("spaCy loaded successfully for entity extraction")
except Exception as e:
    logger.warning(f"spaCy not available: {e}. Entity extraction will be skipped.")
    nlp = None
    SPACY_AVAILABLE = False


def clean_text(text: str) -> str:
    """
    Clean text by removing HTML entities, extra whitespace, and special characters.
    
    Args:
        text: Raw text string
        
    Returns:
        str: Cleaned text
    """
    if not text:
        return ""
    
    # Remove HTML entities
    text = re.sub(r'&[a-z]+;', ' ', text)
    text = re.sub(r'&#\d+;', ' ', text)
    
    # Remove URLs
    text = re.sub(r'https?://\S+', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def compute_sentiment_score(sentiment_label: str, sentiment_prob: float) -> float:
    """
    Convert sentiment label and probability to a numeric score.
    
    Score mapping:
        - positive: +sentiment_prob (range: 0 to +1)
        - negative: -sentiment_prob (range: -1 to 0)
        - neutral: 0
    
    Args:
        sentiment_label: "positive", "negative", or "neutral"
        sentiment_prob: Confidence score (0-1)
        
    Returns:
        float: Numeric sentiment score (-1 to +1)
    """
    if sentiment_label == "positive":
        return sentiment_prob
    elif sentiment_label == "negative":
        return -sentiment_prob
    else:
        return 0.0


def extract_entities(text: str) -> List[str]:
    """
    Extract named entities from text using spaCy NER.
    
    Args:
        text: Input text
        
    Returns:
        List[str]: List of entity texts (ORG, PERSON, GPE, etc.)
    """
    if not SPACY_AVAILABLE or not text:
        return []
    
    try:
        doc = nlp(text[:500])  # Limit to first 500 chars for performance
        entities = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PERSON", "GPE", "PRODUCT"]]
        return list(set(entities))  # Deduplicate
    except Exception as e:
        logger.warning(f"Entity extraction failed: {e}")
        return []


def enrich_news_with_price(
    news_df: pd.DataFrame,
    price_df: pd.DataFrame,
    company_ticker_map: Optional[dict] = None
) -> pd.DataFrame:
    """
    Enrich news DataFrame with stock price metrics and impact scores.
    
    Process:
        1. Align each news article to nearest market timestamp
        2. Compute event window metrics (price change, volume, volatility)
        3. Calculate impact_score = |sentiment_score| * |price_change_pct|
        4. Extract entities from title
    
    Impact Score Formula:
        impact_score = |sentiment_score| * |price_change_pct| / 10
        - Higher absolute sentiment + larger price move = higher impact
        - Normalized by dividing by 10 for interpretability
    
    Args:
        news_df: News DataFrame with sentiment_label, sentiment_score, seendate
        price_df: Price DataFrame with OHLCV data (DatetimeIndex)
        company_ticker_map: Optional mapping of company names to tickers
        
    Returns:
        pd.DataFrame: Enriched news with price metrics and impact scores
    """
    if news_df.empty or price_df.empty:
        logger.warning("Empty news or price data. Skipping enrichment.")
        return news_df
    
    from .stock_data import compute_event_window_metrics
    
    enriched_rows = []
    
    for idx, row in news_df.iterrows():
        enriched_row = row.to_dict()
        
        try:
            # Compute numeric sentiment score
            sentiment_score_numeric = compute_sentiment_score(
                row.get("sentiment_label", "neutral"),
                row.get("sentiment_score", 0.5)
            )
            enriched_row["sentiment_score_numeric"] = sentiment_score_numeric
            
            # Get event date
            event_date = row.get("seendate")
            if pd.isna(event_date):
                enriched_row.update({
                    "price_before": None,
                    "price_after": None,
                    "price_change_pct": None,
                    "volume_before": None,
                    "volume_after": None,
                    "volatility_change": None,
                    "impact_score": 0.0
                })
            else:
                # Compute event window metrics
                metrics = compute_event_window_metrics(price_df, str(event_date))
                enriched_row.update(metrics)
                
                # Compute impact score
                price_change = metrics.get("price_change_pct", 0) or 0
                impact_score = abs(sentiment_score_numeric) * abs(price_change) / 10.0
                enriched_row["impact_score"] = impact_score
            
            # Extract entities from title
            title = row.get("title", "")
            entities = extract_entities(clean_text(title))
            enriched_row["related_entities"] = entities
            
            enriched_rows.append(enriched_row)
            
        except Exception as e:
            logger.warning(f"Error enriching row {idx}: {e}")
            enriched_rows.append(enriched_row)
    
    enriched_df = pd.DataFrame(enriched_rows)
    logger.info(f"Enriched {len(enriched_df)} news articles with price metrics")
    
    return enriched_df


def compute_daily_aggregates(news_df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate news by day: count, average sentiment, etc.
    
    Args:
        news_df: News DataFrame with seendate and sentiment_score
        
    Returns:
        pd.DataFrame: Daily aggregates (date, news_count, avg_sentiment, etc.)
    """
    if news_df.empty or "seendate" not in news_df.columns:
        return pd.DataFrame()
    
    try:
        daily_df = news_df.copy()
        daily_df["date"] = pd.to_datetime(daily_df["seendate"]).dt.date
        
        aggregates = daily_df.groupby("date").agg({
            "sentiment_score": ["mean", "std", "count"],
            "impact_score": "mean"
        }).reset_index()
        
        aggregates.columns = ["date", "avg_sentiment", "sentiment_std", "news_count", "avg_impact"]
        
        logger.info(f"Computed daily aggregates for {len(aggregates)} days")
        return aggregates
        
    except Exception as e:
        logger.error(f"Error computing daily aggregates: {e}")
        return pd.DataFrame()
