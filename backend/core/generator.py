from typing import Dict, Any
import pandas as pd
import logging
from datetime import datetime, timedelta

from core.input_schema import PortfolioInput
from data.market_data import MarketDataManager
from quant.estimators import expected_returns, covariance_matrix
from quant.optimizer import PortfolioOptimizer
from core.post_processor import PostProcessor
from risk.metrics import RiskMetrics
from simulation.monte_carlo import MonteCarloSimulator

logger = logging.getLogger(__name__)

class PortfolioGenerator:
    def __init__(self):
        self.data_manager = MarketDataManager()

    def generate_portfolio(self, inputs: PortfolioInput) -> Dict[str, Any]:
        """
        Orchestrate the portfolio generation process.
        """
        import time
        start_time = time.time()
        logger.info(f"[STAGE 0] Starting portfolio generation for {inputs.stock_universe}")
        
        # 1. Define Universe
        logger.info(f"[STAGE 1] Defining stock universe...")
        if inputs.stock_universe == "NIFTY50":
            tickers = self.data_manager.get_nifty50_tickers()
        elif inputs.stock_universe == "CUSTOM":
            tickers = inputs.custom_tickers
        else:
            # Fallback or NIFTY500 (not fully implemented)
            tickers = self.data_manager.get_nifty50_tickers()
        logger.info(f"[STAGE 1] Selected {len(tickers)} tickers - {time.time() - start_time:.2f}s")
            
        # 2. Fetch Data
        logger.info(f"[STAGE 2] Fetching historical data...")
        stage_start = time.time()
        # Fetch 5 years of data for robust estimation
        end_date_str = inputs.end_date.strftime("%Y-%m-%d")
        start_date_hist = (inputs.start_date - timedelta(days=5*365)).strftime("%Y-%m-%d")
        
        prices_df = self.data_manager.fetch_history(tickers, start_date_hist, end_date_str)
        logger.info(f"[STAGE 2] Data fetched: {prices_df.shape} - {time.time() - stage_start:.2f}s")
        
        # 3. Estimate Parameters
        logger.info(f"[STAGE 3] Estimating expected returns and covariance...")
        stage_start = time.time()
        mu = expected_returns(prices_df, method="ewma")
        sigma = covariance_matrix(prices_df, method="sample")
        rf = self.data_manager.get_risk_free_rate()
        logger.info(f"[STAGE 3] Parameters estimated - {time.time() - stage_start:.2f}s")
        
        # 4. Optimize
        logger.info(f"[STAGE 4] Running optimization ({inputs.optimization_method})...")
        stage_start = time.time()
        optimizer = PortfolioOptimizer(mu, sigma, risk_free_rate=rf)
        
        if inputs.optimization_method == "max_sharpe":
            weights = optimizer.max_sharpe(inputs.min_weight_per_stock, inputs.max_weight_per_stock)
        elif inputs.optimization_method == "min_volatility":
            weights = optimizer.min_volatility(inputs.min_weight_per_stock, inputs.max_weight_per_stock)
        elif inputs.optimization_method == "risk_parity":
            weights = optimizer.risk_parity(inputs.min_weight_per_stock, inputs.max_weight_per_stock)
        else:
            weights = optimizer.max_sharpe(inputs.min_weight_per_stock, inputs.max_weight_per_stock)
        logger.info(f"[STAGE 4] Optimization complete - {time.time() - stage_start:.2f}s")
            
        # 5. Post-Process (Allocation)
        logger.info(f"[STAGE 5] Processing allocations...")
        stage_start = time.time()
        current_prices = prices_df.iloc[-1].to_dict()
        post_processor = PostProcessor(inputs.initial_capital, inputs.transaction_cost_pct)
        allocation_result = post_processor.process_weights(weights, current_prices)
        logger.info(f"[STAGE 5] Allocations processed - {time.time() - stage_start:.2f}s")
        
        # 6. Risk Analysis
        logger.info(f"[STAGE 6] Calculating risk metrics...")
        stage_start = time.time()
        risk_engine = RiskMetrics(weights, calculate_returns(prices_df), rf)
        risk_metrics = risk_engine.calculate_all()
        logger.info(f"[STAGE 6] Risk metrics calculated - {time.time() - stage_start:.2f}s")
        
        # 7. Simulation
        logger.info(f"[STAGE 7] Running Monte Carlo simulation (100 iterations)...")
        stage_start = time.time()
        simulator = MonteCarloSimulator(weights, mu, sigma, inputs.initial_capital)
        simulation_results = simulator.run_simulation(n_simulations=100, horizon_years=5)
        logger.info(f"[STAGE 7] Simulation complete - {time.time() - stage_start:.2f}s")
        
        # 8. Construct Final Output
        logger.info(f"[STAGE 8] Constructing final output...")
        total_time = time.time() - start_time
        logger.info(f"[COMPLETE] Portfolio generation finished in {total_time:.2f}s")
        
        return {
            "portfolio_summary": {
                "initial_capital": inputs.initial_capital,
                "optimization_method": inputs.optimization_method,
                "stock_universe": inputs.stock_universe,
                "timestamp": datetime.now().isoformat(),
                "generation_time_seconds": round(total_time, 2)
            },
            "holdings": allocation_result["positions"],
            "cash_summary": allocation_result["summary"],
            "risk_metrics": risk_metrics,
            "simulation": simulation_results,
            "weights": weights
        }

def calculate_returns(prices):
    return prices.pct_change().dropna()
