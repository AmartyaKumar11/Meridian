import pandas as pd
import numpy as np

def calculate_returns(prices: pd.DataFrame) -> pd.DataFrame:
    """Calculate daily returns."""
    return prices.pct_change().dropna()

def expected_returns(prices: pd.DataFrame, method: str = "mean", annualize: bool = True) -> pd.Series:
    """
    Calculate expected returns.
    
    Args:
        prices: Adjusted close prices
        method: 'mean' or 'ewma'
        annualize: Whether to annualize (x252)
    """
    returns = calculate_returns(prices)
    
    if method == "ewma":
        # Exponentially Weighted Moving Average
        # Span = 252 (1 year) roughly
        mu = returns.ewm(span=252).mean().iloc[-1]
    else:
        # Historical Mean
        mu = returns.mean()
        
    if annualize:
        return mu * 252
    return mu

def covariance_matrix(prices: pd.DataFrame, method: str = "sample", annualize: bool = True) -> pd.DataFrame:
    """
    Calculate covariance matrix.
    
    Args:
        prices: Adjusted close prices
        method: 'sample' (default)
        annualize: Whether to annualize (x252)
    """
    returns = calculate_returns(prices)
    
    if method == "sample":
        cov = returns.cov()
    else:
        # Fallback to sample
        cov = returns.cov()
        
    if annualize:
        return cov * 252
    return cov
