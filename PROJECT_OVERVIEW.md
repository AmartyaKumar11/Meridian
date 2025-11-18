# Meridian Dashboard - Complete Project Overview

**Version:** 0.1.0  
**Last Updated:** November 18, 2025  
**Status:** Development (Feature-Complete for MVP)

---

## 📋 Table of Contents

1. [Project Vision](#project-vision)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Features Implemented](#features-implemented)
5. [Directory Structure](#directory-structure)
6. [Setup & Installation](#setup--installation)
7. [Running the Application](#running-the-application)
8. [Feature Deep Dive](#feature-deep-dive)
9. [API Documentation](#api-documentation)
10. [Database Schema](#database-schema)
11. [Development Workflow](#development-workflow)
12. [Known Issues](#known-issues)
13. [Roadmap](#roadmap)

---

## 🎯 Project Vision

**Meridian Dashboard** is a modern, Groww-inspired investment analytics platform that combines real-time stock trading capabilities with AI-powered news sentiment analysis. The platform enables investors to make data-driven decisions by visualizing stock price movements alongside news events that may have impacted those movements.

### Key Objectives:
- Provide professional-grade charting with 60+ technical indicators
- Integrate news sentiment analysis with stock price correlation
- Offer portfolio generation tools based on historical data
- Enable interactive date selection for backtesting strategies
- Deliver a seamless, responsive UI for both desktop and mobile

---

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 16.0.1 (App Router)
- **React:** v19.2.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4
- **Charting:** Lightweight Charts v4.2.3 (TradingView)
- **Icons:** Lucide React v0.548.0
- **Authentication:** NextAuth v4.24.12
- **Caching:** Redis (in-memory stock cache)

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Search Engine:** Elasticsearch 8.x
- **Cache:** Redis 5.0+
- **Data Processing:** Pandas, NumPy
- **ML/NLP:** 
  - FinBERT (ProsusAI/finbert) - Sentiment Analysis
  - spaCy - Named Entity Recognition
  - Transformers, PyTorch
- **Stock Data:** yfinance, Yahoo Finance API, Finnhub API

### Infrastructure
- **Database:** Elasticsearch (10,985+ news articles indexed)
- **Message Queue:** Redis (caching layer)
- **Environment:** Windows with WSL2 support

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MERIDIAN DASHBOARD                        │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐        ┌─────▼─────┐      ┌─────▼──────┐
   │  Next.js │        │  FastAPI  │      │Elasticsearch│
   │ Frontend │◄──────►│  Backend  │◄─────┤ News Index │
   └─────────┘        └───────────┘      └────────────┘
        │                   │
        │              ┌────▼─────┐
        │              │  Redis   │
        │              │  Cache   │
        │              └──────────┘
        │
   ┌────▼────────┐
   │ TradingView │
   │   Charts    │
   └─────────────┘
        │
        ├─► Yahoo Finance API (Indian Stocks)
        └─► Finnhub API (US Stocks)
```

### Data Flow

1. **News Ingestion Pipeline:**
   ```
   GDELT API → FinBERT Sentiment → Elasticsearch → Redis Cache → FastAPI → Frontend
   ```

2. **Stock Data Flow:**
   ```
   Yahoo Finance / Finnhub → Next.js Proxy → TradingChart Component → Lightweight Charts
   ```

3. **News Marker Rendering:**
   ```
   User Selects Stock → Fetch News Events (Redis Cache) → Map to Chart Timestamps → Render Markers with Tooltips
   ```

---

## ✅ Features Implemented

### 1. Trading Terminal (`/terminal`)
- **Advanced Charting:**
  - 60+ technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands, etc.)
  - 10+ chart types (Candlestick, Line, Area, Heikin Ashi, Renko, etc.)
  - Multi-pane indicator layout (separate panes for oscillators)
  - Real-time OHLC data display
  - Interval selection (1d, 5d, 1m, 3m, 1y, 5y, 10y)
  - Historical data loading (infinite scroll)
  - Auto-refresh every 30 seconds

- **News Event Integration:**
  - News markers on chart (sentiment-based colors)
  - Hover tooltips showing:
    - Event title
    - Sentiment (positive/negative/neutral)
    - Impact score
    - Price change percentage
    - Source domain and date
  - Optional: Click to open article (if URL available)

- **Portfolio Date Selection:**
  - Click on chart to select start date
  - Click again to select end date
  - Visual highlight overlay on selected range
  - Pass dates to Portfolio Generator sidebar

- **Watchlist & Indices:**
  - NIFTY 50 stocks (collapsible by sector)
  - Indian indices (^NSEI, ^NSEBANK, ^CNXFIN, etc.)
  - Search functionality
  - Click to switch stock
  - Persistent selection (localStorage)

- **Portfolio Generator Sidebar:**
  - Resizable height (drag to adjust)
  - Manual or chart-based date selection
  - Risk appetite selection
  - Target return customization
  - Sector inclusion/exclusion
  - Initial capital and inflation inputs

### 2. Dashboard (`/dashboard`)
- **Market Overview:**
  - Top gainers/losers
  - Sector performance
  - Stocks in news today
  - Trending stocks

- **Quick Actions:**
  - Explore Mutual Funds
  - Start SIP
  - Buy IPO
  - Futures & Options

### 3. Mutual Funds (`/mutual-funds`)
- Category filtering
- Performance metrics
- SIP calculator
- Fund comparison

### 4. Futures & Options (`/fo`)
- Options chain (coming soon)
- Open interest analysis (coming soon)
- Strategy builder (coming soon)

### 5. News Analytics Backend
- **FastAPI Endpoints:**
  - `GET /api/health` - System health check
  - `GET /api/companies` - List all companies with sentiment stats
  - `GET /api/news/{company}` - Get news articles
  - `GET /api/sentiment/{company}` - Sentiment timeline
  - `GET /api/impact-events/{company}` - High-impact events
  - `GET /api/chart-events/{company}` - Optimized for chart markers (Redis cached)
  - `GET /api/cache/stats` - Cache performance metrics

- **News Ingestion Pipeline:**
  - GDELT API integration (5 years of historical data)
  - FinBERT sentiment analysis
  - Multi-language support (English, Hindi, Marathi)
  - Price correlation (optional)
  - Impact score calculation
  - Bulk Elasticsearch indexing

---

## 📁 Directory Structure

```
meridian-dashboard/
├── app/                          # Next.js app directory
│   ├── api/                      # Next.js API routes
│   │   └── yahoo-finance/        # Proxy for Yahoo Finance (CORS bypass)
│   ├── components/               # React components
│   │   ├── TradingChart.tsx      # Main chart component (2000+ lines)
│   │   ├── IndicatorPane.tsx     # Separate indicator panes
│   │   ├── AuthModal.tsx         # Login/signup modal
│   │   └── PageTransition.tsx    # Page animations
│   ├── context/                  # React context providers
│   │   └── ThemeContext.tsx      # Dark/light theme
│   ├── utils/                    # Utility functions
│   │   └── stockToCompanyMapping.ts  # Symbol → Company name mapping
│   ├── terminal/                 # Trading terminal page
│   ├── dashboard/                # Dashboard page
│   ├── mutual-funds/             # Mutual funds page
│   ├── fo/                       # F&O page
│   └── layout.tsx                # Root layout
│
├── backend/                      # Python FastAPI backend
│   ├── api/
│   │   └── main.py               # FastAPI app (600+ lines)
│   ├── cache/
│   │   └── redis_client.py       # Redis cache management
│   ├── ingestion/                # Data ingestion pipeline
│   │   ├── news_ingestor.py      # GDELT + FinBERT
│   │   ├── elastic_client.py     # Elasticsearch utilities
│   │   ├── stock_data.py         # Stock price fetching
│   │   ├── enrich.py             # News enrichment (NER, metrics)
│   │   └── es_loader.py          # Bulk indexing
│   ├── run_pipeline.py           # Pipeline orchestrator
│   ├── calculate_impact_scores.py  # Impact score calculation
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables
│   └── docker-compose.yml        # Elasticsearch + Redis setup
│
├── lib/                          # Next.js utilities
│   └── redis.ts                  # Redis client (Node.js)
│
├── public/                       # Static assets
├── .github/
│   └── copilot-instructions.md   # Development guidelines
├── package.json                  # Node dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.ts                # Next.js config
└── README.md                     # Quick start guide
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 20.x or higher
- Python 3.11 or higher
- Docker Desktop (for Elasticsearch & Redis)
- WSL2 (Windows users, optional but recommended)

### 1. Clone Repository
```bash
git clone https://github.com/AmartyaKumar11/Meridian.git
cd Meridian/dashboard
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Create environment file
cp .env.example .env

# Edit .env with your credentials
ES_HOST=localhost
ES_PORT=9200
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_ENABLED=true
```

### 4. Start Infrastructure
```bash
# Start Elasticsearch and Redis
cd backend
docker-compose up -d

# Verify Elasticsearch
curl http://localhost:9200/_cluster/health

# Verify Redis
redis-cli ping  # Should respond: PONG
```

### 5. Load Initial Data (Optional)
```bash
# Fetch news for NIFTY 50 companies (last 5 years)
python run_pipeline.py --companies nifty50 --start_date 20201101 --end_date 20251118

# Or fetch for specific companies
python run_pipeline.py --companies "Reliance Industries,TCS" --start_date 20241001 --end_date 20241118

# Calculate impact scores (if price data available)
python calculate_impact_scores.py
```

---

## 🏃 Running the Application

### Start Frontend (Terminal 1)
```bash
cd dashboard
npm run dev
```
Access at: http://localhost:3000

### Start Backend (Terminal 2)
```bash
cd backend
.venv\Scripts\activate  # Windows
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```
Access API docs at: http://localhost:8000/docs

### Verify Everything Works
1. Open http://localhost:3000/terminal
2. Select a stock from watchlist (e.g., RELIANCE.NS)
3. Chart should load with candlesticks
4. If backend is running and has data, news markers will appear
5. Hover over markers to see tooltips

---

## 🔍 Feature Deep Dive

### TradingChart Component

**Location:** `app/components/TradingChart.tsx`  
**Lines of Code:** 2100+  
**Complexity:** High (handles chart rendering, data fetching, indicators, news markers)

**Key Responsibilities:**
1. **Data Fetching:**
   - Yahoo Finance API for Indian stocks (.NS, ^NSE, ^CNX symbols)
   - Finnhub API for US stocks
   - Proxied through Next.js API route to avoid CORS
   - Handles different intervals (5m, 15m, 1h, 1d, 1w, 1mo)

2. **Chart Rendering:**
   - Uses TradingView's Lightweight Charts library
   - Supports 10+ chart types with dynamic switching
   - Auto-resizes on window resize
   - Preserves zoom/pan on data refresh

3. **Technical Indicators:**
   - Overlay indicators (SMA, EMA, Bollinger Bands, etc.)
   - Separate pane indicators (RSI, MACD, Volume, etc.)
   - Dynamic calculation based on chart data
   - Color-coded for easy identification

4. **News Integration:**
   - Fetches news events from FastAPI backend
   - Maps timestamps to chart coordinates
   - Renders markers with sentiment colors:
     - Green (positive sentiment)
     - Red (negative sentiment)
     - Gray (neutral sentiment)
   - Displays tooltips on hover with:
     - Event title
     - Sentiment label and score
     - Impact score
     - Price change percentage
     - Source and date

5. **Date Selection:**
   - Click on chart to select start date
   - Click again to select end date
   - Visual highlight overlay
   - Passes dates to Portfolio Generator

6. **Historical Data Loading:**
   - Infinite scroll (loads more when scrolling left)
   - Appends data without resetting zoom
   - Prevents duplicate data points

### News Analytics Pipeline

**Location:** `backend/`  
**Components:**
1. **news_ingestor.py** - GDELT fetching + FinBERT sentiment
2. **enrich.py** - NER, price correlation, metrics
3. **es_loader.py** - Bulk Elasticsearch indexing
4. **run_pipeline.py** - Orchestrates entire flow

**How It Works:**

```python
# 1. Fetch news from GDELT
news_df = fetch_gdelt_news(
    company="Reliance Industries",
    start_date="20240101",
    end_date="20240131",
    max_records=250
)

# 2. Analyze sentiment with FinBERT
for article in news_df:
    sentiment_label, sentiment_score = get_sentiment_finbert(article.title)
    article.sentiment_label = sentiment_label
    article.sentiment_score = sentiment_score

# 3. Enrich with stock prices (optional)
price_df = fetch_stock_prices("RELIANCE.NS", "2024-01-01", "2024-01-31")
enriched_df = enrich_news_with_price(news_df, price_df)

# 4. Calculate impact scores
for event in enriched_df:
    impact_score = sentiment_score * abs(price_change_pct) / 10.0
    event.impact_score = impact_score

# 5. Bulk index to Elasticsearch
bulk_index_to_es(enriched_df, index="stock_news")
```

**Current Data Status:**
- 10,985 news articles indexed
- 46 NIFTY 50 companies covered
- Date range: Nov 2020 - Nov 2025 (5 years)
- Languages: English, Hindi, Marathi, Tamil, Telugu

### Redis Caching Strategy

**Location:** `backend/cache/redis_client.py`, `lib/redis.ts`

**Backend Caching:**
- Caches chart events for 1 hour (TTL: 3600s)
- Cache key format: `stock_events:{company_name}`
- Graceful degradation (falls back to Elasticsearch if Redis unavailable)
- Manual invalidation via API: `POST /api/cache/invalidate/{company}`

**Frontend Caching:**
- In-memory cache for stock data (5 min TTL)
- Reduces Yahoo Finance API calls
- Cache key format: `{symbol}:{period1}:{period2}:{interval}`

**Performance Impact:**
- Before: 500-1000ms per chart load (Elasticsearch query)
- After: 5-10ms per chart load (Redis lookup)
- 100x improvement for hover tooltips (2-5ms vs 300-500ms)

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "elasticsearch": "connected",
  "redis": "connected",
  "timestamp": "2025-11-18T10:30:00Z"
}
```

#### 2. Get All Companies
```http
GET /api/companies
```
**Response:**
```json
[
  {
    "name": "Reliance Industries",
    "article_count": 250,
    "avg_sentiment": 0.62,
    "latest_date": "2025-11-18T08:00:00Z"
  }
]
```

#### 3. Get News Articles
```http
GET /api/news/{company}?limit=50&offset=0&sentiment=positive
```
**Parameters:**
- `company` (required): Company name
- `limit` (optional): Number of articles (default: 50, max: 500)
- `offset` (optional): Pagination offset (default: 0)
- `sentiment` (optional): Filter by positive/negative/neutral
- `start_date` (optional): Start date (ISO format)
- `end_date` (optional): End date (ISO format)

**Response:**
```json
{
  "company": "Reliance Industries",
  "total": 250,
  "articles": [
    {
      "title": "Reliance Q3 results exceed expectations",
      "url": "https://...",
      "seendate": "2025-01-15T10:30:00Z",
      "sentiment_label": "positive",
      "sentiment_score": 0.85,
      "domain": "moneycontrol.com"
    }
  ]
}
```

#### 4. Get Chart Events (Cached)
```http
GET /api/chart-events/{company}?min_impact_score=0.0
```
**Parameters:**
- `company` (required): Company name
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date
- `min_impact_score` (optional): Minimum impact score (default: 0.0)

**Response:**
```json
{
  "company": "Reliance Industries",
  "total_events": 45,
  "events": [
    {
      "timestamp": "2024-01-15T10:30:00",
      "title": "Reliance announces Q3 results...",
      "sentiment_label": "positive",
      "sentiment_score": 0.85,
      "impact_score": 0.72,
      "price_change_pct": 2.3,
      "url": "https://...",
      "domain": "moneycontrol.com"
    }
  ],
  "cached": true
}
```

#### 5. Get Sentiment Timeline
```http
GET /api/sentiment/{company}?interval=1w
```
**Parameters:**
- `company` (required): Company name
- `interval` (optional): 1d, 1w, 1M (default: 1w)
- `start_date` (optional): Start date
- `end_date` (optional): End date

**Response:**
```json
{
  "company": "Reliance Industries",
  "interval": "1w",
  "timeline": [
    {
      "date": "2025-01-01",
      "avg_sentiment": 0.65,
      "article_count": 12
    }
  ]
}
```

#### 6. Cache Statistics
```http
GET /api/cache/stats
```
**Response:**
```json
{
  "enabled": true,
  "total_keys": 50,
  "memory_used": "2.3 MB",
  "connected": true
}
```

---

## 🗄 Database Schema

### Elasticsearch Index: `stock_news`

```json
{
  "mappings": {
    "properties": {
      "title": { "type": "text", "analyzer": "english" },
      "url": { "type": "keyword" },
      "company": { "type": "keyword" },
      "seendate": { "type": "date" },
      "sourceCountry": { "type": "keyword" },
      "domain": { "type": "keyword" },
      "language": { "type": "keyword" },
      "fetched_at": { "type": "date" },
      "sentiment_label": { "type": "keyword" },
      "sentiment_score": { "type": "float" },
      "summary": { "type": "text" },
      "keywords": { "type": "keyword" },
      "related_entities": { "type": "keyword" },
      "price_before": { "type": "float" },
      "price_after": { "type": "float" },
      "price_change_pct": { "type": "float" },
      "volume_before": { "type": "long" },
      "volume_after": { "type": "long" },
      "impact_score": { "type": "float" }
    }
  }
}
```

**Sample Document:**
```json
{
  "title": "Reliance Industries announces record Q3 profit",
  "url": "https://www.moneycontrol.com/news/...",
  "company": "Reliance Industries",
  "seendate": "2024-01-15T10:30:00Z",
  "sourceCountry": "IN",
  "domain": "moneycontrol.com",
  "language": "en",
  "fetched_at": "2024-01-15T11:00:00Z",
  "sentiment_label": "positive",
  "sentiment_score": 0.85,
  "summary": "Reliance Industries reported...",
  "keywords": ["earnings", "profit", "Q3"],
  "related_entities": ["Mukesh Ambani", "Jio", "RIL"],
  "price_before": 2450.50,
  "price_after": 2506.85,
  "price_change_pct": 2.30,
  "volume_before": 5200000,
  "volume_after": 7800000,
  "impact_score": 0.72
}
```

---

## 🔧 Development Workflow

### Adding a New Feature

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Update Code**
   - Frontend: Add component in `app/components/`
   - Backend: Add endpoint in `backend/api/main.py`
   - Tests: Add tests (if applicable)

3. **Test Locally**
   ```bash
   # Frontend
   npm run dev

   # Backend
   uvicorn api.main:app --reload
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Review changes
   - Ensure no breaking changes
   - Merge to main

### Code Style Guidelines

**Frontend (TypeScript):**
- No emojis in UI code (use icons from lucide-react)
- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Follow Tailwind CSS utility-first approach
- Keep components under 500 lines (extract sub-components if needed)

**Backend (Python):**
- Follow PEP 8 style guide
- Use type hints for function parameters and returns
- Add docstrings for all functions
- Keep functions under 50 lines
- Use logging instead of print statements

---

## 🐛 Known Issues

### Frontend
1. **Hydration Warning on Stock Selection**
   - **Issue:** Console warning about server/client mismatch
   - **Status:** Fixed (using two-step render with mounted state)
   - **Impact:** None (cosmetic)

2. **Chart Data Loading Delay**
   - **Issue:** First chart load can take 2-3 seconds
   - **Cause:** Yahoo Finance API rate limiting
   - **Workaround:** Subsequent loads are cached (fast)

3. **News Markers Not Showing**
   - **Issue:** Markers don't appear if backend is not running
   - **Status:** Expected behavior (graceful degradation)
   - **Solution:** Start backend with `uvicorn api.main:app`

### Backend
1. **Elasticsearch Version Compatibility**
   - **Issue:** ES 7.x queries don't work with ES 8.x
   - **Status:** Fixed (updated to ES 8.x syntax)
   - **Impact:** None

2. **Redis Connection Errors Spam**
   - **Issue:** Console spam if Redis is not running
   - **Status:** Fixed (graceful fallback with debug logs)
   - **Impact:** None

3. **Symbol to Company Name Mapping**
   - **Issue:** Some symbols don't have company mappings
   - **Status:** Partial (manual mapping in `stockToCompanyMapping.ts`)
   - **Solution:** Add missing mappings as needed

---

## 🗺 Roadmap

### Short-term (Next 2 Weeks)
- [ ] Add click handler to news markers (open article in new tab)
- [ ] Implement marker animations (fade-in, pulse on hover)
- [ ] Add news sidebar panel (list of events for selected stock)
- [ ] Improve mobile responsiveness for terminal page
- [ ] Add more chart drawing tools (trendlines, shapes)

### Mid-term (1-2 Months)
- [ ] Portfolio optimization algorithm
- [ ] Backtest engine for strategies
- [ ] Real-time WebSocket updates for stock prices
- [ ] User authentication and personalized watchlists
- [ ] Export portfolio to PDF/Excel
- [ ] AI-powered stock recommendations

### Long-term (3-6 Months)
- [ ] Futures & Options chain analysis
- [ ] Options strategy builder (Iron Condor, Butterfly, etc.)
- [ ] Sentiment heatmap visualization
- [ ] Multi-stock comparison view
- [ ] Integration with broker APIs (Zerodha Kite, Upstox, etc.)
- [ ] Push notifications for high-impact news
- [ ] Mobile app (React Native)

---

## 📚 Additional Documentation

- [Backend API Documentation](backend/API_DOCUMENTATION.md) - Detailed API reference
- [Redis Cache Guide](backend/REDIS_CACHE_GUIDE.md) - Caching implementation guide
- [Data Consistency Fixes](backend/DATA_CONSISTENCY_FIXES.md) - Data issues and resolutions
- [Copilot Instructions](.github/copilot-instructions.md) - Development guidelines

---

## 📞 Support & Contact

- **Repository:** https://github.com/AmartyaKumar11/Meridian
- **Issues:** https://github.com/AmartyaKumar11/Meridian/issues
- **Discussions:** https://github.com/AmartyaKumar11/Meridian/discussions

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

**Last Updated:** November 18, 2025  
**Maintainer:** AmartyaKumar11  
**Status:** Active Development
