import numpy as np
import pandas as pd
from typing import Dict, List, Any

class MonteCarloSimulator:
    def __init__(self, weights: Dict[str, float], mu: pd.Series, sigma: pd.DataFrame, initial_capital: float):
        self.weights = np.array([weights.get(t, 0) for t in mu.index])
        self.mu = mu.values
        self.sigma = sigma.values
        self.initial_capital = initial_capital
        self.n_assets = len(mu)
        
        # Portfolio stats
        self.p_ret = np.sum(self.weights * self.mu)
        self.p_vol = np.sqrt(np.dot(self.weights.T, np.dot(self.sigma, self.weights)))

    def run_simulation(self, n_simulations: int = 1000, horizon_years: int = 5) -> Dict[str, Any]:
        """
        Run Monte Carlo simulation for portfolio value.
        Using Geometric Brownian Motion.
        """
        dt = 1/252
        n_steps = int(horizon_years * 252)
        
        # Simulation of Portfolio Return directly (simpler than individual assets)
        # dS/S = mu*dt + sigma*dW
        
        # Generate random shocks
        # shape: (n_simulations, n_steps)
        shocks = np.random.normal(0, 1, (n_simulations, n_steps))
        
        # Calculate daily returns
        # drift = (mu - 0.5 * sigma^2) * dt
        drift = (self.p_ret - 0.5 * self.p_vol**2) * dt
        diffusion = self.p_vol * np.sqrt(dt) * shocks
        
        daily_returns = np.exp(drift + diffusion)
        
        # Cumulative returns
        price_paths = np.zeros((n_simulations, n_steps + 1))
        price_paths[:, 0] = self.initial_capital
        
        # Vectorized cumulative product
        price_paths[:, 1:] = self.initial_capital * np.cumprod(daily_returns, axis=1)
        
        # Analysis
        final_values = price_paths[:, -1]
        
        return {
            "n_simulations": n_simulations,
            "horizon_years": horizon_years,
            "expected_value": {
                "mean": float(np.mean(final_values)),
                "median": float(np.median(final_values)),
                "std": float(np.std(final_values))
            },
            "confidence_intervals": {
                "ci_90": [float(np.percentile(final_values, 5)), float(np.percentile(final_values, 95))],
                "ci_95": [float(np.percentile(final_values, 2.5)), float(np.percentile(final_values, 97.5))]
            },
            "chart_data": {
                # Return a subset of paths for visualization (e.g., 50 paths)
                "sample_paths": price_paths[:50, ::20].tolist(), # Downsample time steps
                "percentiles": {
                    "p10": np.percentile(price_paths, 10, axis=0)[::20].tolist(),
                    "p50": np.percentile(price_paths, 50, axis=0)[::20].tolist(),
                    "p90": np.percentile(price_paths, 90, axis=0)[::20].tolist()
                }
            }
        }
