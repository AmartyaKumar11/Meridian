import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json
import logging
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from cache.redis_client import get_redis_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketDataManager:
    def __init__(self):
        self.cache = get_redis_client()
        self.nifty50_tickers = [
            "RELIANCE.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS", "HDFC.NS", "TCS.NS", "ITC.NS",
            "KOTAKBANK.NS", "LT.NS", "AXISBANK.NS", "SBIN.NS", "HINDUNILVR.NS", "BHARTIARTL.NS",
            "BAJFINANCE.NS", "ASIANPAINT.NS", "MARUTI.NS", "HCLTECH.NS", "TITAN.NS", "BAJAJFINSV.NS",
            "SUNPHARMA.NS", "TECHM.NS", "WIPRO.NS", "ULTRACEMCO.NS", "NESTLEIND.NS", "ONGC.NS",
            "NTPC.NS", "POWERGRID.NS", "TATASTEEL.NS", "JSWSTEEL.NS", "GRASIM.NS", "ADANIENT.NS",
            "ADANIPORTS.NS", "TATAMOTORS.NS", "HINDALCO.NS", "DRREDDY.NS", "EICHERMOT.NS",
            "APOLLOHOSP.NS", "DIVISLAB.NS", "COALINDIA.NS", "CIPLA.NS", "BPCL.NS", "BRITANNIA.NS",
            "HEROMOTOCO.NS", "TATACONSUM.NS", "SBILIFE.NS", "UPL.NS", "INDUSINDBK.NS", "BAJAJ-AUTO.NS"
        ]
        # Note: HDFC.NS merged, but keeping for historical data if needed, or remove. 
        # Updated list might be needed.

    def fetch_history(self, tickers: List[str], start_date: str, end_date: str) -> pd.DataFrame:
        """
        Fetch historical adjusted close prices for a list of tickers.
        Returns a DataFrame with tickers as columns and dates as index.
        """
        # Check cache for each ticker? No, yfinance is fast for batch.
        # But we should cache the result.
        
        # Create a cache key based on sorted tickers and dates
        tickers_key = ",".join(sorted(tickers))
        cache_key = f"prices:{tickers_key}:{start_date}:{end_date}"
        
        if self.cache.enabled:
            try:
                cached_data = self.cache.redis_client.get(cache_key)
                if cached_data:
                    logger.info("Cache hit for price data")
                    # Deserialize from JSON
                    data_dict = json.loads(cached_data)
                    df = pd.DataFrame.from_dict(data_dict)
                    df.index = pd.to_datetime(df.index)
                    return df
            except Exception as e:
                logger.warning(f"Cache read error: {e}")

        logger.info(f"Fetching data for {len(tickers)} tickers from {start_date} to {end_date}")
        
        try:
            # yfinance download
            data = yf.download(tickers, start=start_date, end=end_date, progress=False)['Adj Close']
            
            if data.empty:
                raise ValueError("No data fetched")
            
            # Handle single ticker case (Series -> DataFrame)
            if isinstance(data, pd.Series):
                data = data.to_frame(name=tickers[0])
            
            # Fill missing values
            data = data.fillna(method='ffill').fillna(method='bfill')
            
            # Cache the result
            if self.cache.enabled:
                try:
                    # Serialize to JSON (dates to strings)
                    data_json = data.to_json(date_format='iso')
                    self.cache.redis_client.setex(cache_key, 86400, data_json) # 1 day TTL
                except Exception as e:
                    logger.warning(f"Cache write error: {e}")
            
            return data
            
        except Exception as e:
            logger.error(f"Error fetching data: {e}")
            raise

    def get_nifty50_tickers(self) -> List[str]:
        return self.nifty50_tickers

    def get_risk_free_rate(self) -> float:
        """Fetch 10Y India Bond Yield or use default."""
        try:
            # Ticker for India 10Y Bond Yield? 
            # Often '^IGSEC' or similar, but yfinance support varies.
            # Fallback to constant for MVP
            return 0.072  # 7.2%
        except:
            return 0.07
