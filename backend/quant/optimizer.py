import numpy as np
import pandas as pd
from scipy.optimize import minimize
from typing import Dict, Any, Tuple, List

class PortfolioOptimizer:
    def __init__(self, expected_returns: pd.Series, cov_matrix: pd.DataFrame, risk_free_rate: float = 0.07):
        self.mu = expected_returns.values
        self.sigma = cov_matrix.values
        self.tickers = expected_returns.index.tolist()
        self.rf = risk_free_rate
        self.n_assets = len(self.tickers)

    def _get_constraints(self, min_weight: float, max_weight: float) -> List[Dict]:
        # Sum of weights = 1
        constraints = [{'type': 'eq', 'fun': lambda x: np.sum(x) - 1}]
        return constraints

    def _get_bounds(self, min_weight: float, max_weight: float) -> Tuple:
        return tuple((min_weight, max_weight) for _ in range(self.n_assets))

    def max_sharpe(self, min_weight: float = 0.0, max_weight: float = 1.0) -> Dict[str, float]:
        """Maximize Sharpe Ratio."""
        def neg_sharpe(weights):
            p_ret = np.sum(weights * self.mu)
            p_vol = np.sqrt(np.dot(weights.T, np.dot(self.sigma, weights)))
            return - (p_ret - self.rf) / p_vol

        constraints = self._get_constraints(min_weight, max_weight)
        bounds = self._get_bounds(min_weight, max_weight)
        
        # Initial guess: Equal weights
        init_guess = np.array([1/self.n_assets] * self.n_assets)
        
        # Add iteration limit and tolerance for faster convergence
        options = {'maxiter': 200, 'ftol': 1e-5}
        result = minimize(neg_sharpe, init_guess, method='SLSQP', bounds=bounds, 
                         constraints=constraints, options=options)
        
        return self._format_result(result.x)

    def min_volatility(self, min_weight: float = 0.0, max_weight: float = 1.0) -> Dict[str, float]:
        """Minimize Volatility."""
        def volatility(weights):
            return np.sqrt(np.dot(weights.T, np.dot(self.sigma, weights)))

        constraints = self._get_constraints(min_weight, max_weight)
        bounds = self._get_bounds(min_weight, max_weight)
        
        init_guess = np.array([1/self.n_assets] * self.n_assets)
        
        options = {'maxiter': 500, 'ftol': 1e-6}
        result = minimize(volatility, init_guess, method='SLSQP', bounds=bounds, 
                         constraints=constraints, options=options)
        
        return self._format_result(result.x)

    def risk_parity(self, min_weight: float = 0.0, max_weight: float = 1.0) -> Dict[str, float]:
        """Risk Parity (Equal Risk Contribution)."""
        def risk_budget_objective(weights):
            p_vol = np.sqrt(np.dot(weights.T, np.dot(self.sigma, weights)))
            risk_contributions = weights * np.dot(self.sigma, weights) / p_vol
            target_risk = p_vol / self.n_assets
            return np.sum((risk_contributions - target_risk)**2)

        constraints = self._get_constraints(min_weight, max_weight)
        bounds = self._get_bounds(min_weight, max_weight)
        
        init_guess = np.array([1/self.n_assets] * self.n_assets)
        
        options = {'maxiter': 500, 'ftol': 1e-6}
        result = minimize(risk_budget_objective, init_guess, method='SLSQP', bounds=bounds, 
                         constraints=constraints, options=options)
        
        return self._format_result(result.x)

    def _format_result(self, weights: np.array) -> Dict[str, float]:
        """Format weights into a dictionary."""
        # Clean small weights
        weights[weights < 0.0001] = 0
        weights = weights / np.sum(weights) # Renormalize
        
        return dict(zip(self.tickers, weights))

    def calculate_metrics(self, weights_dict: Dict[str, float]) -> Dict[str, float]:
        """Calculate portfolio metrics for given weights."""
        weights = np.array([weights_dict.get(t, 0) for t in self.tickers])
        
        p_ret = np.sum(weights * self.mu)
        p_vol = np.sqrt(np.dot(weights.T, np.dot(self.sigma, weights)))
        sharpe = (p_ret - self.rf) / p_vol
        
        return {
            "expected_return": p_ret,
            "volatility": p_vol,
            "sharpe_ratio": sharpe
        }
