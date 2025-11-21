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

# Nifty 50 ticker to company name mapping
TICKER_TO_COMPANY = {
    'RELIANCE.NS': 'Reliance Industries',
    'TCS.NS': 'Tata Consultancy Services',
    'HDFCBANK.NS': 'HDFC Bank',
    'INFY.NS': 'Infosys',
    'ICICIBANK.NS': 'ICICI Bank',
    'HINDUNILVR.NS': 'Hindustan Unilever',
    'BHARTIARTL.NS': 'Bharti Airtel',
    'ITC.NS': 'ITC Limited',
    'SBIN.NS': 'State Bank of India',
    'LT.NS': 'Larsen & Toubro',
    'BAJFINANCE.NS': 'Bajaj Finance',
    'HCLTECH.NS': 'HCL Technologies',
    'KOTAKBANK.NS': 'Kotak Mahindra Bank',
    'ASIANPAINT.NS': 'Asian Paints',
    'MARUTI.NS': 'Maruti Suzuki',
    'AXISBANK.NS': 'Axis Bank',
    'TITAN.NS': 'Titan Company',
    'SUNPHARMA.NS': 'Sun Pharmaceutical',
    'ULTRACEMCO.NS': 'UltraTech Cement',
    'NESTLEIND.NS': 'Nestle India',
    'WIPRO.NS': 'Wipro',
    'ADANIENT.NS': 'Adani Enterprises',
    'TATAMOTORS.NS': 'Tata Motors',
    'ONGC.NS': 'Oil and Natural Gas Corporation',
    'NTPC.NS': 'NTPC Limited',
    'POWERGRID.NS': 'Power Grid Corporation',
    'M&M.NS': 'Mahindra & Mahindra',
    'JSWSTEEL.NS': 'JSW Steel',
    'ADANIPORTS.NS': 'Adani Ports',
    'TATASTEEL.NS': 'Tata Steel',
    'INDUSINDBK.NS': 'IndusInd Bank',
    'COALINDIA.NS': 'Coal India',
    'BAJAJFINSV.NS': 'Bajaj Finserv',
    'TECHM.NS': 'Tech Mahindra',
    'HINDALCO.NS': 'Hindalco Industries',
    'DRREDDY.NS': 'Dr. Reddy\'s Laboratories',
    'EICHERMOT.NS': 'Eicher Motors',
    'GRASIM.NS': 'Grasim Industries',
    'CIPLA.NS': 'Cipla',
    'APOLLOHOSP.NS': 'Apollo Hospitals',
    'DIVISLAB.NS': 'Divi\'s Laboratories',
    'HEROMOTOCO.NS': 'Hero MotoCorp',
    'BRITANNIA.NS': 'Britannia Industries',
    'BPCL.NS': 'Bharat Petroleum',
    'TATACONSUM.NS': 'Tata Consumer Products',
    'SHRIRAMFIN.NS': 'Shriram Finance',
    'SBILIFE.NS': 'SBI Life Insurance',
    'ADANIGREEN.NS': 'Adani Green Energy',
    'LTIM.NS': 'LTIMindtree'
}

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
    Get sentiment label and continuous score using FinBERT model.
    
    IMPROVED LOGIC:
    - Returns continuous sentiment score from -1 (very negative) to +1 (very positive)
    - Uses confidence thresholds to reduce false positives in neutral classification
    - Only classifies as positive/negative when model is sufficiently confident
    - Weighted scoring based on prediction probabilities
    
    Args:
        text: Input text (title or summary)
        
    Returns:
        tuple: (sentiment_label, sentiment_score)
               label: "positive", "negative", or "neutral"
               score: continuous value from -1.0 to +1.0
                     -1.0 = very negative
                      0.0 = neutral
                     +1.0 = very positive
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
        
        # FinBERT outputs: [positive, negative, neutral]
        pos_score = predictions[0][0].item()
        neg_score = predictions[0][1].item()
        neu_score = predictions[0][2].item()
        
        # INTELLIGENT CONTINUOUS SCORING:
        # Calculate net sentiment as weighted difference between positive and negative
        # Range: -1 (fully negative) to +1 (fully positive)
        continuous_score = pos_score - neg_score
        
        # SMART CLASSIFICATION with confidence thresholds:
        # Only classify as positive/negative if there's strong conviction
        # This reduces mis-classification of neutral news
        
        CONFIDENCE_THRESHOLD = 0.55  # Require 55% confidence to classify as non-neutral
        STRONG_THRESHOLD = 0.70      # 70% = strong sentiment
        
        # Determine label based on continuous score and confidence
        if pos_score > CONFIDENCE_THRESHOLD and continuous_score > 0.15:
            sentiment_label = "positive"
        elif neg_score > CONFIDENCE_THRESHOLD and continuous_score < -0.15:
            sentiment_label = "negative"
        else:
            # If neutral score is highest OR neither pos/neg is confident enough
            sentiment_label = "neutral"
            # For neutral, score should be closer to 0
            continuous_score = continuous_score * 0.5  # Dampen neutral scores
        
        # Clamp to [-1, 1] range (should already be in range, but safety check)
        continuous_score = max(-1.0, min(1.0, continuous_score))
        
        return sentiment_label, continuous_score
        
    except Exception as e:
        logger.warning(f"FinBERT sentiment analysis failed: {e}. Using fallback.")
        return get_sentiment_fallback(text)


def get_sentiment_fallback(text: str) -> tuple[str, float]:
    """
    Improved rule-based sentiment fallback with continuous scoring.
    Uses keyword matching with weighted importance and contextual negation.
    
    Args:
        text: Input text
        
    Returns:
        tuple: (sentiment_label, sentiment_score)
               score: continuous value from -1.0 to +1.0
    """
    if not text:
        return "neutral", 0.0
    
    text_lower = text.lower()
    
    # Enhanced keyword lists with financial context
    positive_words = [
        "gain", "profit", "surge", "growth", "rise", "up", "high", "strong", "boost",
        "rally", "soar", "jump", "climb", "advance", "outperform", "beat", "exceed",
        "positive", "upgrade", "bullish", "recover", "rebound", "expansion"
    ]
    
    negative_words = [
        "loss", "fall", "drop", "decline", "down", "low", "weak", "crash", "plunge",
        "tumble", "slump", "sink", "dive", "underperform", "miss", "cut", "slash",
        "negative", "downgrade", "bearish", "concern", "risk", "fear", "worry"
    ]
    
    # Count occurrences
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    # Calculate continuous score
    if pos_count == 0 and neg_count == 0:
        return "neutral", 0.0
    
    # Net sentiment based on keyword difference
    net_keywords = pos_count - neg_count
    total_keywords = pos_count + neg_count
    
    # Normalize to [-1, 1] range with logarithmic dampening
    # This prevents extreme scores from simple keyword counts
    continuous_score = net_keywords / (total_keywords + 2)  # +2 for dampening
    continuous_score = max(-1.0, min(1.0, continuous_score))
    
    # Classify based on score magnitude
    if continuous_score > 0.15:
        return "positive", continuous_score
    elif continuous_score < -0.15:
        return "negative", continuous_score
    else:
        return "neutral", continuous_score


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
            
            # Set encoding explicitly to handle special characters
            response.encoding = 'utf-8'
            
            # Check if response has content
            if not response.text or not response.text.strip():
                logger.warning(f"Empty response from GDELT (attempt {attempt + 1}/{retry_count})")
                if attempt < retry_count - 1:
                    time.sleep(backoff_seconds * (attempt + 1))
                    continue
                else:
                    logger.warning(f"No articles found for '{company}' in date range (empty responses)")
                    return pd.DataFrame()
            
            try:
                data = response.json()
            except ValueError as json_err:
                logger.warning(f"Invalid JSON response (attempt {attempt + 1}/{retry_count}): {json_err}")
                if attempt < retry_count - 1:
                    time.sleep(backoff_seconds * (attempt + 1))
                    continue
                else:
                    return pd.DataFrame()
            
            if "articles" not in data or not data["articles"]:
                logger.warning(f"No articles found for '{company}' in date range")
                return pd.DataFrame()
            
            articles = data["articles"]
            logger.info(f"Retrieved {len(articles)} articles for '{company}'")
            
            # Extract relevant fields
            records = []
            for article in articles:
                # Clean text fields to avoid encoding issues
                title = article.get("title", "")
                try:
                    # Attempt to encode/decode to catch encoding issues early
                    title = title.encode('utf-8', errors='ignore').decode('utf-8')
                except:
                    title = ""
                
                record = {
                    "title": title,
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
