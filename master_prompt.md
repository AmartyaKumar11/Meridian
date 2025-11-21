# Master Prompt for the Entire Portfolio Generator System

You are building a complete quant based portfolio generator system. The system takes user inputs, processes market data, runs quantitative optimization algorithms, computes risk metrics, generates explanations, and returns a fully constructed investment portfolio with visual outputs.

Build the system using the following full specification. Follow this spec consistently in every module. Every module must follow the same architecture, inputs, constraints, and output structure.

## Section 1: User Inputs Required
1. Start date
2. End date or investment horizon
3. Risk appetite (low, moderate, high)
4. Target return in percent
5. Initial capital
6. Inflation rate
7. Include sectors (list)
8. Exclude sectors (list)
9. Maximum weight per stock
10. Minimum number of stocks
11. Rebalancing preference (optional)

## Section 2: Input to Constraint Mapping
Translate user inputs into quant constraints.

1. Risk appetite
2. Target return
3. Horizon
4. Sector filters
5. Maximum weight per stock
6. Minimum number of stocks
7. Inflation rate

## Section 3: Data Universe and Market Data
Build a universe of stocks with sector information. Fetch:
- Daily adjusted prices
- Sector tag
- Market cap
- Beta
- Historical returns

## Section 4: Return and Risk Estimation
Compute:
- Daily returns
- Annualized expected return
- Annualized covariance matrix
- Ledoit Woolf shrinkage
- Volatility
- Correlation matrix

Outputs:
- mu
- Sigma
- Returns matrix

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
