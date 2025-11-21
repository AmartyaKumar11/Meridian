# Master Prompt for the Entire Portfolio Generator System

You are building a complete quant based portfolio generator system. The system takes user inputs, processes market data, runs quantitative optimization algorithms, computes risk metrics, generates explanations, and returns a fully constructed investment portfolio with visual outputs.

Build the system using the following full specification. Follow this spec consistently in every module. Every module must follow the same architecture, inputs, constraints, and output structure.

## Section 1: User Inputs Required

### Core Parameters
1. Start date
2. End date or investment horizon (months)
3. Risk appetite (low, moderate, high)
4. Target return in percent (annualized)
5. Initial capital (INR)
6. Inflation rate (annualized %)

### Portfolio Constraints
7. Include sectors (list) - optional
8. Exclude sectors (list) - optional
9. Maximum weight per stock (default: 20%)
10. Minimum weight per stock (default: 2%)
11. Minimum number of stocks (default: 10)
12. Maximum number of stocks (default: 30)

### Advanced Options
13. Optimization method (max_sharpe | min_volatility | risk_parity | target_return)
14. Rebalancing frequency (monthly | quarterly | yearly | threshold_based)
15. Rebalancing threshold (% deviation from target weights, default: 5%)
16. Transaction cost percentage (default: 0.5%)
17. Minimum trade size (default: ₹5000)
18. Include transaction costs in optimization (yes/no, default: yes)

## Section 2: Input to Constraint Mapping
Translate user inputs into mathematical constraints for optimization.

### Risk Appetite Mapping
- **Low**: Max portfolio volatility = 12% annualized, Min bonds/stable assets = 30%
- **Moderate**: Max portfolio volatility = 18% annualized, Min bonds/stable assets = 15%
- **High**: Max portfolio volatility = 25% annualized, No minimum stable assets

### Target Return Adjustment
- Real target return = Target return - Inflation rate
- Constraint: Expected portfolio return ≥ Real target return

### Horizon Mapping
- Short-term (<1 year): Reduce volatility tolerance by 20%, increase stable assets
- Medium-term (1-3 years): Standard risk parameters
- Long-term (>3 years): Can tolerate higher volatility, reduce transaction cost impact

### Sector Constraints
- If sectors included: Only select from included sectors
- If sectors excluded: Remove excluded sectors from universe
- Apply sector concentration limit: Max 40% in any single sector

### Position Size Constraints
- Individual stock: Min weight ≤ w_i ≤ Max weight
- Number of stocks: Min stocks ≤ N ≤ Max stocks
- Long-only: All weights ≥ 0
- Fully invested: Sum of weights = 1

### Transaction Cost Integration
- Adjusted return = Expected return - (Transaction cost % × Turnover)
- Minimum trade filter: Ignore allocation changes < Minimum trade size

## Section 3: Data Universe and Market Data

### Data Sources
- Primary: Yahoo Finance (yfinance) for Indian stocks (.NS suffix)
- Backup: NSE/BSE APIs for missing data
- Universe: Nifty 500 stocks (liquid and diverse)

### Data to Fetch
1. **Price Data**
   - Daily adjusted close prices
   - Volume data
   - Minimum history: 3 years (prefer 5 years)

2. **Fundamental Data**
   - Sector classification (GICS/NSE sectors)
   - Market capitalization
   - Free float market cap
   - Beta (vs Nifty 50)
   - Price-to-earnings ratio
   - Dividend yield

3. **Risk-Free Rate**
   - 10-year Government bond yield (India)
   - Current value from RBI/NSE

### Data Quality Checks
- **Missing Data**: If >10% prices missing, exclude stock from universe
- **IPO Filter**: Require minimum 1 year history
- **Delisting Detection**: Remove stocks with >30 consecutive days of zero volume
- **Outlier Detection**: Cap daily returns at ±20% (likely data errors)
- **Stale Prices**: Remove stocks with no price change for >5 consecutive days

### Data Caching
- Cache price data locally with timestamp
- Refresh cache if older than 1 day
- Store in parquet/feather format for fast loading
- Cache location: `data/cache/prices_{date}.parquet`

## Section 4: Return and Risk Estimation

### Return Calculation
1. **Daily Returns**: r_t = (P_t - P_{t-1}) / P_{t-1}
2. **Expected Return Estimation Methods** (choose best):
   - **Historical Mean**: Simple average of past returns (default)
   - **EWMA**: Exponentially weighted moving average (λ = 0.94) for recent data emphasis
   - **CAPM**: E(r_i) = r_f + β_i × (E(r_m) - r_f) for market-consistent estimates
3. **Annualization**: μ_annual = μ_daily × 252 (trading days)

### Covariance Matrix Estimation
1. **Sample Covariance**: Σ_sample = (1/T) × Σ(r_t - μ)(r_t - μ)ᵀ
2. **Ledoit-Wolf Shrinkage** (primary method):
   - Σ_shrunk = δ × F + (1 - δ) × Σ_sample
## Section 5: Portfolio Optimization Model

### Optimization Framework
Use **cvxpy** for convex optimization with the following formulations:

### Mode 1: Maximum Sharpe Ratio (Default)
```
maximize: (μᵀw - rf) / √(wᵀΣw)
subject to:
    - Σw_i = 1 (fully invested)
    - w_i ≥ 0 (long only)
    - w_i ≤ max_weight (position limits)
    - w_i ≥ min_weight OR w_i = 0 (minimum size or zero)
    - Σ_sector w_i ≤ 0.4 (sector concentration)
    - min_stocks ≤ cardinality(w > 0) ≤ max_stocks
```
*Note*: Use iterative approach or MIQP for cardinality constraint

### Mode 2: Minimum Volatility
```
minimize: √(wᵀΣw)
subject to:
    - μᵀw ≥ target_return (if specified)
    - Same constraints as Mode 1
```

### Mode 3: Target Return with Min Risk
```
minimize: wᵀΣw
subject to:
    - μᵀw ≥ target_return
    - Same constraints as Mode 1
```

### Mode 4: Risk Parity
```
Objective: Equalize risk contributions
Risk_i = w_i × (Σw)_i
Constraint: Risk_i = Risk_j for all i, j
```

### Mode 5: CVaR Minimization (Advanced)
```
minimize: CVaR at 95% confidence level
CVaR = Expected loss in worst 5% scenarios
Use historical simulation for CVaR estimation
```
## Section 6: Post Processing of Weights

### Weight Normalization
1. **Rounding**: Round weights to 4 decimal places
2. **Re-normalization**: Ensure Σw_i = 1.0 exactly after rounding
3. **Zero Threshold**: Set weights < 0.01% to zero and redistribute

### Capital Allocation
```python
for each stock i:
    allocation_i = weight_i × initial_capital
    
    # Account for transaction costs
    gross_allocation = allocation_i / (1 - transaction_cost_pct)
    
    # Apply minimum trade size filter
    if gross_allocation < min_trade_size:
        reallocate to other positions proportionally
```

### Share Unit Calculation
```python
for each stock i:
    current_price_i = latest_close_price
    
    # Calculate affordable shares
    max_shares = floor(allocation_i / current_price_i)
    
    # Buy in round lots if required (NSE: 1 share minimum)
    shares_to_buy_i = max_shares
    
    # Actual allocation after buying integer shares
    actual_allocation_i = shares_to_buy_i × current_price_i
```

### Cash Management
```python
total_invested = Σ(shares_to_buy_i × current_price_i)
transaction_cost_total = total_invested × transaction_cost_pct
cash_required = total_invested + transaction_cost_total
leftover_cash = initial_capital - cash_required

# Leftover cash handling
if leftover_cash > min_trade_size:
    # Option 1: Keep as cash buffer
    # Option 2: Buy additional shares of highest weight stock
    # Default: Keep as cash
```

### Final Portfolio Output
```python
{
    "weights": {
        "theoretical": {...},      # Optimized weights
        "actual": {...},           # After integer share adjustment
    },
    "positions": [
        {
            "ticker": "RELIANCE.NS",
            "name": "Reliance Industries",
            "sector": "Energy",
            "weight_theoretical": 0.1234,
            "weight_actual": 0.1245,
            "allocation": 123456.78,
            "shares": 50,
            "price": 2469.14,
            "invested_amount": 123457.00,
        },
        ...
    ],
    "cash": {
        "leftover": 5432.10,
        "transaction_costs": 6172.85,
        "total_invested": 1234285.90,
    },
    "portfolio_value": 1240000.00
## Section 7: Risk Analysis Engine

### Portfolio-Level Metrics

#### 1. Expected Return
```python
portfolio_return = Σ(w_i × μ_i)  # Annualized
portfolio_return_real = portfolio_return - inflation_rate
```

#### 2. Portfolio Volatility
```python
portfolio_variance = wᵀΣw
portfolio_volatility = √portfolio_variance  # Annualized
```

#### 3. Sharpe Ratio
```python
sharpe_ratio = (portfolio_return - risk_free_rate) / portfolio_volatility
# Good: >1.0, Excellent: >2.0
```

#### 4. Sortino Ratio
```python
downside_deviation = √(mean of squared negative returns)
sortino_ratio = (portfolio_return - risk_free_rate) / downside_deviation
# Better than Sharpe for asymmetric return distributions
```

#### 5. Value at Risk (VaR)
Use **Historical Simulation** (95% and 99% confidence):
```python
# Method 1: Historical simulation
historical_portfolio_returns = returns_matrix @ weights
VaR_95 = percentile(historical_portfolio_returns, 5)
VaR_99 = percentile(historical_portfolio_returns, 1)

# Annualized
VaR_95_annual = VaR_95 × √252

# Interpretation: "We expect to lose more than VaR in 5% of scenarios"
```

#### 6. Conditional Value at Risk (CVaR / Expected Shortfall)
```python
# Average loss in worst 5% scenarios
tail_losses = historical_portfolio_returns[historical_portfolio_returns <= VaR_95]
CVaR_95 = mean(tail_losses)

# CVaR_95_annual = CVaR_95 × √252
# "In worst 5% scenarios, average loss is CVaR"
```

#### 7. Maximum Drawdown
```python
# Historical drawdown analysis
cumulative_returns = (1 + historical_portfolio_returns).cumprod()
running_max = cumulative_returns.expanding().max()
drawdown = (cumulative_returns - running_max) / running_max

max_drawdown = min(drawdown)
# Worst peak-to-trough decline
```

#### 8. Risk Contribution
```python
# Marginal contribution to risk (MCTR)
MCTR_i = (Σw)_i / portfolio_volatility

# Contribution to risk (CTR)
CTR_i = w_i × MCTR_i

# Percentage contribution
risk_pct_i = CTR_i / portfolio_volatility × 100

# Output as table showing which stocks drive portfolio risk
```

#### 9. Diversification Ratio
```python
weighted_avg_volatility = Σ(w_i × σ_i)
diversification_ratio = weighted_avg_volatility / portfolio_volatility

# Higher is better (>1.2 is good diversification)
# Ratio of 1.0 means no diversification benefit
```

### Position-Level Metrics

#### 10. Individual Stock Risk Stats
```python
for each stock:
    {
        "ticker": ticker,
        "weight": weight,
        "expected_return": μ_i,
        "volatility": σ_i,
        "beta": β_i,
        "risk_contribution_pct": risk_pct_i,
        "correlation_with_portfolio": corr(r_i, r_portfolio),
    }
```

### Benchmark Comparison

#### 11. Benchmark Analysis (vs Nifty 50)
```python
# Fetch Nifty 50 returns for same period
benchmark_returns = fetch_nifty50_returns(start_date, end_date)

# Alpha (excess return)
alpha = portfolio_return - (risk_free_rate + portfolio_beta × (benchmark_return - risk_free_rate))
## Section 8: Monte Carlo Simulation Engine

### Purpose
## Section 9: Explanation Generator

### Purpose
Generate natural language explanations for portfolio construction to build user trust and understanding.

### Explanation Components

#### 1. Portfolio Overview
```python
f"""
Your portfolio contains {n_stocks} stocks with a total investment of ₹{initial_capital:,.0f}.

The portfolio is optimized using {optimization_method} strategy, which aims to 
{method_descriptions[optimization_method]}.

Expected annual return: {portfolio_return:.1f}% (after adjusting for {inflation_rate}% inflation)
Expected volatility: {portfolio_volatility:.1f}%
Sharpe ratio: {sharpe_ratio:.2f}
"""
```

#### 2. Stock Selection Logic
```python
# Top holdings explanation
top_5_stocks = get_top_n_holdings(5)

explanation = f"""
**Why these stocks were selected:**

Your portfolio is concentrated in these top 5 holdings:
"""

for stock in top_5_stocks:
    reasons = []
    
    if stock.sharpe_ratio > 1.5:
        reasons.append(f"excellent risk-adjusted returns (Sharpe: {stock.sharpe_ratio:.2f})")
    
    if stock.expected_return > portfolio_return:
        reasons.append(f"higher expected return ({stock.expected_return:.1f}%) than portfolio average")
    
    if stock.beta < 0.8:
        reasons.append(f"low market sensitivity (Beta: {stock.beta:.2f}), providing stability")
    elif stock.beta > 1.2:
        reasons.append(f"high growth potential (Beta: {stock.beta:.2f})")
    
    if stock.dividend_yield > 2:
        reasons.append(f"dividend income ({stock.dividend_yield:.1f}% yield)")
    
    if stock.sector in preferred_sectors:
        reasons.append(f"exposure to {stock.sector} sector aligns with portfolio strategy")
    
    explanation += f"""
    - **{stock.name} ({stock.ticker})**: {stock.weight:.1f}% allocation
      This stock was chosen for {', '.join(reasons)}.
    """
```

#### 3. Sector Allocation Logic
```python
sector_summary = get_sector_breakdown()

explanation = f"""
**Sector Diversification:**

Your portfolio is diversified across {n_sectors} sectors:
"""

for sector, details in sector_summary.items():
    explanation += f"""
    - **{sector}**: {details.weight:.1f}% ({details.n_stocks} stocks)
      {get_sector_rationale(sector, details)}
    """

# Sector rationale examples
def get_sector_rationale(sector, details):
    if sector == "Technology" and details.weight > 20:
        return "Heavy allocation driven by strong expected returns and growth potential in IT sector"
    elif sector == "Financial Services" and details.weight > 15:
        return "Banking and financial stocks provide stability and dividend income"
    elif sector == "Energy" and details.weight < 10:
        return "Limited exposure to reduce volatility from commodity price fluctuations"
    # ... more rules
```

#### 4. Risk Management Explanation
```python
explanation = f"""
**Risk Control Measures:**

1. **Diversification**: Your portfolio holds {n_stocks} stocks across {n_sectors} sectors,
   achieving a diversification ratio of {diversification_ratio:.2f}. This means portfolio
   volatility is {(1 - 1/diversification_ratio) * 100:.0f}% lower than holding stocks individually.

2. **Position Limits**: No single stock exceeds {max_weight*100:.0f}% of your portfolio,
   preventing over-concentration risk.
   
3. **Volatility Control**: Portfolio volatility ({portfolio_volatility:.1f}%) is aligned with
   your {risk_appetite} risk tolerance.
   
4. **Downside Protection**: The portfolio has a maximum historical drawdown of {max_drawdown:.1f}%
   and Value-at-Risk of {VaR_95_annual:.1f}% at 95% confidence (meaning there's only 5% chance
   of losing more than this in a year).
"""

if portfolio_beta < 0.9:
    explanation += f"""
5. **Market Sensitivity**: Portfolio Beta is {portfolio_beta:.2f}, indicating lower volatility
   than the overall market. This provides defensive characteristics during market downturns.
"""
```

#### 5. Target Return Achievement
```python
if target_return_specified:
    explanation = f"""
**Meeting Your Return Target:**

You requested an annual return of {target_return:.1f}%.
    """
    
    if portfolio_return >= target_return:
        gap = portfolio_return - target_return
        explanation += f"""
This portfolio is expected to deliver {portfolio_return:.1f}% annual return,
exceeding your target by {gap:.1f} percentage points.

This was achieved by:
- Allocating {growth_allocation:.0f}% to high-growth stocks with expected returns > {target_return}%
- Balancing risk through diversification across {n_sectors} sectors
- Optimizing the risk-return tradeoff to maximize Sharpe ratio
"""
    else:
        explanation += f"""
⚠️ **Important**: This portfolio expects {portfolio_return:.1f}% return, which is
{target_return - portfolio_return:.1f} percentage points below your {target_return:.1f}% target.

This gap exists because:
- Your risk tolerance ({risk_appetite}) constrains allocation to high-return, high-risk stocks
- Current market conditions show limited opportunities meeting both return and risk requirements
- Achieving {target_return:.1f}% would require {required_volatility:.1f}% volatility,
  exceeding your risk limit

**Recommendation**: Consider increasing risk tolerance or extending time horizon.
"""
```

#### 6. Transaction Cost Impact
```python
if transaction_costs > initial_capital * 0.01:  # >1% impact
    explanation = f"""
**Transaction Costs:**

Estimated transaction costs: ₹{transaction_costs:,.0f} ({transaction_costs/initial_capital*100:.2f}% of capital)

This includes:
- Brokerage and exchange fees
- Securities transaction tax (STT)
- Stamp duty

These costs are factored into the optimization and reduce your first-year returns by
approximately {transaction_costs/initial_capital*100:.2f} percentage points.
"""
```

#### 7. Rebalancing Guidance
```python
if rebalancing_frequency != "never":
    explanation = f"""
**Rebalancing Strategy:**

Your portfolio is configured to rebalance {rebalancing_frequency}.

Rebalancing will be triggered when any stock's weight deviates by more than
{rebalancing_threshold*100:.0f}% from its target allocation.

Expected rebalancing frequency: {expected_rebalance_count} times per year
Estimated annual rebalancing costs: ₹{annual_rebalance_costs:,.0f}
    """
```

#### 8. AI-Generated Natural Language Summary (Optional)
## Section 10: Comprehensive Output Format

### Complete JSON Output Structure
```json
{
    "portfolio_summary": {
        "initial_capital": 1000000,
        "currency": "INR",
        "optimization_method": "max_sharpe",
        "creation_date": "2025-11-21",
        "investment_horizon_years": 5,
        "number_of_stocks": 18,
        "number_of_sectors": 8
    },
    
    "positions": [
        {
            "rank": 1,
            "ticker": "RELIANCE.NS",
            "company_name": "Reliance Industries Ltd",
            "sector": "Energy",
            "weight_theoretical": 0.1234,
            "weight_actual": 0.1245,
            "shares": 50,
            "price_per_share": 2469.14,
            "investment_amount": 123457.00,
            "expected_return": 14.2,
            "volatility": 22.5,
            "beta": 1.15,
            "dividend_yield": 0.8,
            "risk_contribution_pct": 16.8
        },
        // ... more positions
    ],
    
    "sector_allocation": {
        "Technology": {
            "weight": 28.5,
            "n_stocks": 4,
            "stocks": ["INFY.NS", "TCS.NS", "HCLTECH.NS", "WIPRO.NS"]
        },
        "Financial Services": {
            "weight": 22.3,
            "n_stocks": 5,
            "stocks": ["HDFCBANK.NS", "ICICIBANK.NS", ...]
        },
        // ... more sectors
    },
    
    "cash_summary": {
        "total_invested": 987654.32,
        "transaction_costs": 4938.27,
        "cash_required": 992592.59,
        "leftover_cash": 7407.41,
        "cash_percentage": 0.74
    },
    
    "performance_metrics": {
        "expected_return_annual": 13.5,
        "expected_return_real": 10.0,
        "portfolio_volatility": 16.8,
        "sharpe_ratio": 0.89,
        "sortino_ratio": 1.23,
        "max_drawdown": -19.2,
        "diversification_ratio": 1.42
    },
    
    "risk_metrics": {
        "var_95_daily_pct": -1.35,
        "var_99_daily_pct": -2.18,
        "cvar_95_daily_pct": -1.89,
        "var_95_annual_pct": -21.4,
        "cvar_95_annual_pct": -29.9,
        "var_95_annual_inr": 214000,
        "cvar_95_annual_inr": 299000
    },
    
    "benchmark_comparison": {
        "benchmark_name": "NIFTY 50",
        "benchmark_return": 11.5,
        "portfolio_return": 13.5,
        "alpha": 2.0,
        "beta": 0.92,
        "tracking_error": 4.2,
        "information_ratio": 0.48,
        "up_capture_ratio": 1.12,
        "down_capture_ratio": 0.81
    },
    
    "monte_carlo_simulation": {
        "n_simulations": 10000,
        "horizon_years": 5,
        "expected_value": {
            "mean": 1845000,
            "median": 1690000,
            "std": 580000
        },
        "confidence_intervals": {
            "ci_90": [980000, 2850000],
            "ci_95": [780000, 3200000]
        },
        "probabilities": {
            "prob_profit": 81.5,
            "prob_loss": 18.5,
            "prob_double": 23.4,
            "prob_loss_50pct": 2.1
        },
        "milestone_projections": {
            "1_year": {"median": 1125000, "range_90": [980000, 1320000]},
            "3_years": {"median": 1410000, "range_90": [1050000, 1980000]},
            "5_years": {"median": 1690000, "range_90": [1020000, 2850000]}
        },
        "chart_data": {
            "percentile_bands": {
                "p10": [...],  // Array of values for 10th percentile
                "p50": [...],  // Median path
                "p90": [...]   // 90th percentile
            },
            "sample_paths": [[...], [...], ...],  // 100 sample paths for visualization
            "final_value_histogram": {
                "bins": [...],
                "frequencies": [...]
            }
        }
    },
    
    "explanation": {
        "summary": "This portfolio is designed for moderate risk investors...",
        "selection_rationale": "Stocks were selected based on...",
        "sector_logic": "The portfolio is diversified across 8 sectors...",
        "risk_management": "Risk is controlled through...",
        "return_achievement": "The portfolio is expected to deliver...",
        "transaction_impact": "Transaction costs of ₹4,938...",
        "rebalancing_guidance": "Quarterly rebalancing recommended when...",
        "warnings": [
            "Portfolio concentration in Technology sector (28.5%) may increase volatility"
        ],
        "recommendations": [
            "Consider reducing Technology allocation if concerned about sector risk",
            "Review portfolio after 6 months to assess performance"
        ]
    },
    
    "rebalancing_schedule": {
        "frequency": "quarterly",
        "threshold_pct": 5.0,
        "next_rebalance_date": "2026-02-21",
        "estimated_annual_cost": 12500
    },
    
    "visualizations": {
        "weight_distribution": {
            "labels": ["RELIANCE.NS", "TCS.NS", ...],
            "values": [12.45, 10.23, ...],
            "colors": ["#00D09C", "#44475B", ...]
        },
        "sector_pie_chart": {
            "labels": ["Technology", "Financial Services", ...],
            "values": [28.5, 22.3, ...],
            "colors": ["#00D09C", "#3B82F6", ...]
        },
        "risk_contribution_chart": {
            "labels": [...],
            "risk_pct": [...]
        },
        "efficient_frontier": {
            "volatility_points": [...],
            "return_points": [...],
            "portfolio_point": {"volatility": 16.8, "return": 13.5},
            "max_sharpe_point": {"volatility": 16.8, "return": 13.5}
        },
        "correlation_heatmap": {
            "tickers": [...],
            "correlation_matrix": [[...], [...], ...]
        },
        "historical_simulation": {
            "dates": [...],
            "portfolio_values": [...],
            "benchmark_values": [...]
        }
    },
    
    "metadata": {
        "generated_at": "2025-11-21T10:30:00Z",
        "python_version": "3.11.5",
        "library_versions": {
            "cvxpy": "1.4.1",
            "numpy": "1.24.3",
            "pandas": "2.0.3",
            "yfinance": "0.2.28"
## Section 11: System Architecture & Modules

### Module 1: Input Schema & Validation
**File**: `core/input_schema.py`
```python
class PortfolioInput(BaseModel):
    # Core parameters with validation
    start_date: date
    end_date: date
    risk_appetite: Literal["low", "moderate", "high"]
    target_return: float = Field(ge=0, le=100)  # 0-100%
    initial_capital: float = Field(ge=10000)    # Min ₹10k
    inflation_rate: float = Field(default=3.5, ge=0, le=15)
    
    # Constraints
    max_weight_per_stock: float = Field(default=0.20, ge=0.01, le=0.50)
    min_weight_per_stock: float = Field(default=0.02, ge=0, le=0.10)
    min_stocks: int = Field(default=10, ge=5, le=50)
    max_stocks: int = Field(default=30, ge=10, le=100)
    
    # Sectors
    include_sectors: Optional[List[str]] = None
    exclude_sectors: Optional[List[str]] = None
    
    # Advanced
    optimization_method: str = Field(default="max_sharpe")
    rebalancing_frequency: str = Field(default="quarterly")
    transaction_cost_pct: float = Field(default=0.005, ge=0, le=0.05)
```

### Module 2: Data Ingestion Engine
**File**: `data/market_data.py`
- Fetch price data from Yahoo Finance
- Implement caching with 1-day expiry
- Handle missing data and data quality checks
- Fetch sector classifications
- Calculate risk-free rate from latest 10Y G-Sec

### Module 3: Quant Estimator
**File**: `quant/estimators.py`
- Calculate expected returns (historical mean, EWMA, CAPM)
- Estimate covariance matrix with Ledoit-Wolf shrinkage
- Compute correlation matrix
- Calculate individual stock betas

### Module 4: Portfolio Optimizer
**File**: `quant/optimizer.py`
- Implement mean-variance optimization using cvxpy
- Support multiple optimization modes (max Sharpe, min volatility, etc.)
- Handle cardinality constraints
- Include transaction cost adjustments
- Fallback to equal-weight if optimization fails

### Module 5: Post Processor
**File**: `core/post_processor.py`
- Convert theoretical weights to actual positions
- Calculate integer share quantities
- Compute leftover cash
- Generate trade recommendations for rebalancing

### Module 6: Risk Analysis Engine
**File**: `risk/metrics.py`
- Calculate all portfolio-level risk metrics
- Compute VaR and CVaR using historical simulation
- Calculate risk contributions
- Perform benchmark comparison analysis

### Module 7: Monte Carlo Simulator
**File**: `simulation/monte_carlo.py`
- Implement correlated GBM simulation
- Generate probability distributions
- Calculate milestone projections
- Prepare visualization data

### Module 8: Explanation Generator
**File**: `explanation/generator.py`
- Generate natural language explanations
- Create stock selection rationale
- Explain risk management approach
- Provide rebalancing guidance

### Module 9: Backtesting Engine (New)
**File**: `backtest/engine.py`
- Test portfolio on historical data
- Calculate out-of-sample performance
- Compare to benchmarks
- Generate performance attribution

### Module 10: API Layer
**File**: `api/main.py` (FastAPI)
```python
@app.post("/api/portfolio/generate")
async def generate_portfolio(input: PortfolioInput):
    # Orchestrate all modules
    # Return complete portfolio output
    
@app.post("/api/portfolio/rebalance")
async def rebalance_portfolio(current_holdings, input: PortfolioInput):
    # Generate rebalancing trades
    
@app.get("/api/portfolio/simulate")
async def simulate_portfolio(portfolio_id: str):
    # Run Monte Carlo on existing portfolio
```

### Module 11: Frontend Integration
**File**: `frontend/` (Next.js/React)
- Input form with validation
- Interactive portfolio dashboard
- Real-time weight adjustments
- Chart visualizations
- PDF report download

### Module 12: Report Generator
**File**: `reporting/pdf_generator.py`
- Generate PDF reports using ReportLab
- Include all visualizations
- Professional formatting
- Email delivery option

### Module 13: Rebalancing Scheduler (New)
**File**: `scheduler/rebalancer.py`
- Monitor portfolio drift
- Trigger rebalancing when threshold exceeded
- Calculate optimal trade list
- Minimize transaction costs

## Section 12: Development Guidelines

### Code Standards
1. **Type Hints**: Use type hints for all function signatures
2. **Docstrings**: Google-style docstrings for all public functions
3. **Error Handling**: Graceful degradation with informative error messages
4. **Logging**: Comprehensive logging at INFO and DEBUG levels
5. **Testing**: Unit tests for all calculation functions (pytest)

### Data Pipeline Rules
1. **Immutability**: Never modify input data in-place
2. **Validation**: Validate all inputs at module boundaries
3. **Consistent Formats**: Use pandas DataFrames for time series, numpy arrays for math
4. **Date Handling**: Use pandas Timestamp, not Python datetime
5. **Currency**: Always store amounts as float in INR

### Performance Requirements
1. **Optimization**: Complete portfolio generation in <30 seconds for 50 stocks
2. **Caching**: Cache market data to avoid repeated API calls
3. **Parallelization**: Use multiprocessing for Monte Carlo simulations
4. **Memory**: Limit memory usage to <2GB for typical workloads

### Security & Privacy
1. **Data**: Never log user portfolio holdings
2. **API Keys**: Store in environment variables, never in code
3. **Validation**: Sanitize all user inputs
4. **Rate Limiting**: Implement rate limits on API endpoints

### Deployment
1. **Environment**: Use Docker for consistent deployment
2. **Configuration**: Separate dev/staging/prod configs
3. **Monitoring**: Log all errors to centralized logging
4. **Backups**: Daily backups of user portfolios

## Section 13: Calculation Consistency Rules

### Mathematical Constants
```python
TRADING_DAYS_PER_YEAR = 252
RISK_FREE_RATE_SOURCE = "10Y_GSEC_INDIA"
ANNUALIZATION_FACTOR_RETURN = 252
ANNUALIZATION_FACTOR_VOLATILITY = sqrt(252)
```

### Always Use
- **Returns**: Log returns for calculations, simple returns for display
- **Covariance**: Ledoit-Wolf shrinkage as primary method
- **VaR**: Historical simulation at 95% and 99% confidence
- **Optimization Solver**: ECOS (default), SCS (fallback)
- **Random Seed**: Set seed for reproducible Monte Carlo

### Never
- Change formulas between modules without updating all dependents
- Use different annualization factors in different parts of code
- Hard-code magic numbers (use constants)
- Mix NumPy and Python native types in calculations

## Section 14: Module Integration Contract

Each module must:
1. Accept inputs in documented format
2. Return outputs in documented format
3. Raise specific exceptions for errors
4. Log entry/exit and key decisions
5. Be independently testable

Example integration:
```python
# Module interface contract
def calculate_optimal_portfolio(
    returns: pd.DataFrame,      # (T x N) daily returns
    constraints: dict,          # User constraints
    method: str = "max_sharpe"  # Optimization method
) -> dict:                      # Standardized output
    """
    Calculate optimal portfolio weights.
    
    Returns:
        {
            "weights": np.array,  # (N,) theoretical weights
            "success": bool,      # True if optimization succeeded
            "status": str,        # Solver status message
            "metrics": dict       # Expected return, volatility, etc.
        }
    """
```

## Section 15: Version Control & Updates

### Versioning
- **API Version**: Semantic versioning (v1.2.3)
- **Model Version**: Track changes to optimization logic
- **Data Version**: Tag data snapshots with date

### Backward Compatibility
- Maintain support for previous API versions for 6 months
- Deprecated features must log warnings
- Breaking changes require major version bump

### Change Log
Maintain CHANGELOG.md with:
- New features
- Bug fixes
- Performance improvements
- Breaking changes

---

**This master prompt governs all modules. Follow strictly to ensure system consistency and reliability.**
**Page 2: Holdings**
- Detailed table of all positions
- Sector breakdown
- Top 10 holdings highlighted

**Page 3: Risk Analysis**
- Risk metrics table
- Risk contribution chart
- VaR/CVaR explanation
- Benchmark comparison

**Page 4: Monte Carlo Projections**
- Fan chart showing probability bands
- Milestone projection table
- Outcome probabilities

**Page 5: Explanation & Recommendations**
- Natural language explanation
- Rebalancing guidance
- Warnings and recommendations
- Assumptions and disclaimers

### CSV Export (for Excel)
```csv
Ticker,Company,Sector,Weight%,Shares,Price,Investment,ExpReturn%,Volatility%,Beta
RELIANCE.NS,Reliance Industries,Energy,12.45,50,2469.14,123457.00,14.2,22.5,1.15
...
```

### Interactive HTML Dashboard
- Live charts using Plotly/Chart.js
- Interactive weight sliders
- Real-time recalculation
- Downloadable reports-3 paragraphs why this portfolio makes sense for the investor.
Use simple language and avoid jargon.
"""

ai_explanation = call_llm(prompt)
```

### Full Explanation Output Format
```python
{
    "summary": "High-level 2-3 sentence overview",
    "selection_rationale": "Why these specific stocks",
    "sector_logic": "Sector diversification explanation",
    "risk_management": "How risk is controlled",
    "return_expectation": "How target return is met (or why not)",
    "transaction_costs": "Impact of costs",
    "rebalancing": "Rebalancing strategy",
    "warnings": ["List of any warnings or caveats"],
    "recommendations": ["Actionable suggestions for the user"],
    "full_text": "Complete narrative combining all sections"
}
```   # Daily time step
initial_value = initial_capital
```

### Simulation Method: Geometric Brownian Motion (GBM)
For each stock i and each simulation path:
```python
# Stock price evolution
S_t+1 = S_t × exp((μ_i - 0.5σ_i²)dt + σ_i√dt × Z_t)

where:
    S_t = price at time t
    μ_i = expected return of stock i
    σ_i = volatility of stock i
    Z_t = random normal variable N(0,1)
    
# Account for correlations between stocks
Z = L @ N(0, I)  # Cholesky decomposition: Σ = LLᵀ
```

### Correlated Simulation
```python
# Step 1: Cholesky decomposition of correlation matrix
L = cholesky(correlation_matrix)

# Step 2: Generate correlated random shocks
for each time step t:
    independent_shocks = np.random.normal(0, 1, size=(n_stocks,))
    correlated_shocks = L @ independent_shocks
    
    # Step 3: Update stock prices with correlated shocks
    for each stock i:
        S[i, t+1] = S[i, t] × exp((μ_i - 0.5σ_i²)dt + σ_i√dt × correlated_shocks[i])
```

### Portfolio Value Simulation
```python
for each simulation path:
    stock_values = shares_array × prices_matrix[path, :]
    portfolio_values[path, :] = stock_values.sum(axis=0) + cash
```

### Outcome Statistics
```python
final_values = portfolio_values[:, -1]

outcomes = {
    "mean_final_value": mean(final_values),
    "median_final_value": percentile(final_values, 50),
    
    # Confidence intervals
    "ci_95_lower": percentile(final_values, 2.5),
    "ci_95_upper": percentile(final_values, 97.5),
    "ci_90_lower": percentile(final_values, 5),
    "ci_90_upper": percentile(final_values, 95),
    
    # Downside risk
    "prob_loss": mean(final_values < initial_capital),
    "prob_loss_10pct": mean(final_values < initial_capital * 0.9),
    
    # Upside potential
    "prob_double": mean(final_values > initial_capital * 2),
    "best_case_5pct": percentile(final_values, 95),
    "worst_case_5pct": percentile(final_values, 5),
    
    # Return distribution
    "returns": (final_values - initial_capital) / initial_capital,
    "mean_return": mean((final_values - initial_capital) / initial_capital),
    "std_return": std((final_values - initial_capital) / initial_capital),
}
```

### Time Series Statistics
```python
# Path statistics at different time points
milestones = [63, 126, 189, 252]  # 3m, 6m, 9m, 12m

for milestone in milestones:
    values_at_milestone = portfolio_values[:, milestone]
    
    milestone_stats[milestone] = {
        "mean": mean(values_at_milestone),
        "percentile_10": percentile(values_at_milestone, 10),
        "percentile_50": percentile(values_at_milestone, 50),
        "percentile_90": percentile(values_at_milestone, 90),
    }
```

### Visualization Data
```python
output = {
    "simulation_paths": portfolio_values[::100, :],  # Sample 100 paths for plotting
    
    "percentile_bands": {
        "p10": percentile(portfolio_values, 10, axis=0),
        "p25": percentile(portfolio_values, 25, axis=0),
        "p50": percentile(portfolio_values, 50, axis=0),
        "p75": percentile(portfolio_values, 75, axis=0),
        "p90": percentile(portfolio_values, 90, axis=0),
    },
    
    "final_value_distribution": {
        "bins": histogram_bins,
        "frequencies": histogram_frequencies,
    },
    
    "return_distribution": {
        "bins": return_bins,
        "frequencies": return_frequencies,
    }
}
```

### Monte Carlo Summary Report
```python
{
    "simulation_params": {
        "n_simulations": 10000,
        "horizon_years": 5,
        "method": "Geometric Brownian Motion with correlated shocks",
    },
    
    "expected_outcomes": {
        "mean_portfolio_value": "₹18,45,000",
        "median_portfolio_value": "₹16,90,000",
        "initial_investment": "₹10,00,000",
        "expected_gain": "₹8,45,000",
        "expected_return_annualized": "13.1%",
    },
    
    "risk_scenarios": {
        "probability_of_loss": "18.5%",
        "worst_5%_outcome": "₹6,50,000 (-35% loss)",
        "best_5%_outcome": "₹32,00,000 (+220% gain)",
        "95%_confidence_range": "₹7,80,000 to ₹28,50,000",
    },
    
    "milestone_projections": {
        "1_year": {
            "median": "₹11,25,000",
            "range_90pct": "₹9,80,000 - ₹13,20,000",
        },
        "3_years": {
            "median": "₹14,10,000",
            "range_90pct": "₹10,50,000 - ₹19,80,000",
        },
        "5_years": {
            "median": "₹16,90,000",
            "range_90pct": "₹10,20,000 - ₹28,50,000",
        },
    }
}
```

### Stress Testing (Optional Enhancement)
```python
# Market crash scenario
crash_scenario = simulate_with_params(
    drift_multiplier=0.3,      # 70% reduction in returns
    volatility_multiplier=2.0,  # 2x increase in volatility
    correlation_increase=0.2,   # Stocks become more correlated in crash
)

# High inflation scenario
inflation_scenario = simulate_with_params(
    real_returns=mu - 0.08,    # 8% inflation instead of 3.5%
)
```
portfolio_beta = Cov(portfolio_returns, benchmark_returns) / Var(benchmark_returns)

# Tracking Error
tracking_error = std(portfolio_returns - benchmark_returns) × √252

# Information Ratio
information_ratio = alpha / tracking_error

# Up/Down Capture
up_periods = benchmark_returns > 0
down_periods = benchmark_returns < 0

up_capture = mean(portfolio_returns[up_periods]) / mean(benchmark_returns[up_periods])
down_capture = mean(portfolio_returns[down_periods]) / mean(benchmark_returns[down_periods])

# Ideal: Up capture > 1.0, Down capture < 1.0
```

### Risk Summary Output
```python
{
    "portfolio_metrics": {
        "expected_return": 12.5,        # %
        "expected_return_real": 9.0,    # % (after inflation)
        "volatility": 15.2,              # %
        "sharpe_ratio": 0.82,
        "sortino_ratio": 1.15,
        "max_drawdown": -18.5,           # %
        "diversification_ratio": 1.34,
    },
    "risk_metrics": {
        "var_95_daily": -1.2,            # %
        "var_99_daily": -2.1,            # %
        "cvar_95_daily": -1.8,           # %
        "var_95_annual": -19.0,          # %
        "cvar_95_annual": -28.5,         # %
    },
    "benchmark_metrics": {
        "benchmark": "NIFTY50",
        "benchmark_return": 11.0,        # %
        "alpha": 1.5,                    # %
        "beta": 0.95,
        "tracking_error": 3.2,           # %
        "information_ratio": 0.47,
        "up_capture": 1.08,
        "down_capture": 0.85,
    },
    "risk_contributions": [
        {"ticker": "RELIANCE.NS", "weight": 12.5, "risk_contribution": 15.2},
        ...
    ]
}
```

### Risk Warning Flags
```python
warnings = []

if sharpe_ratio < 0.5:
    warnings.append("Low Sharpe ratio - risk-adjusted returns are poor")
    
if max_drawdown < -25:
    warnings.append("High drawdown risk - portfolio may experience severe losses")
    
if diversification_ratio < 1.1:
    warnings.append("Poor diversification - stocks are highly correlated")
    
if any(risk_contribution > 20):
    warnings.append("Concentration risk - single stock contributes >20% of portfolio risk")
```osition {ticker} deviates by {weight_deviation:.2%}")
```

### Rebalancing Calculation (for existing portfolio)
```python
if current_holdings exist:
    for each stock:
        current_value = current_shares × current_price
        target_value = target_weight × total_portfolio_value
        
        trade_value = target_value - current_value
        trade_shares = round(trade_value / current_price)
        
        if abs(trade_value) > min_trade_size:
            trade_type = "BUY" if trade_shares > 0 else "SELL"
            trades.append({
                "ticker": ticker,
                "action": trade_type,
                "shares": abs(trade_shares),
                "value": abs(trade_value),
            })
```Return - Transaction_cost/capital
```

### Cardinality Constraint Handling
Two approaches:
1. **Greedy**: Start with top N stocks by Sharpe ratio, then optimize
2. **L1 Regularization**: Add penalty for number of positions
   - Objective: minimize(wᵀΣw + λ||w||₁)
   - Larger λ → fewer stocks

### Solver Configuration
```python
problem.solve(
    solver=cp.ECOS,           # Fast for most problems
    warm_start=True,          # Use previous solution if available
    max_iters=1000,           # Increase for complex problems
    abstol=1e-7,              # Absolute tolerance
    reltol=1e-6,              # Relative tolerance
)
```

### Fallback Strategy
If optimization fails:
1. Relax constraints progressively
2. Use equal-weight portfolio in filtered universe
3. Log failure and return diagnostic information

### Output Validation
- Ensure all weights sum to 1.0 (±0.001 tolerance)
- Verify no negative weights (long-only constraint)
- Check expected return meets target (if specified)
- Validate portfolio volatility is reasonable
    "mu": np.array,           # Expected returns vector (N × 1)
    "Sigma": np.ndarray,      # Covariance matrix (N × N)
    "returns_matrix": pd.DataFrame,  # Historical returns (T × N)
    "volatility": np.array,   # Individual volatilities (N × 1)
    "correlation": np.ndarray, # Correlation matrix (N × N)
    "beta": np.array,         # Beta values (N × 1)
    "rf_rate": float          # Risk-free rate (annualized)
}
```

### Robustness Checks
- Ensure covariance matrix is positive semi-definite
- Handle near-singular matrices with regularization
- Validate estimated returns are reasonable (-50% to +100% annually)
- Check for extreme correlations (>0.99 suggests duplicate data)

## Section 5: Portfolio Optimization Model
Use Mean Variance Optimization with cvxpy.

Constraints:
- Sum of weights equals one
- Expected return meets target
- Long only
- Max weight per stock
- Sector filters
- Minimum number of stocks

Alternate modes:
- Maximum Sharpe ratio
- Risk parity
- CVaR minimization

## Section 6: Post Processing of Weights
Convert weights into:
- Capital allocation
- Units of shares
- Leftover cash
- Normalized weights

## Section 7: Risk Analysis Engine
Compute:
- Expected return
- Volatility
- Sharpe ratio
- Value at risk
- Conditional value at risk
- Maximum drawdown
- Risk contribution
- Diversification ratio

## Section 8: Monte Carlo Engine
Simulate price paths to compute outcome distribution.

## Section 9: Explanation Generator
Explain:
- Why stocks selected
- Why weights chosen
- Sector logic
- Risk control logic
- How target return is met

## Section 10: Output Format
Output must include:
- Weights
- Units to buy
- Expected return
- Volatility
- Sharpe
- VaR
- CVaR
- Risk contribution
- Sector breakdown
- Monte Carlo summary
- Explanation text
- Chart data

## Section 11: System Design Requirements
Modules:
1. Input schema
2. Input interpreter
3. Data ingestion
4. Quant estimator
5. Optimizer
6. Post processor
7. Risk engine
8. Simulation engine
9. Explanation generator
10. API wrapper
11. Frontend guide
12. PDF exporter

## Section 12: Rules
- Never change architecture
- Use consistent input output formats
- Keep calculations consistent
- Connect modules cleanly
- Follow spec strictly

This master prompt governs all modules.
