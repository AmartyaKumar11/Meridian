"""
GDELT News Ingestion with FinBERT Sentiment Analysis

Purpose:
    Fetches news articles from GDELT DOC API for specified companies and date ranges.
    Enriches articles with FinBERT-based sentiment analysis (positive/negative/neutral).
    Returns a clean pandas DataFrame ready for further enrichment and indexing.

Expected Output:
    DataFrame with columns: title, url, sourceCountry, seendate, domain, language,
    company, fetched_at, sentiment_label, sentiment_score
"""

import logging
import os
import time
from datetime import datetime, timedelta
from typing import List, Optional
from urllib.parse import quote

import pandas as pd
import requests
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load FinBERT model at module import for efficient reuse
# Fallback to simple rule-based sentiment if model loading fails
try:
    logger.info("Loading FinBERT sentiment model...")
    FINBERT_MODEL_NAME = "ProsusAI/finbert"
    finbert_tokenizer = AutoTokenizer.from_pretrained(FINBERT_MODEL_NAME)
    finbert_model = AutoModelForSequenceClassification.from_pretrained(FINBERT_MODEL_NAME)
    finbert_model.eval()
    FINBERT_AVAILABLE = True
    logger.info("FinBERT model loaded successfully")
except Exception as e:
    logger.warning(f"Failed to load FinBERT model: {e}. Using rule-based fallback.")
    finbert_tokenizer = None
    finbert_model = None
    FINBERT_AVAILABLE = False


def get_sentiment_finbert(text: str) -> tuple[str, float]:
    """
    Get sentiment label and score using FinBERT model.
    
    Args:
        text: Input text (title or summary)
        
    Returns:
        tuple: (sentiment_label, sentiment_score)
               label: "positive", "negative", or "neutral"
               score: confidence score (0-1)
    """
    if not FINBERT_AVAILABLE or not text:
        return get_sentiment_fallback(text)
    
    try:
        inputs = finbert_tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        )
        
        with torch.no_grad():
            outputs = finbert_model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # FinBERT labels: [positive, negative, neutral]
        scores = predictions[0].tolist()
        labels = ["positive", "negative", "neutral"]
        
        max_idx = scores.index(max(scores))
        sentiment_label = labels[max_idx]
        sentiment_score = scores[max_idx]
        
        return sentiment_label, sentiment_score
        
    except Exception as e:
        logger.warning(f"FinBERT sentiment analysis failed: {e}. Using fallback.")
        return get_sentiment_fallback(text)


def get_sentiment_fallback(text: str) -> tuple[str, float]:
    """
    Simple rule-based sentiment fallback (keyword matching).
    
    Args:
        text: Input text
        
    Returns:
        tuple: (sentiment_label, sentiment_score)
    """
    if not text:
        return "neutral", 0.5
    
    text_lower = text.lower()
    positive_words = ["gain", "profit", "surge", "growth", "rise", "up", "high", "strong", "boost"]
    negative_words = ["loss", "fall", "drop", "decline", "down", "low", "weak", "crash", "plunge"]
    
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if pos_count > neg_count:
        return "positive", min(0.6 + (pos_count * 0.05), 0.9)
    elif neg_count > pos_count:
        return "negative", min(0.6 + (neg_count * 0.05), 0.9)
    else:
        return "neutral", 0.5


def fetch_gdelt_news(
    company: str,
    start_date: str,
    end_date: str,
    max_records: int = 250,
    retry_count: int = 3,
    backoff_seconds: int = 2
) -> pd.DataFrame:
    """
    Fetch news articles from GDELT DOC API for a given company and date range.
    
    Args:
        company: Company name or ticker to search
        start_date: Start date in format YYYYMMDD or YYYYMMDDHHMMSS
        end_date: End date in format YYYYMMDD or YYYYMMDDHHMMSS
        max_records: Maximum number of records to fetch (default: 250)
        retry_count: Number of retries on failure (default: 3)
        backoff_seconds: Backoff time between retries (default: 2s)
        
    Returns:
        pd.DataFrame: Enriched news data with sentiment
        
    Example:
        df = fetch_gdelt_news("Reliance", "20251001", "20251007", max_records=100)
    """
    base_url = "https://api.gdeltproject.org/api/v2/doc/doc"
    
    # Normalize date format (ensure YYYYMMDDHHMMSS)
    if len(start_date) == 8:
        start_date = start_date + "000000"
    if len(end_date) == 8:
        end_date = end_date + "235959"
    
    # Build query parameters
    params = {
        "query": company,
        "mode": "artlist",
        "maxrecords": max_records,
        "startdatetime": start_date,
        "enddatetime": end_date,
        "format": "json"
    }
    
    logger.info(f"Fetching GDELT news for '{company}' from {start_date} to {end_date}")
    
    for attempt in range(retry_count):
        try:
            response = requests.get(base_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if "articles" not in data or not data["articles"]:
                logger.warning(f"No articles found for '{company}' in date range")
                return pd.DataFrame()
            
            articles = data["articles"]
            logger.info(f"Retrieved {len(articles)} articles for '{company}'")
            
            # Extract relevant fields
            records = []
            for article in articles:
                record = {
                    "title": article.get("title", ""),
                    "url": article.get("url", ""),
                    "sourceCountry": article.get("sourcecountry", ""),
                    "seendate": article.get("seendate", ""),
                    "domain": article.get("domain", ""),
                    "language": article.get("language", ""),
                    "company": company,
                    "fetched_at": datetime.utcnow().isoformat()
                }
                records.append(record)
            
            df = pd.DataFrame(records)
            
            # Enrich with sentiment
            logger.info(f"Computing sentiment for {len(df)} articles...")
            sentiments = df["title"].apply(get_sentiment_finbert)
            df["sentiment_label"] = sentiments.apply(lambda x: x[0])
            df["sentiment_score"] = sentiments.apply(lambda x: x[1])
            
            # Convert seendate to datetime (GDELT format: 20251108T003000Z)
            df["seendate"] = pd.to_datetime(df["seendate"], format="ISO8601", errors="coerce")
            
            logger.info(f"Successfully processed {len(df)} articles for '{company}'")
            return df
            
        except requests.exceptions.Timeout:
            logger.warning(f"GDELT API timeout (attempt {attempt + 1}/{retry_count})")
            if attempt < retry_count - 1:
                time.sleep(backoff_seconds * (attempt + 1))
            else:
                logger.error("Max retries reached. Returning empty DataFrame.")
                return pd.DataFrame()
                
        except requests.exceptions.RequestException as e:
            logger.error(f"GDELT API request failed: {e}")
            if attempt < retry_count - 1:
                time.sleep(backoff_seconds * (attempt + 1))
            else:
                return pd.DataFrame()
                
        except Exception as e:
            logger.error(f"Unexpected error fetching GDELT news: {e}")
            return pd.DataFrame()
    
    return pd.DataFrame()


def fetch_gdelt_news_multi_company(
    companies: List[str],
    start_date: str,
    end_date: str,
    max_records_per_company: int = 250
) -> pd.DataFrame:
    """
    Fetch GDELT news for multiple companies and concatenate results.
    
    Args:
        companies: List of company names/tickers
        start_date: Start date (YYYYMMDD)
        end_date: End date (YYYYMMDD)
        max_records_per_company: Max records per company (default: 250)
        
    Returns:
        pd.DataFrame: Combined news data for all companies
    """
    all_news = []
    
    for company in companies:
        logger.info(f"Processing company: {company}")
        df = fetch_gdelt_news(company, start_date, end_date, max_records_per_company)
        if not df.empty:
            all_news.append(df)
        time.sleep(1)  # Rate limiting: 1 second between companies
    
    if not all_news:
        logger.warning("No news articles found for any company")
        return pd.DataFrame()
    
    combined_df = pd.concat(all_news, ignore_index=True)
    logger.info(f"Total articles fetched: {len(combined_df)}")
    
    return combined_df
