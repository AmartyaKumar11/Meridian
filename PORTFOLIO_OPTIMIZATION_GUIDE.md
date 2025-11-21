# Portfolio Optimization - Complete Technical Guide

**Project:** Meridian Dashboard - Portfolio Agent  
**Last Updated:** November 21, 2025  
**Version:** 1.0.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Mathematical Foundation](#mathematical-foundation)
3. [Step-by-Step Process](#step-by-step-process)
4. [Optimization Techniques](#optimization-techniques)
5. [Risk Estimation Methods](#risk-estimation-methods)
6. [Monte Carlo Simulation](#monte-carlo-simulation)
7. [Implementation Details](#implementation-details)
8. [Code Architecture](#code-architecture)
9. [References & Resources](#references--resources)

---

## Project Overview

### What is Portfolio Optimization?

Portfolio optimization is the process of selecting the best portfolio (asset distribution) from a set of possible portfolios according to some objective. The objective typically involves maximizing expected return while minimizing risk (volatility).

### Core Objectives

1. **Maximize Returns**: Achieve the highest possible expected return
2. **Minimize Risk**: Reduce portfolio volatility and drawdowns
3. **Diversification**: Spread investments across uncorrelated assets
4. **Constraint Satisfaction**: Meet user-defined requirements (risk appetite, sector limits, etc.)

### Technology Stack

**Frontend:**
- Next.js 16.0.1 (React 19.2.0)
- TypeScript
- Tailwind CSS
- Recharts for visualizations

**Backend:**
- Python 3.13
- FastAPI (REST API)
- NumPy & Pandas (data processing)
- SciPy (optimization)
- cvxpy (convex optimization)
- yfinance (market data)

**Mathematical Libraries:**
- NumPy: Linear algebra, matrix operations
- SciPy: Optimization solvers (SLSQP, trust-constr)
- cvxpy: Convex optimization problems
- scikit-learn: Ledoit-Wolf covariance estimation

---

## Mathematical Foundation

### 1. Modern Portfolio Theory (MPT)

**Developed by:** Harry Markowitz (1952)  
**Nobel Prize:** 1990

#### Core Principles

Modern Portfolio Theory states that an investor can construct a portfolio of multiple assets that maximizes expected return for a given level of risk.

#### Key Assumptions

1. Investors are **rational** and **risk-averse**
2. Markets are **efficient** (prices reflect all available information)
3. Returns follow a **normal distribution**
4. Investors can **borrow and lend** at the risk-free rate
5. No **transaction costs** or **taxes** (relaxed in our implementation)

### 2. Portfolio Return

The expected return of a portfolio is the **weighted average** of individual asset returns.

**Formula:**

```
E[R_p] = Σ(w_i × E[R_i])

Where:
- E[R_p] = Expected portfolio return
- w_i = Weight of asset i in the portfolio
- E[R_i] = Expected return of asset i
- Σ w_i = 1 (weights sum to 100%)
```

**Matrix Notation:**

```
E[R_p] = w^T × μ

Where:
- w = (w_1, w_2, ..., w_n)^T (weight vector, n×1)
- μ = (E[R_1], E[R_2], ..., E[R_n])^T (expected return vector, n×1)
```

**Example:**

```
Portfolio: 60% Stock A, 40% Stock B
E[R_A] = 12% annually
E[R_B] = 8% annually

E[R_p] = 0.6 × 0.12 + 0.4 × 0.08
       = 0.072 + 0.032
       = 0.104 (10.4% annually)
```

### 3. Portfolio Risk (Volatility)

Portfolio risk is measured by the **standard deviation** of returns, which accounts for **correlation** between assets.

**Formula:**

```
σ_p = √(w^T × Σ × w)

Where:
- σ_p = Portfolio standard deviation (volatility)
- w = Weight vector (n×1)
- Σ = Covariance matrix (n×n)
- w^T = Transpose of weight vector (1×n)
```

**Expanded Form (2 assets):**

```
σ_p = √(w_A² σ_A² + w_B² σ_B² + 2 w_A w_B ρ_AB σ_A σ_B)

Where:
- σ_A, σ_B = Standard deviations of assets A and B
- ρ_AB = Correlation coefficient between A and B (-1 to +1)
```

**Key Insight:**

Portfolio risk is **NOT** just the weighted average of individual risks. Correlation matters!

**Example:**

```
Asset A: σ_A = 20%, w_A = 60%
Asset B: σ_B = 15%, w_B = 40%
Correlation: ρ_AB = 0.3

σ_p = √(0.6² × 0.2² + 0.4² × 0.15² + 2 × 0.6 × 0.4 × 0.3 × 0.2 × 0.15)
    = √(0.0144 + 0.0036 + 0.00432)
    = √0.02232
    = 0.1494 (14.94%)

Note: 14.94% < (0.6 × 20% + 0.4 × 15%) = 18%
This is the diversification benefit!
```

### 4. Covariance Matrix

The covariance matrix captures how assets move together.

**Definition:**

```
Σ_ij = Cov(R_i, R_j) = E[(R_i - μ_i)(R_j - μ_j)]

For i = j: Σ_ii = Var(R_i) = σ_i²
For i ≠ j: Σ_ij = ρ_ij × σ_i × σ_j
```

**Example (3 assets):**

```
        Stock A   Stock B   Stock C
Stock A [  σ_A²     ρ_AB×σ_A×σ_B   ρ_AC×σ_A×σ_C ]
Stock B [ ρ_AB×σ_A×σ_B    σ_B²     ρ_BC×σ_B×σ_C ]
Stock C [ ρ_AC×σ_A×σ_C  ρ_BC×σ_B×σ_C    σ_C²    ]

Properties:
1. Symmetric: Σ_ij = Σ_ji
2. Positive semi-definite
3. Diagonal = variances
4. Off-diagonal = covariances
```

### 5. Sharpe Ratio

The Sharpe ratio measures **risk-adjusted return** - how much excess return you get per unit of risk.

**Formula:**

```
Sharpe Ratio = (E[R_p] - R_f) / σ_p

Where:
- E[R_p] = Expected portfolio return
- R_f = Risk-free rate (e.g., 10-year government bond)
- σ_p = Portfolio standard deviation
```

**Interpretation:**

```
SR < 1.0  → Poor risk-adjusted return
SR = 1.0  → Acceptable
SR = 2.0  → Very good
SR > 3.0  → Exceptional
```

**Example:**

```
E[R_p] = 15%
R_f = 7%
σ_p = 12%

Sharpe = (0.15 - 0.07) / 0.12 = 0.67

Interpretation: For every 1% of risk, you earn 0.67% excess return
```

### 6. Efficient Frontier

The **Efficient Frontier** is the set of optimal portfolios that offer the highest expected return for a given level of risk.

**Concept:**

```
      Return
        ↑
        |     ╱╲  ← Efficient Frontier
        |    ╱  ╲
        |   ╱    ╲
        |  ╱      ╲
        | ╱  Feasible  ╲
        |╱   Region     ╲
        +─────────────────→ Risk (σ)
```

**Mathematical Formulation:**

For each target return μ_target, solve:

```
minimize   σ_p² = w^T Σ w
subject to:
    w^T μ = μ_target
    w^T 1 = 1
    w_i ≥ 0 (for long-only portfolios)
```

**Tangency Portfolio:**

The portfolio with the **maximum Sharpe ratio** on the efficient frontier.

```
Point where line from R_f is tangent to efficient frontier
This is the "Market Portfolio" in CAPM
```

---

## Step-by-Step Process

### Stage 0: User Inputs (18 Parameters)

#### Financial Goals
1. **Start Date** & **End Date**: Historical data period (e.g., 2020-01-01 to 2025-01-01)
2. **Risk Appetite**: Conservative / Moderate / Aggressive
3. **Target Return**: Desired annual return (e.g., 15%)
4. **Investment Horizon**: Time period (e.g., 5 years)
5. **Initial Capital**: Investment amount (e.g., ₹100,000)
6. **Inflation Rate**: Expected inflation (e.g., 6%)

#### Universe Definition
7. **Stock Universe**: NIFTY50 / NIFTY500 / Custom tickers
8. **Sectors Include**: List of sectors to include
9. **Sectors Exclude**: List of sectors to exclude
10. **Min Stocks**: Minimum stocks in portfolio (e.g., 8)
11. **Max Stocks**: Maximum stocks in portfolio (e.g., 15)

#### Optimization Settings
12. **Diversification Preference**: High / Balanced / Concentrated
13. **Transaction Costs**: Percentage per trade (e.g., 0.1%)
14. **Benchmark Index**: NIFTY50 / SENSEX / NIFTY500
15. **Optimization Mode**: Max Sharpe / Min Volatility / Risk Parity / Target Return / CVaR
16. **Rebalancing Frequency**: Monthly / Quarterly / Annually / None

---

### Stage 1: Data Ingestion & Quality Checks

#### 1.1 Fetch Historical Prices

**Data Source:** yfinance (Yahoo Finance API)

```python
import yfinance as yf

# Fetch data for NIFTY50 stocks
tickers = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', ...]
data = yf.download(tickers, start='2020-01-01', end='2025-01-01')

# Extract adjusted close prices
prices = data['Adj Close']
```

**Output:**
- DataFrame: (T × N) where T = trading days, N = number of stocks
- Example: 1,258 days × 50 stocks for 5-year NIFTY50

#### 1.2 Data Quality Checks

**A. IPO Filter**

Remove stocks that IPO'd during the analysis period (incomplete history).

```python
def filter_ipos(prices, start_date):
    """Remove stocks with missing data at start"""
    valid_stocks = []
    for ticker in prices.columns:
        first_valid = prices[ticker].first_valid_index()
        if first_valid <= start_date + timedelta(days=30):
            valid_stocks.append(ticker)
    return prices[valid_stocks]
```

**B. Delisting Detection**

Remove stocks that got delisted during the period.

```python
def filter_delisted(prices, end_date):
    """Remove stocks with missing data at end"""
    valid_stocks = []
    for ticker in prices.columns:
        last_valid = prices[ticker].last_valid_index()
        if last_valid >= end_date - timedelta(days=30):
            valid_stocks.append(ticker)
    return prices[valid_stocks]
```

**C. Outlier Capping**

Cap extreme returns to prevent optimizer from overfitting.

```python
def cap_outliers(returns, threshold=0.20):
    """Cap returns at ±20% per day"""
    return returns.clip(lower=-threshold, upper=threshold)
```

**D. Missing Data Handling**

Forward-fill missing values (e.g., holidays, trading halts).

```python
prices = prices.fillna(method='ffill').fillna(method='bfill')
```

**Output:**
- Clean price matrix: (T × N_valid)
- Data quality report:
  - IPO filtered: X stocks
  - Delisted filtered: Y stocks
  - Outliers capped: Z occurrences
  - Completeness: 98.5%

---

### Stage 2: Return & Risk Estimation

#### 2.1 Calculate Returns

**Daily Returns:**

```python
returns = prices.pct_change().dropna()

# Formula: r_t = (P_t - P_{t-1}) / P_{t-1}
```

**Annualization:**

```python
# Assume 252 trading days per year
annual_factor = 252

# Mean return (annualized)
mean_return = returns.mean() * annual_factor

# Standard deviation (annualized)
std_dev = returns.std() * np.sqrt(annual_factor)
```

#### 2.2 Expected Return Estimation (3 Methods)

**Method 1: Historical Average**

```python
μ = returns.mean() * 252
```

**Pros:** Simple, unbiased  
**Cons:** Assumes past = future, noisy

---

**Method 2: Exponentially Weighted Moving Average (EWMA)**

Gives more weight to recent observations.

```python
λ = 0.94  # Decay factor (RiskMetrics standard)

ewma_returns = returns.ewm(alpha=1-λ, adjust=False).mean()
μ = ewma_returns.iloc[-1] * 252
```

**Formula:**

```
r_t = λ × r_{t-1} + (1-λ) × observed_return_t

Weight of observation t days ago: (1-λ) × λ^t
```

**Example:**

```
λ = 0.94
Today's weight: 1 - 0.94 = 0.06 (6%)
Yesterday's weight: 0.06 × 0.94 = 0.0564 (5.64%)
2 days ago: 0.06 × 0.94² = 0.053 (5.3%)
...
30 days ago: 0.06 × 0.94^30 ≈ 0.009 (0.9%)
```

**Pros:** Adapts to changing market conditions  
**Cons:** Can be too reactive

---

**Method 3: Capital Asset Pricing Model (CAPM)**

Estimate returns based on systematic risk (beta).

```python
# Calculate beta for each stock vs benchmark
benchmark_returns = yf.download('^NSEI', ...)['Adj Close'].pct_change()

beta = {}
for ticker in returns.columns:
    cov = returns[ticker].cov(benchmark_returns)
    var_market = benchmark_returns.var()
    beta[ticker] = cov / var_market

# CAPM expected return
R_f = 0.07  # Risk-free rate (e.g., 10Y bond)
R_m = benchmark_returns.mean() * 252  # Market return

μ = {}
for ticker, β in beta.items():
    μ[ticker] = R_f + β * (R_m - R_f)
```

**Formula:**

```
E[R_i] = R_f + β_i × (E[R_m] - R_f)

β_i = Cov(R_i, R_m) / Var(R_m)
```

**Interpretation:**

```
β = 1.0 → Stock moves with market
β > 1.0 → Stock is more volatile than market (aggressive)
β < 1.0 → Stock is less volatile than market (defensive)
β < 0.0 → Stock moves opposite to market (rare)
```

**Pros:** Theoretically sound, accounts for systematic risk  
**Cons:** Assumes market efficiency, single-factor model

---

#### 2.3 Covariance Matrix Estimation

**Sample Covariance:**

```python
Σ_sample = returns.cov() * 252  # Annualized
```

**Problem:** Sample covariance is **noisy** with limited data!

```
For N assets, need to estimate N(N+1)/2 parameters
For N=50: Need 1,275 parameters!
With T=1,258 days: Only 25 observations per parameter
```

**Solution:** Ledoit-Wolf Shrinkage

---

#### 2.4 Ledoit-Wolf Shrinkage

**Idea:** Shrink sample covariance toward a structured target.

```python
from sklearn.covariance import LedoitWolf

lw = LedoitWolf()
Σ_shrunk = lw.fit(returns).covariance_ * 252
```

**Formula:**

```
Σ_shrunk = δ × F + (1 - δ) × Σ_sample

Where:
- δ = shrinkage intensity (0 to 1)
- F = target matrix (usually diagonal)
- Σ_sample = sample covariance
```

**Target Matrix (Constant Correlation):**

```
F_ij = σ_i × σ_j × ρ̄  (for i ≠ j)
F_ii = σ_i²

ρ̄ = average correlation across all pairs
```

**Shrinkage Intensity (Optimal δ):**

```
δ* = minimizes E[||Σ_shrunk - Σ_true||²]

Ledoit-Wolf provides analytical formula to estimate δ*
```

**Example:**

```
δ = 0.3

Σ_shrunk = 0.3 × [diagonal matrix] + 0.7 × [sample covariance]

Effect:
- Reduces extreme correlations
- Stabilizes matrix inversion
- Improves out-of-sample performance
```

**Output:**
- Expected return vector μ: (N × 1)
- Covariance matrix Σ: (N × N)
- Correlation heatmap for visualization

---

### Stage 3: Constraint Mapping

Translate user inputs into mathematical constraints.

#### 3.1 Risk Appetite → Volatility Limit

```python
risk_limits = {
    "Conservative": 0.12,   # Max 12% portfolio volatility
    "Moderate": 0.18,       # Max 18% portfolio volatility
    "Aggressive": 0.30      # Max 30% portfolio volatility
}

σ_max = risk_limits[risk_appetite]
```

**Constraint:**

```
√(w^T Σ w) ≤ σ_max
```

#### 3.2 Diversification → Position Limits

```python
position_limits = {
    "High": (0.02, 0.08),        # 2% to 8% per stock
    "Balanced": (0.01, 0.15),    # 1% to 15% per stock
    "Concentrated": (0.05, 0.30) # 5% to 30% per stock
}

w_min, w_max = position_limits[diversification_pref]
```

**Constraints:**

```
w_min ≤ w_i ≤ w_max  for all i
```

#### 3.3 Sector Exposure Limits

```python
# Example: Max 40% in any sector
sector_stocks = {
    'IT': ['TCS.NS', 'INFY.NS', ...],
    'Banking': ['HDFCBANK.NS', 'ICICIBANK.NS', ...],
    ...
}

for sector, tickers in sector_stocks.items():
    # Σ w_i ≤ 0.40 for i in sector
```

#### 3.4 Cardinality Constraint

Limit number of stocks in portfolio.

```python
# Between min_stocks and max_stocks
# This is NP-hard! Use heuristics:
# 1. Pre-filter to top K stocks by Sharpe ratio
# 2. Add small penalty for sparse solutions
```

#### 3.5 Complete Constraint List

```python
constraints = [
    # 1. Weights sum to 1
    {'type': 'eq', 'fun': lambda w: np.sum(w) - 1},
    
    # 2. Maximum volatility
    {'type': 'ineq', 'fun': lambda w: σ_max - np.sqrt(w.T @ Σ @ w)},
    
    # 3. Minimum return (if target return mode)
    {'type': 'ineq', 'fun': lambda w: w.T @ μ - target_return},
    
    # 4. Sector limits (for each sector)
    {'type': 'ineq', 'fun': lambda w: 0.40 - np.sum(w[sector_indices])},
]

bounds = [(w_min, w_max) for _ in range(N)]
```

---

### Stage 4: Portfolio Optimization (5 Modes)

#### Mode 1: Maximum Sharpe Ratio

**Objective:** Find portfolio with best risk-adjusted return.

```python
def objective(w):
    portfolio_return = w.T @ μ
    portfolio_vol = np.sqrt(w.T @ Σ @ w)
    sharpe = (portfolio_return - R_f) / portfolio_vol
    return -sharpe  # Minimize negative Sharpe = Maximize Sharpe

result = minimize(
    fun=objective,
    x0=w_equal,  # Start with equal weights
    method='SLSQP',
    bounds=bounds,
    constraints=constraints
)

w_optimal = result.x
```

**Mathematical Formulation:**

```
maximize   (w^T μ - R_f) / √(w^T Σ w)

subject to:
    Σ w_i = 1
    w_i ≥ 0
    Additional constraints...
```

**Equivalent Formulation (easier to solve):**

```
minimize   w^T Σ w
subject to:
    w^T μ = constant
    Σ w_i = 1
    w_i ≥ 0
```

---

#### Mode 2: Minimum Volatility

**Objective:** Find least risky portfolio.

```python
def objective(w):
    return w.T @ Σ @ w  # Minimize variance

result = minimize(
    fun=objective,
    x0=w_equal,
    method='SLSQP',
    bounds=bounds,
    constraints=constraints
)
```

**Mathematical Formulation:**

```
minimize   w^T Σ w

subject to:
    Σ w_i = 1
    w_i ≥ 0
    w^T μ ≥ target_return (optional)
```

**Use Case:** Conservative investors prioritizing capital preservation

---

#### Mode 3: Risk Parity

**Objective:** Each asset contributes equally to portfolio risk.

**Risk Contribution:**

```
RC_i = w_i × ∂σ_p/∂w_i = w_i × (Σw)_i / σ_p

Where (Σw)_i is the i-th element of Σw
```

**Target:** RC_i = 1/N for all i

```python
def objective(w):
    portfolio_vol = np.sqrt(w.T @ Σ @ w)
    marginal_contrib = (Σ @ w) / portfolio_vol
    risk_contrib = w * marginal_contrib
    target_rc = 1.0 / len(w)
    return np.sum((risk_contrib - target_rc)**2)

result = minimize(
    fun=objective,
    x0=w_equal,
    method='SLSQP',
    bounds=bounds,
    constraints=constraints
)
```

**Mathematical Formulation:**

```
minimize   Σ(RC_i - 1/N)²

subject to:
    Σ w_i = 1
    w_i ≥ 0
```

**Properties:**
- More diversified than max Sharpe
- Less sensitive to return estimates
- Popular in hedge funds

---

#### Mode 4: Target Return

**Objective:** Minimize risk while achieving target return.

```python
def objective(w):
    return w.T @ Σ @ w

constraints.append({
    'type': 'eq',
    'fun': lambda w: w.T @ μ - target_return
})

result = minimize(
    fun=objective,
    x0=w_equal,
    method='SLSQP',
    bounds=bounds,
    constraints=constraints
)
```

**Mathematical Formulation:**

```
minimize   w^T Σ w

subject to:
    w^T μ = target_return
    Σ w_i = 1
    w_i ≥ 0
```

**Note:** May be infeasible if target_return is too high!

---

#### Mode 5: Conditional Value at Risk (CVaR)

**Objective:** Minimize expected loss in worst-case scenarios.

**Definition:**

```
VaR_α = Value such that P(Loss > VaR_α) = α
CVaR_α = E[Loss | Loss > VaR_α]

Example: CVaR_0.05 = average loss in worst 5% of scenarios
```

**Implementation:**

```python
# Use historical simulation or Monte Carlo
scenarios = np.random.multivariate_normal(μ, Σ, size=10000)
portfolio_returns = scenarios @ w

# Sort returns (ascending)
sorted_returns = np.sort(portfolio_returns)

# CVaR at 5% level
α = 0.05
cutoff = int(α * len(sorted_returns))
cvar = -np.mean(sorted_returns[:cutoff])  # Negative of worst 5%
```

**Optimization:**

```python
def objective(w):
    scenarios = np.random.multivariate_normal(μ, Σ, size=10000)
    portfolio_returns = scenarios @ w
    sorted_returns = np.sort(portfolio_returns)
    cutoff = int(0.05 * len(sorted_returns))
    cvar = -np.mean(sorted_returns[:cutoff])
    return cvar

result = minimize(
    fun=objective,
    x0=w_equal,
    method='SLSQP',
    bounds=bounds,
    constraints=constraints
)
```

**Use Case:** Risk-averse investors concerned about tail risk

---

#### Solver Configuration

```python
# SciPy minimize options
options = {
    'maxiter': 1000,        # Maximum iterations
    'ftol': 1e-9,           # Function tolerance
    'disp': True            # Display convergence messages
}

result = minimize(
    fun=objective,
    x0=initial_weights,
    method='SLSQP',         # Sequential Least Squares Programming
    bounds=bounds,
    constraints=constraints,
    options=options
)

# Check convergence
if result.success:
    w_optimal = result.x
else:
    raise ValueError(f"Optimization failed: {result.message}")
```

**Alternative Solvers:**

1. **SLSQP**: Good for smooth problems with constraints
2. **trust-constr**: More robust, handles ill-conditioned problems
3. **cvxpy + ECOS**: For convex problems (faster, guaranteed global optimum)

---

### Stage 5: Share Calculation & Transaction Costs

#### 5.1 Fractional Weights → Integer Shares

**Problem:** Optimization gives fractional weights (e.g., 12.7% in stock A).  
**Need:** Integer number of shares to buy.

**Naive Rounding:**

```python
prices_current = yf.download(tickers, period='1d')['Close']

shares = {}
for ticker, weight in w_optimal.items():
    capital_allocated = weight * initial_capital
    shares[ticker] = int(capital_allocated / prices_current[ticker])
```

**Problem:** Rounding errors compound! May violate constraints.

**Better Approach: Greedy Rounding**

```python
def calculate_shares(weights, initial_capital, prices, transaction_cost_pct):
    # Sort stocks by weight (descending)
    sorted_stocks = sorted(weights.items(), key=lambda x: x[1], reverse=True)
    
    shares = {}
    cash_remaining = initial_capital
    
    for ticker, target_weight in sorted_stocks:
        target_value = target_weight * initial_capital
        price = prices[ticker]
        
        # Calculate shares (floor)
        num_shares = int(target_value / price)
        
        # Check if we have enough cash
        cost = num_shares * price * (1 + transaction_cost_pct)
        if cost <= cash_remaining:
            shares[ticker] = num_shares
            cash_remaining -= cost
        else:
            # Buy as many as possible
            num_shares = int(cash_remaining / (price * (1 + transaction_cost_pct)))
            if num_shares > 0:
                shares[ticker] = num_shares
                cash_remaining -= num_shares * price * (1 + transaction_cost_pct)
    
    return shares, cash_remaining
```

#### 5.2 Transaction Costs

**Types:**

1. **Brokerage Fee**: Fixed or percentage (e.g., 0.03%)
2. **Exchange Charges**: NSE/BSE fees (e.g., 0.003%)
3. **Securities Transaction Tax (STT)**: 0.1% on sell side
4. **Stamp Duty**: 0.015% on buy side
5. **GST**: 18% on brokerage

**Total Cost (India):**

```
Buy side: ~0.05% to 0.1%
Sell side: ~0.15% to 0.2%
Round-trip: ~0.2% to 0.3%
```

**Implementation:**

```python
transaction_cost_pct = 0.001  # 0.1% per trade

# Total cost
total_invested = sum(shares[t] * prices[t] for t in shares)
transaction_costs = total_invested * transaction_cost_pct

# Adjusted cash
cash_remaining = initial_capital - total_invested - transaction_costs
```

#### 5.3 Actual vs Target Allocation

```python
# Calculate actual weights
actual_weights = {}
total_value = sum(shares[t] * prices[t] for t in shares)

for ticker in shares:
    actual_weights[ticker] = (shares[ticker] * prices[ticker]) / total_value

# Compare to target
comparison = pd.DataFrame({
    'Target Weight': w_optimal,
    'Actual Weight': actual_weights,
    'Shares': shares,
    'Value': [shares[t] * prices[t] for t in shares],
    'Diff (%)': [(actual_weights.get(t, 0) - w_optimal[t]) * 100 for t in w_optimal]
})
```

**Output:**
- Shares to buy for each stock
- Actual weights vs target weights
- Transaction costs breakdown
- Cash remaining

---

### Stage 6: Risk Metrics & Benchmark Comparison

#### 6.1 Portfolio Metrics

**1. Expected Return**

```python
E[R_p] = w^T @ μ
```

**2. Volatility (Annualized)**

```python
σ_p = np.sqrt(w^T @ Σ @ w)
```

**3. Sharpe Ratio**

```python
sharpe = (E[R_p] - R_f) / σ_p
```

**4. Sortino Ratio**

Like Sharpe, but only penalizes **downside** volatility.

```python
# Downside deviation (only negative returns)
downside_returns = returns[returns < 0]
σ_downside = downside_returns.std() * np.sqrt(252)

sortino = (E[R_p] - R_f) / σ_downside
```

**5. Maximum Drawdown**

Largest peak-to-trough decline.

```python
# Calculate cumulative returns
portfolio_returns = (returns @ w).cumsum()
cumulative_wealth = (1 + portfolio_returns).cumprod()

# Running maximum
running_max = cumulative_wealth.expanding().max()

# Drawdown at each point
drawdown = (cumulative_wealth - running_max) / running_max

max_drawdown = drawdown.min()
```

**Example:**

```
Portfolio value: 100 → 120 → 90 → 110
Peak: 120
Trough: 90
Max Drawdown: (90 - 120) / 120 = -25%
```

**6. Value at Risk (VaR)**

Maximum expected loss at α confidence level.

```python
# Historical VaR (5% level)
portfolio_returns = returns @ w
VaR_05 = np.percentile(portfolio_returns, 5) * np.sqrt(252)

# Interpretation: 95% chance daily loss won't exceed VaR
```

**7. Conditional VaR (CVaR)**

Expected loss given loss exceeds VaR.

```python
cutoff = np.percentile(portfolio_returns, 5)
CVaR_05 = portfolio_returns[portfolio_returns <= cutoff].mean() * np.sqrt(252)
```

**8. Beta (vs Benchmark)**

```python
benchmark_returns = yf.download('^NSEI', ...)['Adj Close'].pct_change()
portfolio_returns = returns @ w

covariance = np.cov(portfolio_returns, benchmark_returns)[0, 1]
benchmark_variance = benchmark_returns.var()

beta = covariance / benchmark_variance
```

**9. Alpha (Jensen's Alpha)**

Excess return after adjusting for systematic risk.

```python
R_m = benchmark_returns.mean() * 252  # Benchmark return

alpha = E[R_p] - (R_f + beta * (R_m - R_f))
```

**Interpretation:**

```
α > 0 → Outperforming benchmark (skill!)
α = 0 → Matching benchmark
α < 0 → Underperforming benchmark
```

**10. Tracking Error**

Standard deviation of excess returns vs benchmark.

```python
excess_returns = portfolio_returns - benchmark_returns
tracking_error = excess_returns.std() * np.sqrt(252)
```

**11. Information Ratio**

Alpha per unit of tracking error.

```python
information_ratio = alpha / tracking_error
```

#### 6.2 Benchmark Comparison

```python
# Calculate benchmark metrics
benchmark_return = R_m
benchmark_vol = benchmark_returns.std() * np.sqrt(252)
benchmark_sharpe = (R_m - R_f) / benchmark_vol

# Comparison table
comparison = {
    'Metric': ['Return', 'Volatility', 'Sharpe', 'Beta', 'Alpha'],
    'Portfolio': [E[R_p], σ_p, sharpe, beta, alpha],
    'Benchmark': [benchmark_return, benchmark_vol, benchmark_sharpe, 1.0, 0.0],
    'Difference': [
        E[R_p] - benchmark_return,
        σ_p - benchmark_vol,
        sharpe - benchmark_sharpe,
        beta - 1.0,
        alpha
    ]
}
```

---

### Stage 7: Monte Carlo Simulation

#### 7.1 Geometric Brownian Motion (GBM)

**Assumption:** Stock prices follow GBM.

```
dS_t = μ S_t dt + σ S_t dW_t

Where:
- S_t = Stock price at time t
- μ = Drift (expected return)
- σ = Volatility
- dW_t = Wiener process (Brownian motion)
```

**Discrete Form:**

```
S_{t+1} = S_t × exp((μ - σ²/2)Δt + σ√Δt × Z)

Where:
- Δt = Time step (e.g., 1/252 for daily)
- Z ~ N(0, 1) (standard normal)
```

#### 7.2 Correlated Simulations

**Problem:** Stocks are correlated! Can't simulate independently.

**Solution:** Cholesky Decomposition

```python
# Decompose covariance matrix
L = np.linalg.cholesky(Σ)

# Property: Σ = L @ L.T
```

**Correlated Random Numbers:**

```python
# Generate independent standard normals
Z = np.random.normal(0, 1, size=(num_paths, num_stocks, num_steps))

# Apply Cholesky to get correlated shocks
ε = L @ Z  # Now ε has covariance Σ
```

#### 7.3 Simulation Algorithm

```python
def monte_carlo_simulation(w, μ, Σ, S0, T, num_paths=10000):
    """
    w: Portfolio weights
    μ: Expected returns (annual)
    Σ: Covariance matrix (annual)
    S0: Current prices
    T: Time horizon (years)
    """
    dt = 1/252  # Daily time step
    num_steps = int(T * 252)
    num_stocks = len(w)
    
    # Cholesky decomposition
    L = np.linalg.cholesky(Σ)
    
    # Initialize price paths
    S = np.zeros((num_paths, num_stocks, num_steps + 1))
    S[:, :, 0] = S0  # Initial prices
    
    # Simulate paths
    for t in range(num_steps):
        # Independent standard normals
        Z = np.random.normal(0, 1, size=(num_paths, num_stocks))
        
        # Correlated shocks
        ε = (L @ Z.T).T  # Shape: (num_paths, num_stocks)
        
        # GBM update
        drift = (μ - np.diag(Σ)/2) * dt
        diffusion = np.sqrt(dt) * ε
        
        S[:, :, t+1] = S[:, :, t] * np.exp(drift + diffusion)
    
    # Calculate portfolio values
    portfolio_value = np.sum(w * S, axis=1)  # Shape: (num_paths, num_steps+1)
    
    return portfolio_value

# Run simulation
portfolio_paths = monte_carlo_simulation(w_optimal, μ, Σ, prices_current, T=5)
```

#### 7.4 Analysis of Simulation Results

**Percentiles:**

```python
# Final values at horizon
final_values = portfolio_paths[:, -1]

percentiles = {
    '5th': np.percentile(final_values, 5),
    '25th': np.percentile(final_values, 25),
    '50th': np.percentile(final_values, 50),
    '75th': np.percentile(final_values, 75),
    '95th': np.percentile(final_values, 95)
}
```

**Probability of Achieving Target:**

```python
target_value = initial_capital * (1 + target_return) ** T

prob_target = np.mean(final_values >= target_value)

print(f"Probability of achieving {target_return*100}% return: {prob_target*100:.1f}%")
```

**Expected Value:**

```python
E[V_T] = np.mean(final_values)
```

**Visualization:**

```python
import matplotlib.pyplot as plt

# Plot probability cone
plt.figure(figsize=(12, 6))

# Calculate percentiles at each time step
time_steps = portfolio_paths.shape[1]
p5 = np.percentile(portfolio_paths, 5, axis=0)
p50 = np.percentile(portfolio_paths, 50, axis=0)
p95 = np.percentile(portfolio_paths, 95, axis=0)

time = np.arange(time_steps) / 252  # Convert to years

plt.fill_between(time, p5, p95, alpha=0.3, label='90% Confidence Interval')
plt.plot(time, p50, linewidth=2, label='Median (50th percentile)')
plt.axhline(y=target_value, color='red', linestyle='--', label='Target Value')

plt.xlabel('Years')
plt.ylabel('Portfolio Value (₹)')
plt.title('Monte Carlo Simulation: Portfolio Value Over Time')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

---

### Stage 8: Natural Language Explanation

Generate plain English summary of portfolio construction.

```python
def generate_explanation(w, μ, Σ, sharpe, sectors, metrics):
    explanation = {
        'summary': '',
        'stock_selection': '',
        'weight_logic': '',
        'risk_suitability': ''
    }
    
    # Summary
    top_holdings = sorted(w.items(), key=lambda x: x[1], reverse=True)[:5]
    top_sectors = get_top_sectors(w, sectors)
    
    explanation['summary'] = f"""
    Your portfolio allocates {initial_capital:,.0f} across {len(w)} stocks, 
    with the largest positions in {', '.join([f'{t[0]} ({t[1]*100:.1f}%)' for t in top_holdings[:3]])}. 
    
    The portfolio is diversified across {len(top_sectors)} sectors, with the highest 
    exposure to {top_sectors[0][0]} ({top_sectors[0][1]*100:.1f}%).
    
    Expected annual return: {μ.dot(w)*100:.1f}% with volatility of {np.sqrt(w.T @ Σ @ w)*100:.1f}%.
    """
    
    # Stock Selection
    explanation['stock_selection'] = f"""
    Stocks were selected from the {stock_universe} universe based on:
    
    1. **Data Quality**: Removed {ipo_filtered} stocks that IPO'd during analysis period
       and {delisted_filtered} stocks that were delisted.
    
    2. **Sector Constraints**: {len(sectors_include)} sectors were included 
       ({', '.join(sectors_include[:5])}...) and {len(sectors_exclude)} were excluded.
    
    3. **Return Potential**: Expected returns were estimated using {return_method} 
       {'with Ledoit-Wolf shrinkage applied to the covariance matrix' if use_shrinkage else ''}.
    
    The final universe consisted of {len(valid_stocks)} stocks meeting all criteria.
    """
    
    # Weight Logic
    if optimization_mode == 'max_sharpe':
        explanation['weight_logic'] = f"""
        Portfolio weights were determined by **maximizing the Sharpe ratio** ({sharpe:.2f}),
        which measures risk-adjusted return. This means the portfolio offers {sharpe:.2f}% 
        of excess return for every 1% of risk taken.
        
        The optimizer balanced two objectives:
        - Maximizing expected return ({μ.dot(w)*100:.1f}%)
        - Minimizing portfolio volatility ({np.sqrt(w.T @ Σ @ w)*100:.1f}%)
        
        Stocks with higher expected returns and lower correlations received larger allocations.
        """
    elif optimization_mode == 'min_volatility':
        explanation['weight_logic'] = f"""
        Portfolio weights were determined by **minimizing volatility** while achieving your
        target return of {target_return*100:.1f}%. The resulting portfolio has a standard 
        deviation of {np.sqrt(w.T @ Σ @ w)*100:.1f}%, which is {comparison_to_benchmark}% 
        {'lower' if comparison_to_benchmark > 0 else 'higher'} than the {benchmark_index}.
        
        Defensive stocks with low volatility and negative correlations received higher weights.
        """
    # ... other modes
    
    # Risk Suitability
    risk_level = "low" if σ_p < 0.12 else "moderate" if σ_p < 0.18 else "high"
    
    explanation['risk_suitability'] = f"""
    This portfolio is suitable for your **{risk_appetite}** risk appetite because:
    
    1. **Volatility**: {σ_p*100:.1f}% matches your target risk level ({risk_limits[risk_appetite]*100:.0f}% max).
    
    2. **Diversification**: {len(w)} stocks across {len(top_sectors)} sectors provides 
       {'excellent' if len(w) > 15 else 'good' if len(w) > 10 else 'moderate'} diversification.
    
    3. **Maximum Drawdown**: Historical analysis suggests a maximum drawdown of {max_drawdown*100:.1f}%, 
       which is within acceptable limits for {risk_appetite.lower()} investors.
    
    4. **Beta**: Portfolio beta of {beta:.2f} indicates the portfolio is 
       {'more' if beta > 1 else 'less'} volatile than the market, 
       {'consistent with an aggressive' if beta > 1.2 else 'suitable for a defensive' if beta < 0.8 else 'aligned with a moderate'}
       risk profile.
    
    Monte Carlo simulation shows a {prob_target*100:.0f}% probability of achieving your 
    {target_return*100:.0f}% return target over {investment_horizon} years.
    """
    
    return explanation
```

---

## Implementation Details

### Backend Architecture

```
backend/
├── api/
│   └── main.py                 # FastAPI endpoints
├── core/
│   └── generator.py            # Portfolio generation orchestration
├── quant/
│   ├── optimizer.py            # Optimization algorithms
│   ├── risk_metrics.py         # Risk calculations
│   └── monte_carlo.py          # Simulation engine
├── data/
│   └── fetcher.py              # yfinance data fetching
└── utils/
    ├── validators.py           # Input validation
    └── formatters.py           # Output formatting
```

### Key Classes

#### PortfolioOptimizer

```python
class PortfolioOptimizer:
    def __init__(self, expected_returns, cov_matrix, risk_free_rate=0.07):
        self.mu = expected_returns.values
        self.sigma = cov_matrix.values
        self.tickers = expected_returns.index.tolist()
        self.rf = risk_free_rate
        self.n_assets = len(self.tickers)
    
    def max_sharpe(self, bounds, constraints):
        """Maximize Sharpe ratio"""
        def neg_sharpe(w):
            ret = w @ self.mu
            vol = np.sqrt(w @ self.sigma @ w)
            return -(ret - self.rf) / vol
        
        result = minimize(
            neg_sharpe,
            x0=np.ones(self.n_assets) / self.n_assets,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints
        )
        return result.x
    
    def min_volatility(self, bounds, constraints):
        """Minimize portfolio volatility"""
        def objective(w):
            return w @ self.sigma @ w
        
        result = minimize(
            objective,
            x0=np.ones(self.n_assets) / self.n_assets,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints
        )
        return result.x
    
    # ... other optimization modes
```

#### RiskMetrics

```python
class RiskMetrics:
    @staticmethod
    def sharpe_ratio(returns, risk_free_rate):
        excess_return = returns.mean() - risk_free_rate / 252
        return np.sqrt(252) * excess_return / returns.std()
    
    @staticmethod
    def sortino_ratio(returns, risk_free_rate):
        excess_return = returns.mean() - risk_free_rate / 252
        downside_std = returns[returns < 0].std()
        return np.sqrt(252) * excess_return / downside_std
    
    @staticmethod
    def max_drawdown(returns):
        cumulative = (1 + returns).cumprod()
        running_max = cumulative.expanding().max()
        drawdown = (cumulative - running_max) / running_max
        return drawdown.min()
    
    @staticmethod
    def value_at_risk(returns, confidence=0.05):
        return np.percentile(returns, confidence * 100)
    
    @staticmethod
    def conditional_var(returns, confidence=0.05):
        var = RiskMetrics.value_at_risk(returns, confidence)
        return returns[returns <= var].mean()
```

#### MonteCarloSimulator

```python
class MonteCarloSimulator:
    def __init__(self, expected_returns, cov_matrix, num_simulations=10000):
        self.mu = expected_returns
        self.sigma = cov_matrix
        self.num_simulations = num_simulations
        self.cholesky = np.linalg.cholesky(cov_matrix)
    
    def simulate_paths(self, weights, initial_prices, horizon_years):
        num_steps = int(horizon_years * 252)
        num_assets = len(weights)
        
        # Initialize
        paths = np.zeros((self.num_simulations, num_assets, num_steps + 1))
        paths[:, :, 0] = initial_prices
        
        # Daily parameters
        dt = 1/252
        drift = (self.mu - np.diag(self.sigma)/2) * dt
        
        for t in range(num_steps):
            # Correlated random shocks
            Z = np.random.normal(0, 1, (self.num_simulations, num_assets))
            shocks = (self.cholesky @ Z.T).T * np.sqrt(dt)
            
            # Update prices
            paths[:, :, t+1] = paths[:, :, t] * np.exp(drift + shocks)
        
        # Calculate portfolio values
        portfolio_values = np.sum(weights * paths, axis=1)
        
        return portfolio_values
    
    def calculate_statistics(self, portfolio_values):
        final_values = portfolio_values[:, -1]
        
        return {
            'mean': np.mean(final_values),
            'std': np.std(final_values),
            'percentiles': {
                '5th': np.percentile(final_values, 5),
                '25th': np.percentile(final_values, 25),
                '50th': np.percentile(final_values, 50),
                '75th': np.percentile(final_values, 75),
                '95th': np.percentile(final_values, 95)
            }
        }
```

---

## Code Architecture

### API Endpoints

#### POST /api/portfolio/ingest

Fetch and validate market data.

```python
@app.post("/api/portfolio/ingest")
async def ingest_data(request: IngestRequest):
    # 1. Fetch prices from yfinance
    prices = fetch_prices(
        tickers=request.tickers,
        start=request.start_date,
        end=request.end_date
    )
    
    # 2. Quality checks
    valid_tickers = filter_ipos(prices, request.start_date)
    valid_tickers = filter_delisted(valid_tickers, request.end_date)
    
    # 3. Calculate returns
    returns = prices.pct_change().dropna()
    returns = cap_outliers(returns, threshold=0.20)
    
    # 4. Store in cache/database
    data_id = cache.store(prices, returns)
    
    return {
        'data_id': data_id,
        'valid_stocks': valid_tickers.columns.tolist(),
        'quality_metrics': {
            'ipo_filtered': len(request.tickers) - len(valid_tickers.columns),
            'completeness': (1 - returns.isnull().sum().sum() / returns.size) * 100
        }
    }
```

#### POST /api/portfolio/optimize

Run optimization algorithm.

```python
@app.post("/api/portfolio/optimize")
async def optimize_portfolio(request: OptimizeRequest):
    # 1. Retrieve data
    prices, returns = cache.get(request.data_id)
    
    # 2. Estimate parameters
    if request.return_method == 'ewma':
        mu = returns.ewm(alpha=0.06).mean().iloc[-1] * 252
    else:
        mu = returns.mean() * 252
    
    # 3. Covariance estimation
    if request.use_shrinkage:
        lw = LedoitWolf()
        sigma = lw.fit(returns).covariance_ * 252
    else:
        sigma = returns.cov() * 252
    
    # 4. Setup constraints
    constraints = build_constraints(request)
    bounds = build_bounds(request)
    
    # 5. Optimize
    optimizer = PortfolioOptimizer(mu, sigma, request.risk_free_rate)
    
    if request.optimization_mode == 'max_sharpe':
        weights = optimizer.max_sharpe(bounds, constraints)
    elif request.optimization_mode == 'min_volatility':
        weights = optimizer.min_volatility(bounds, constraints)
    # ... other modes
    
    # 6. Calculate shares
    current_prices = fetch_latest_prices(returns.columns)
    shares, cash = calculate_shares(
        weights, 
        request.initial_capital, 
        current_prices,
        request.transaction_cost_pct
    )
    
    # 7. Calculate metrics
    metrics = calculate_all_metrics(weights, returns, request.benchmark)
    
    return {
        'weights': dict(zip(returns.columns, weights)),
        'shares': shares,
        'cash_remaining': cash,
        'metrics': metrics
    }
```

#### GET /api/portfolio/simulate

Run Monte Carlo simulation.

```python
@app.get("/api/portfolio/simulate")
async def simulate_portfolio(portfolio_id: str, num_paths: int = 10000):
    # 1. Retrieve portfolio
    portfolio = db.get_portfolio(portfolio_id)
    
    # 2. Run simulation
    simulator = MonteCarloSimulator(
        portfolio['mu'], 
        portfolio['sigma'],
        num_simulations=num_paths
    )
    
    paths = simulator.simulate_paths(
        portfolio['weights'],
        portfolio['current_prices'],
        portfolio['horizon_years']
    )
    
    # 3. Calculate statistics
    stats = simulator.calculate_statistics(paths)
    
    # 4. Probability of target
    target_value = portfolio['initial_capital'] * (1 + portfolio['target_return']) ** portfolio['horizon_years']
    prob_target = np.mean(paths[:, -1] >= target_value)
    
    return {
        'statistics': stats,
        'probability_target': prob_target,
        'paths_sample': paths[:100, ::10].tolist()  # Return sample for visualization
    }
```

---

## References & Resources

### Academic Papers

1. **Markowitz, H. (1952)**  
   "Portfolio Selection"  
   *Journal of Finance, 7(1), 77-91*  
   [Original MPT paper]

2. **Sharpe, W. F. (1964)**  
   "Capital Asset Prices: A Theory of Market Equilibrium under Conditions of Risk"  
   *Journal of Finance, 19(3), 425-442*  
   [CAPM foundation]

3. **Ledoit, O., & Wolf, M. (2004)**  
   "Honey, I Shrunk the Sample Covariance Matrix"  
   *Journal of Portfolio Management, 30(4), 110-119*  
   [Covariance shrinkage]

4. **Rockafellar, R. T., & Uryasev, S. (2000)**  
   "Optimization of Conditional Value-at-Risk"  
   *Journal of Risk, 2, 21-42*  
   [CVaR optimization]

5. **Maillard, S., Roncalli, T., & Teïletche, J. (2010)**  
   "The Properties of Equally Weighted Risk Contribution Portfolios"  
   *Journal of Portfolio Management, 36(4), 60-70*  
   [Risk Parity]

### Books

1. **"Modern Portfolio Theory and Investment Analysis"**  
   Elton, Gruber, Brown, Goetzmann  
   [Comprehensive MPT textbook]

2. **"Quantitative Equity Portfolio Management"**  
   Qian, Hua, Sorensen  
   [Practical implementation]

3. **"Active Portfolio Management"**  
   Grinold & Kahn  
   [Advanced techniques]

### Online Resources

1. **QuantLib**: Quantitative finance library  
   https://www.quantlib.org/

2. **PyPortfolioOpt**: Python portfolio optimization  
   https://pyportfolioopt.readthedocs.io/

3. **Quantopian Lectures**: Free quant finance course  
   https://www.quantopian.com/lectures

4. **Portfolio Visualizer**: Online portfolio analysis  
   https://www.portfoliovisualizer.com/

### Python Libraries

```python
# Core
import numpy as np              # Linear algebra
import pandas as pd             # Data manipulation
import scipy.optimize           # Optimization
import cvxpy as cp              # Convex optimization

# Data
import yfinance as yf           # Market data
import pandas_datareader as pdr # Alternative data source

# Statistics
from sklearn.covariance import LedoitWolf  # Shrinkage
import statsmodels.api as sm               # Time series

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
```

---

## Glossary

**Alpha (α)**: Excess return over benchmark after adjusting for risk

**Beta (β)**: Sensitivity to market movements (systematic risk)

**CAPM**: Capital Asset Pricing Model - relates risk to expected return

**Covariance**: Measure of how two assets move together

**CVaR**: Conditional Value at Risk - expected loss in worst-case scenarios

**Diversification**: Spreading investments to reduce risk

**Efficient Frontier**: Set of optimal risk-return portfolios

**EWMA**: Exponentially Weighted Moving Average - gives more weight to recent data

**GBM**: Geometric Brownian Motion - stochastic model for stock prices

**Ledoit-Wolf**: Covariance matrix shrinkage technique

**MPT**: Modern Portfolio Theory - framework for portfolio construction

**Sharpe Ratio**: Risk-adjusted return metric

**Shrinkage**: Reducing estimation error by moving toward a target

**Sortino Ratio**: Sharpe ratio using only downside volatility

**VaR**: Value at Risk - maximum expected loss at confidence level

---

**End of Portfolio Optimization Guide**

*This document provides the complete mathematical and technical foundation for understanding the portfolio optimization system in the Meridian Dashboard.*
