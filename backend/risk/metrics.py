import numpy as np
import pandas as pd
from typing import Dict, Any

class RiskMetrics:
    def __init__(self, weights: Dict[str, float], returns: pd.DataFrame, risk_free_rate: float = 0.07):
        self.weights_dict = weights
        self.returns = returns
        self.rf = risk_free_rate
        
        # Align weights with returns columns
        self.tickers = returns.columns.tolist()
        self.weights = np.array([weights.get(t, 0) for t in self.tickers])
        
        # Portfolio returns series
        self.portfolio_returns = returns.dot(self.weights)
        
        # Annualized stats
        self.mean_return = self.portfolio_returns.mean() * 252
        self.volatility = self.portfolio_returns.std() * np.sqrt(252)

    def calculate_all(self) -> Dict[str, Any]:
        return {
            "expected_return": self.mean_return,
            "volatility": self.volatility,
            "sharpe_ratio": self.sharpe_ratio(),
            "sortino_ratio": self.sortino_ratio(),
            "max_drawdown": self.max_drawdown(),
            "var_95": self.value_at_risk(0.95),
            "cvar_95": self.conditional_value_at_risk(0.95),
            "beta": self.beta(), # Needs benchmark, will implement simplified
            "diversification_ratio": self.diversification_ratio()
        }

    def sharpe_ratio(self) -> float:
        if self.volatility == 0: return 0
        return (self.mean_return - self.rf) / self.volatility

    def sortino_ratio(self) -> float:
        downside_returns = self.portfolio_returns[self.portfolio_returns < 0]
        downside_std = downside_returns.std() * np.sqrt(252)
        if downside_std == 0: return 0
        return (self.mean_return - self.rf) / downside_std

    def max_drawdown(self) -> float:
        cumulative = (1 + self.portfolio_returns).cumprod()
        peak = cumulative.expanding(min_periods=1).max()
        drawdown = (cumulative / peak) - 1
        return float(drawdown.min())

    def value_at_risk(self, confidence: float = 0.95) -> float:
        # Historical VaR
        return float(np.percentile(self.portfolio_returns, (1 - confidence) * 100))

    def conditional_value_at_risk(self, confidence: float = 0.95) -> float:
        var = self.value_at_risk(confidence)
        return float(self.portfolio_returns[self.portfolio_returns <= var].mean())

    def diversification_ratio(self) -> float:
        # Weighted average vol / Portfolio vol
        asset_vols = self.returns.std() * np.sqrt(252)
        weighted_avg_vol = np.sum(self.weights * asset_vols)
        if self.volatility == 0: return 0
        return float(weighted_avg_vol / self.volatility)

    def beta(self) -> float:
        # Simplified Beta against Nifty 50 (assuming first column or passed separately)
        # For now, returning 1.0 placeholder as we need benchmark data passed in
        return 1.0
