"""
Stock Price Data Fetcher and Event Window Metrics

Purpose:
    Fetches OHLCV (Open, High, Low, Close, Volume) data from Yahoo Finance.
    Computes event-window metrics (price changes, volume, volatility) around news events.

Expected Output:
    - Price DataFrame with OHLCV data
    - Event window metrics (price_before, price_after, price_change_pct, etc.)
"""

import logging
from datetime import datetime, timedelta
from typing import Optional, Dict

import pandas as pd
import yfinance as yf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_stock_ohlcv(
    ticker: str,
    start_date: str,
    end_date: str,
    interval: str = "1d"
) -> pd.DataFrame:
    """
    Fetch OHLCV stock data from Yahoo Finance.
    
    Args:
        ticker: Stock ticker symbol (e.g., "RELIANCE.NS", "AAPL")
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        interval: Data interval (1d, 1h, 5m, etc.) - default: "1d"
        
    Returns:
        pd.DataFrame: Price data with columns [Open, High, Low, Close, Volume]
                      Index is DatetimeIndex
        
    Example:
        df = get_stock_ohlcv("RELIANCE.NS", "2025-10-01", "2025-10-07")
    """
    try:
        logger.info(f"Fetching stock data for {ticker} from {start_date} to {end_date}")
        
        stock = yf.Ticker(ticker)
        df = stock.history(start=start_date, end=end_date, interval=interval)
        
        if df.empty:
            logger.warning(f"No price data found for {ticker} in date range")
            return pd.DataFrame()
        
        # Ensure timezone-aware datetime index (convert to UTC)
        if df.index.tz is None:
            df.index = df.index.tz_localize("UTC")
        else:
            df.index = df.index.tz_convert("UTC")
        
        logger.info(f"Retrieved {len(df)} price records for {ticker}")
        return df[["Open", "High", "Low", "Close", "Volume"]]
        
    except Exception as e:
        logger.error(f"Error fetching stock data for {ticker}: {e}")
        return pd.DataFrame()


def compute_event_window_metrics(
    df_prices: pd.DataFrame,
    event_date: str,
    window_pre: int = 1,
    window_post: int = 3
) -> Dict[str, Optional[float]]:
    """
    Compute price and volume metrics around a news event.
    
    Event window logic:
        - price_before: Average close price in [event_date - window_pre, event_date)
        - price_after: Average close price in (event_date, event_date + window_post]
        - price_change_pct: ((price_after - price_before) / price_before) * 100
        - volume_before: Average volume before event
        - volume_after: Average volume after event
        - volatility_change: Change in standard deviation of returns
    
    Args:
        df_prices: DataFrame with OHLCV data (DatetimeIndex)
        event_date: Event date as string (YYYY-MM-DD or ISO format)
        window_pre: Days before event to average (default: 1)
        window_post: Days after event to average (default: 3)
        
    Returns:
        Dict with metrics:
            {
                "price_before": float,
                "price_after": float,
                "price_change_pct": float,
                "volume_before": float,
                "volume_after": float,
                "volatility_change": float
            }
        Returns None values if insufficient data
    """
    if df_prices.empty:
        return {
            "price_before": None,
            "price_after": None,
            "price_change_pct": None,
            "volume_before": None,
            "volume_after": None,
            "volatility_change": None
        }
    
    try:
        # Parse event date and make timezone-aware
        event_dt = pd.to_datetime(event_date)
        if event_dt.tz is None:
            event_dt = event_dt.tz_localize("UTC")
        else:
            event_dt = event_dt.tz_convert("UTC")
        
        # Define windows
        pre_start = event_dt - timedelta(days=window_pre)
        post_end = event_dt + timedelta(days=window_post)
        
        # Filter data for before and after windows
        df_before = df_prices[(df_prices.index >= pre_start) & (df_prices.index < event_dt)]
        df_after = df_prices[(df_prices.index > event_dt) & (df_prices.index <= post_end)]
        
        # Compute metrics
        price_before = df_before["Close"].mean() if not df_before.empty else None
        price_after = df_after["Close"].mean() if not df_after.empty else None
        
        price_change_pct = None
        if price_before and price_after:
            price_change_pct = ((price_after - price_before) / price_before) * 100
        
        volume_before = df_before["Volume"].mean() if not df_before.empty else None
        volume_after = df_after["Volume"].mean() if not df_after.empty else None
        
        # Compute volatility (std of daily returns)
        volatility_before = None
        volatility_after = None
        if not df_before.empty and len(df_before) > 1:
            returns_before = df_before["Close"].pct_change().dropna()
            volatility_before = returns_before.std()
        
        if not df_after.empty and len(df_after) > 1:
            returns_after = df_after["Close"].pct_change().dropna()
            volatility_after = returns_after.std()
        
        volatility_change = None
        if volatility_before is not None and volatility_after is not None:
            volatility_change = volatility_after - volatility_before
        
        return {
            "price_before": price_before,
            "price_after": price_after,
            "price_change_pct": price_change_pct,
            "volume_before": volume_before,
            "volume_after": volume_after,
            "volatility_change": volatility_change
        }
        
    except Exception as e:
        logger.error(f"Error computing event window metrics: {e}")
        return {
            "price_before": None,
            "price_after": None,
            "price_change_pct": None,
            "volume_before": None,
            "volume_after": None,
            "volatility_change": None
        }


def get_latest_price(ticker: str) -> Optional[float]:
    """
    Get the latest closing price for a ticker.
    
    Args:
        ticker: Stock ticker symbol
        
    Returns:
        float: Latest close price, or None if unavailable
    """
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1d")
        if not hist.empty:
            return hist["Close"].iloc[-1]
        return None
    except Exception as e:
        logger.error(f"Error fetching latest price for {ticker}: {e}")
        return None
