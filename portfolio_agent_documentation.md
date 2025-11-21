# Portfolio Agent - Living Documentation

**Last Updated:** November 21, 2025  
**Status:** In Development  
**Version:** 1.0.0

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [User Journey](#user-journey)
3. [Architecture](#architecture)
4. [API Specifications](#api-specifications)
5. [UI Components](#ui-components)
6. [Calculation Methods](#calculation-methods)
7. [Data Flow](#data-flow)
8. [Implementation Progress](#implementation-progress)
9. [Technical Decisions](#technical-decisions)
10. [Testing Strategy](#testing-strategy)

---

## Feature Overview

### Purpose
The Portfolio Agent is a dedicated page/portal that guides users through creating an optimized stock portfolio based on their financial goals, risk appetite, and constraints.

### Key Features
- **18 User Inputs**: Comprehensive configuration for personalized portfolio generation
- **Step-by-Step Wizard**: Visual walkthrough of each calculation stage
- **Real-Time Progress**: Live updates during data fetching, optimization, and simulation
- **Educational Transparency**: Explains what's happening at each step and why
- **Multiple Output Formats**: JSON, PDF, CSV, HTML downloads
- **Benchmark Comparison**: Compare against Nifty50/Sensex indices
- **Monte Carlo Simulation**: 10,000 paths to visualize future outcomes

### Design Philosophy
- **Transparency**: Show user exactly what's happening in the background
- **Education**: Explain financial concepts in plain language
- **Control**: Give user full control over all parameters
- **Consistency**: Match existing app theme (dark mode, Groww green #00D09C, Inter font)

---

## User Journey

### Entry Point
User clicks "Portfolio" button on right sidebar → Navigates to `/portfolio` route

### Journey Stages

#### Stage 1: Input Collection (Steps 1-2)
1. **Welcome Screen**: Introduction to Portfolio Agent with feature overview
2. **Date Range Selection**: Start date, End date (or "From Chart" option)
3. **Financial Goals**: Risk appetite (Conservative/Moderate/Aggressive), Target return, Investment horizon
4. **Capital & Economics**: Initial capital, Inflation rate expectation
5. **Universe Definition**: Sector inclusions/exclusions, Min/max stocks, Stock universe (Nifty50/Nifty500/Custom)
6. **Optimization Settings**: Diversification preference, Transaction costs, Benchmark index
7. **Rebalancing**: Frequency (Monthly/Quarterly/Annually), Enable/disable

#### Stage 2: Data Processing (Step 3)
8. **Data Ingestion**: Fetch historical prices from yfinance
   - Progress bar showing: X/Y stocks fetched
   - Real-time log: "Fetching RELIANCE.NS...", "Validating TCS.NS..."
   - Quality checks: IPO filter, delisting detection, outlier capping
   - Display: Valid stocks, Invalid tickers, Data completeness %

#### Stage 3: Analysis (Steps 4-5)
9. **Return Estimation**: Calculate expected returns using Historical/EWMA/CAPM
   - Show: Return distribution histogram
   - Explain: "Using EWMA (λ=0.94) because horizon > 3 years"
   
10. **Risk Estimation**: Build covariance matrix with Ledoit-Wolf shrinkage
    - Show: Correlation heatmap
    - Explain: "Applied shrinkage (δ=0.3) to reduce estimation error"

11. **Constraint Mapping**: Translate inputs to mathematical constraints
    - Show: Interactive formulas
    - Example: "Moderate Risk → Portfolio volatility ≤ 18%"

#### Stage 4: Optimization (Step 6)
12. **Portfolio Optimization**: Run cvxpy solver
    - Progress: Solver status, Iterations, Objective value
    - Show: Preliminary weights (fractional)
    - Explain: "Maximizing Sharpe ratio subject to 12 constraints"

#### Stage 5: Finalization (Step 7)
13. **Share Calculation**: Convert weights to integer shares
    - Show: Side-by-side comparison (Target % vs Actual %)
    - Display: Transaction costs breakdown
    - Calculate: Cash remaining

#### Stage 6: Risk Analysis (Step 8)
14. **Risk Metrics**: Calculate 11 metrics
    - Display: Interactive cards with tooltips
    - Benchmark comparison: Alpha, Beta, Tracking Error
    - Explain: "Your Sharpe ratio (1.83) exceeds Nifty50 (1.45)"

#### Stage 7: Simulation (Step 9)
15. **Monte Carlo**: Run 10,000 GBM paths
    - Animated progress: "Simulating path 5000/10000..."
    - Show: Probability cone chart (5th/50th/95th percentiles)
    - Calculate: P(achieving target return), Expected value at horizon

#### Stage 8: Results (Steps 10-11)
16. **Natural Language Summary**: Generate plain English explanation
    - Why these stocks?
    - How were weights determined?
    - Is this suitable for my goals?

17. **Final Dashboard**: Comprehensive results
    - Allocation pie chart + table
    - All risk metrics
    - Monte Carlo outcomes
    - Download buttons (PDF, JSON, CSV)

---

## Architecture

### Frontend Stack
- **Framework**: Next.js 16.0.1 (App Router)
- **UI**: React 19.2.0, TypeScript 5.x
- **Styling**: Tailwind CSS (matching existing theme)
- **Charts**: Recharts (existing library in app)
- **State Management**: React hooks (useState, useReducer for wizard state)
- **API Calls**: fetch with error boundaries

### Backend Stack
- **API Framework**: FastAPI
- **Optimization**: cvxpy (ECOS/SCS solvers)
- **Data**: yfinance, pandas, numpy
- **Statistics**: scipy (for Ledoit-Wolf, Monte Carlo)
- **Report Generation**: reportlab (PDF), jinja2 (HTML templates)

### File Structure
```
dashboard/
├── app/
│   ├── portfolio/
│   │   ├── page.tsx                 # Main Portfolio Agent page
│   │   ├── layout.tsx               # Layout matching app theme
│   │   └── components/
│   │       ├── WizardStepper.tsx    # Multi-step wizard container
│   │       ├── InputStage.tsx       # User input forms
│   │       ├── DataIngestionStage.tsx
│   │       ├── AnalysisStage.tsx
│   │       ├── OptimizationStage.tsx
│   │       ├── RiskAnalysisStage.tsx
│   │       ├── SimulationStage.tsx
│   │       ├── ResultsStage.tsx
│   │       └── ProgressLogger.tsx   # Real-time log component
│   └── api/
│       └── portfolio/
│           ├── ingest/route.ts      # POST data ingestion
│           ├── optimize/route.ts    # POST optimization
│           ├── simulate/route.ts    # GET Monte Carlo
│           └── explain/route.ts     # GET NL explanation
├── backend/
│   ├── portfolio_optimizer/
│   │   ├── __init__.py
│   │   ├── input_schema.py          # Pydantic models for 18 inputs
│   │   ├── data_ingestion.py        # yfinance fetching + quality checks
│   │   ├── return_estimation.py     # Historical/EWMA/CAPM
│   │   ├── risk_estimation.py       # Covariance + Ledoit-Wolf
│   │   ├── constraint_mapper.py     # Risk appetite → math constraints
│   │   ├── optimizer.py             # cvxpy optimization (5 modes)
│   │   ├── share_calculator.py      # Fractional → integer shares
│   │   ├── risk_metrics.py          # 11 metrics + benchmark
│   │   ├── monte_carlo.py           # GBM simulation
│   │   ├── explainer.py             # Natural language generator
│   │   └── report_generator.py      # PDF/CSV/JSON export
│   └── api_portfolio.py             # FastAPI endpoints
└── portfolio_agent_documentation.md # This file
```

---

## API Specifications

### POST /api/portfolio/ingest

**Request Body:**
```json
{
  "start_date": "2020-01-01",
  "end_date": "2025-01-01",
  "stock_universe": "NIFTY50",
  "custom_tickers": [],
  "sectors_include": ["IT", "Banking"],
  "sectors_exclude": ["Energy"],
  "min_stocks": 8,
  "max_stocks": 15
}
```

**Response:**
```json
{
  "status": "success",
  "valid_stocks": ["RELIANCE.NS", "TCS.NS", ...],
  "invalid_tickers": ["INVALID.NS"],
  "data_quality": {
    "ipo_filtered": 2,
    "delisted_filtered": 1,
    "outliers_capped": 5,
    "completeness_pct": 98.5
  },
  "price_data_id": "abc123"
}
```

### POST /api/portfolio/optimize

**Request Body:**
```json
{
  "price_data_id": "abc123",
  "risk_appetite": "Moderate",
  "target_return": 0.15,
  "investment_horizon_years": 5,
  "initial_capital": 100000,
  "inflation_rate": 0.06,
  "diversification_pref": "Balanced",
  "transaction_cost_pct": 0.001,
  "optimization_mode": "max_sharpe",
  "rebalancing_freq": "Quarterly"
}
```

**Response:**
```json
{
  "status": "success",
  "weights": {"RELIANCE.NS": 0.15, "TCS.NS": 0.12, ...},
  "shares": {"RELIANCE.NS": 25, "TCS.NS": 18, ...},
  "portfolio_metrics": {
    "expected_return": 0.167,
    "volatility": 0.155,
    "sharpe_ratio": 1.83,
    "...": "..."
  },
  "transaction_costs": 1250.50,
  "cash_remaining": 2340.75
}
```

### GET /api/portfolio/simulate?portfolio_id={id}&num_paths=10000

**Response:**
```json
{
  "status": "success",
  "simulation_results": {
    "percentile_5": [100000, 102000, ...],
    "percentile_50": [100000, 108000, ...],
    "percentile_95": [100000, 115000, ...],
    "expected_value_at_horizon": 185000,
    "prob_target_return": 0.68
  }
}
```

### GET /api/portfolio/explain?portfolio_id={id}

**Response:**
```json
{
  "status": "success",
  "explanation": {
    "summary": "Your portfolio allocates 45% to IT and Banking sectors...",
    "stock_selection_rationale": "RELIANCE.NS was selected because...",
    "weight_logic": "Weights were determined by maximizing Sharpe ratio...",
    "risk_suitability": "This portfolio matches your Moderate risk appetite because..."
  }
}
```

---

## UI Components

### Design System (Matching Existing App)

**Colors:**
- Primary: `#00D09C` (Groww green)
- Text: `#44475B` (dark gray)
- Background: `#F8F9FA` (light gray in light mode), `#1a1a1a` (dark mode)
- Accent: `#0A0F29` (deep blue)

**Typography:**
- Font Family: Inter
- Headings: 600 weight
- Body: 400 weight

**Component Patterns:**

#### WizardStepper.tsx
```tsx
// Multi-step progress indicator
- Shows current stage (1-8)
- Completed stages: green checkmark
- Current stage: pulsing green circle
- Future stages: gray outline
```

#### ProgressLogger.tsx
```tsx
// Real-time log viewer
- Auto-scrolling log window
- Color-coded messages:
  - Info: white
  - Success: green
  - Warning: yellow
  - Error: red
- Timestamp for each log
```

#### InputCard.tsx
```tsx
// Reusable input container
- Card with shadow (matching existing DashboardCard)
- Label + tooltip (info icon)
- Input field (slider/dropdown/date picker)
- Validation error message area
```

#### MetricCard.tsx
```tsx
// Display single risk metric
- Metric name + tooltip
- Large value display
- Benchmark comparison (up/down arrow)
- Sparkline chart (trend)
```

#### ChartCard.tsx
```tsx
// Container for Recharts visualizations
- Title + download button
- Responsive chart area
- Legend with toggles
```

---

## Calculation Methods

### Return Estimation

#### Historical Average
```
R_i = mean(daily_returns_i) * 252
```

#### EWMA (Exponential Weighted Moving Average)
```
R_i(t) = λ * R_i(t-1) + (1-λ) * r_i(t)
λ = 0.94 (default)
```

#### CAPM (Capital Asset Pricing Model)
```
R_i = R_f + β_i * (R_m - R_f)
Where:
- R_f = risk-free rate (user input or 10Y bond)
- β_i = cov(R_i, R_m) / var(R_m)
- R_m = benchmark return
```

### Risk Estimation

#### Sample Covariance
```
Σ = (1/T) * Σ(r_t - μ)(r_t - μ)^T
```

#### Ledoit-Wolf Shrinkage
```
Σ_shrunk = δ * F + (1-δ) * Σ_sample
Where:
- F = target matrix (diagonal, equal variance)
- δ = shrinkage intensity (auto-calculated or 0.3)
```

### Constraint Mapping

#### Risk Appetite → Volatility
```
Conservative: σ_p ≤ 12%
Moderate: σ_p ≤ 18%
Aggressive: σ_p ≤ 30%
```

#### Diversification → Position Sizing
```
High: w_i ≤ 8%
Balanced: w_i ≤ 15%
Concentrated: w_i ≤ 30%
```

### Optimization Modes

#### Max Sharpe Ratio
```python
maximize (w^T μ - R_f) / sqrt(w^T Σ w)
subject to:
  sum(w) = 1
  w >= 0
  sector constraints
  position limits
```

#### Min Volatility
```python
minimize sqrt(w^T Σ w)
subject to:
  sum(w) = 1
  w >= 0
  w^T μ >= target_return
```

#### Risk Parity
```python
minimize Σ(RC_i - RC_target)^2
Where RC_i = w_i * (Σw)_i / sqrt(w^T Σ w)
```

#### Target Return
```python
minimize sqrt(w^T Σ w)
subject to:
  w^T μ >= target_return
  sum(w) = 1
  w >= 0
```

#### CVaR Minimization
```python
minimize CVaR_α(w)
subject to:
  sum(w) = 1
  w >= 0
  w^T μ >= target_return
```

### Share Calculation
```
shares_i = floor(w_i * initial_capital / price_i)
adjusted_weight_i = (shares_i * price_i) / total_invested
cash_remaining = initial_capital - Σ(shares_i * price_i) - transaction_costs
```

### Monte Carlo Simulation (GBM)
```
S_i(t+1) = S_i(t) * exp((μ_i - σ_i^2/2)*dt + σ_i*sqrt(dt)*Z_i)
Where:
- Z ~ N(0, Σ_cholesky)  # Correlated shocks
- dt = 1/252 (daily steps)
- T = investment_horizon_years * 252
```

---

## Data Flow

### Stage-by-Stage Data Pipeline

```
[User Inputs]
    ↓
[Frontend Validation]
    ↓
[POST /api/portfolio/ingest]
    ↓
[yfinance Data Fetch]
    ↓
[Quality Checks: IPO/Delisting/Outliers]
    ↓
[Store in Redis/Database with price_data_id]
    ↓
[Return price_data_id to Frontend]
    ↓
[POST /api/portfolio/optimize with price_data_id]
    ↓
[Return Estimation: Historical/EWMA/CAPM]
    ↓
[Risk Estimation: Covariance + Ledoit-Wolf]
    ↓
[Constraint Mapping: Risk Appetite → Math]
    ↓
[cvxpy Optimization: Solve for weights]
    ↓
[Share Calculation: Fractional → Integer]
    ↓
[Risk Metrics: 11 metrics + Benchmark]
    ↓
[Store portfolio with portfolio_id]
    ↓
[GET /api/portfolio/simulate?portfolio_id=X]
    ↓
[Monte Carlo: 10,000 GBM paths]
    ↓
[Calculate Percentiles + Probabilities]
    ↓
[GET /api/portfolio/explain?portfolio_id=X]
    ↓
[Generate Natural Language Summary]
    ↓
[Display Final Results Dashboard]
    ↓
[User Downloads PDF/JSON/CSV]
```

---

## Implementation Progress

### Completed Tasks
- [✅] Task 14: Created portfolio_agent_documentation.md
- [✅] Task 1: Create Portfolio Agent route and page structure
  - Created `/portfolio` route at `app/portfolio/page.tsx`
  - Built responsive page layout with header, progress tracker, and content area
  - Added Welcome stage with feature overview and benefits
  - Updated sidebar Portfolio button to navigate to `/portfolio` page
  - Removed old bottom sidebar implementation
  - Matched existing app theme (dark mode, Groww green #00D09C, Inter font)
- [ ] Task 2: Design multi-step user input flow UI
- [ ] Task 3: Build Step 1: Data Ingestion & Quality Checks
- [ ] Task 4: Build Step 2: Return & Risk Estimation
- [ ] Task 5: Build Step 3: Constraint Mapping
- [ ] Task 6: Build Step 4: Portfolio Optimization
- [ ] Task 7: Build Step 5: Share Calculation & Transaction Costs
- [ ] Task 8: Build Step 6: Risk Metrics & Benchmark Comparison
- [ ] Task 9: Build Step 7: Monte Carlo Simulation
- [ ] Task 10: Build Step 8: Natural Language Explanation
- [ ] Task 11: Build Final Results Page
- [ ] Task 12: Implement Backend API Endpoints
- [ ] Task 13: Add Download & Export Functionality
- [ ] Task 15: Add Error Handling & Loading States

### Current Sprint
**Focus:** Route creation and UI scaffolding (Tasks 1-2)

---

## Technical Decisions

### Why Dedicated Page Instead of Sidebar?
**Rationale:**
- Portfolio generation is complex (8 stages, 18 inputs)
- Sidebar too narrow for charts, tables, explanations
- Users need focused experience without distraction
- Full-page allows better step-by-step narrative
- Can leverage existing dashboard layout components

### Why Multi-Step Wizard?
**Rationale:**
- Breaks down complexity into digestible chunks
- Provides clear sense of progress
- Allows validation at each step before proceeding
- Educational: explains each calculation stage
- Prevents overwhelming users with all inputs at once

### Why Real-Time Progress Logs?
**Rationale:**
- Transparency builds trust (users see what's happening)
- Educational value (learn about data validation, optimization)
- Debugging: users can report specific errors
- Engagement: prevents "black box" anxiety during long computations

### Why cvxpy Over Manual Implementation?
**Rationale:**
- Industry-standard convex optimization library
- Supports multiple solvers (ECOS, SCS, MOSEK)
- Handles complex constraints elegantly
- Well-tested, numerically stable
- Future-proof (can add new optimization modes easily)

### Why Ledoit-Wolf Shrinkage?
**Rationale:**
- Addresses covariance estimation error with limited data
- Automatic shrinkage intensity calculation
- Improves out-of-sample portfolio performance
- Standard in quantitative finance

### Why Monte Carlo Over Analytical Approach?
**Rationale:**
- GBM captures realistic price dynamics
- Correlated simulations (Cholesky) preserve portfolio structure
- Probability cone intuitive for users
- Flexible: can add jumps, regime switches later

---

## Testing Strategy

### Unit Tests
- [ ] Input validation (18 parameters)
- [ ] Return estimation functions (Historical/EWMA/CAPM)
- [ ] Covariance matrix calculations
- [ ] Constraint mapping logic
- [ ] Share rounding with transaction costs
- [ ] Risk metrics calculations (11 metrics)
- [ ] Monte Carlo GBM simulation

### Integration Tests
- [ ] Full pipeline: inputs → optimization → results
- [ ] API endpoints (ingest, optimize, simulate, explain)
- [ ] Database: store/retrieve price data and portfolios
- [ ] Error handling: invalid inputs, API failures, solver errors

### UI Tests
- [ ] Wizard navigation (forward/backward)
- [ ] Input validation error messages
- [ ] Progress log updates in real-time
- [ ] Chart rendering (allocation pie, Monte Carlo cone)
- [ ] Download functionality (PDF, JSON, CSV)

### Performance Tests
- [ ] Optimization time: <30s for 50 stocks
- [ ] Monte Carlo: 10,000 paths in <60s
- [ ] PDF generation: <10s
- [ ] API response time: <5s (excluding computation)

### Edge Cases
- [ ] No valid stocks after filtering
- [ ] Infeasible optimization (conflicting constraints)
- [ ] Missing price data (delisted stocks)
- [ ] Extreme parameters (target return > 100%)
- [ ] Zero cash remaining after share purchase

---

## Changelog

### [1.0.0] - 2025-11-21

#### Added
- Initial documentation structure
- Complete user journey map (8 stages, 17 steps)
- Architecture design (frontend/backend file structure)
- API specifications (4 endpoints with schemas)
- UI component patterns (7 components)
- Calculation methods (return, risk, optimization, Monte Carlo)
- Data flow pipeline diagram
- Task tracking (15 tasks)
- Technical decision rationale
- Testing strategy (unit, integration, UI, performance)

#### Status
- Documentation: Complete
- Implementation: 0/15 tasks completed
- Next Step: Create `/portfolio` route and page structure

---

## Notes & Open Questions

### Design Decisions Needed
1. **Wizard State Management**: Use React Context or URL params for step persistence?
2. **Progress Updates**: WebSocket vs Server-Sent Events vs polling?
3. **PDF Library**: reportlab (backend) vs jsPDF (frontend)?
4. **Caching Strategy**: Redis vs in-memory vs database for price_data_id?

### Future Enhancements (Post-MVP)
- [ ] Backtesting: Show historical performance of generated portfolio
- [ ] Rebalancing Simulation: What-if analysis for rebalancing
- [ ] Tax Optimization: Factor in capital gains tax
- [ ] Sector Rotation: Dynamic sector weights based on momentum
- [ ] ESG Scoring: Filter stocks by environmental/social criteria
- [ ] Custom Constraints: Allow users to add "no more than 20% in single sector"
- [ ] Portfolio Comparison: Compare multiple portfolios side-by-side

---

**End of Documentation** (Will auto-update as tasks complete)
