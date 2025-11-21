# Meridian Dashboard - Frontend Overview

## 🏗️ Project Architecture

### Technology Stack
- **Framework**: Next.js 16.0.1 (App Router with Turbopack)
- **React**: 19.2.0
- **Styling**: Tailwind CSS with dark mode support
- **Charts**: lightweight-charts (TradingView)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js App Router

---

## 📁 File Structure

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
│
├── components/
│   ├── Navbar.tsx             # Main navigation bar
│   ├── Hero.tsx               # Landing page hero section
│   ├── AuthModal.tsx          # Login/Signup modal
│   ├── Footer.tsx             # Footer component
│   ├── PageTransition.tsx     # Page transition animations
│   ├── ClientLayout.tsx       # Client-side layout wrapper
│   ├── TradingChart.tsx       # Main chart component (2289 lines)
│   ├── NewsToast.tsx          # News events popup/toast
│   └── IndicatorPane.tsx      # Technical indicators panel
│
├── context/
│   └── ThemeContext.tsx       # Dark/Light theme provider
│
├── utils/
│   └── stockToCompanyMapping.ts  # Ticker to company name mapping
│
├── dashboard/
│   └── page.tsx               # Main dashboard (697 lines)
│
├── terminal/
│   └── page.tsx               # Trading terminal (1528 lines)
│
├── mutual-funds/
│   └── page.tsx               # Mutual funds page
│
└── fo/
    └── page.tsx               # Futures & Options page
```

---

## 🎯 Pages & Features

### 1. **Landing Page** (`app/page.tsx`)
- Clean landing interface
- Hero section with CTA
- Authentication modal integration
- Theme toggle support

### 2. **Dashboard** (`app/dashboard/page.tsx`)
**Key Features:**
- Stock overview cards
- Quick stats (trending up/down stocks)
- Sector performance
- Watchlist summary
- Top gainers/losers
- Market indices display
- Profile dropdown with settings

**UI Components:**
- Navigation bar with search
- Market indices ticker
- Terminal quick access button
- Theme toggle
- Notification bell
- Profile menu

### 3. **Trading Terminal** (`app/terminal/page.tsx`) ⭐ MAIN FEATURE
**Comprehensive trading interface with:**

#### Chart Features
- **Chart Types**: 13 types including:
  - Candlestick (default)
  - Bars, Hollow Candles, Columns
  - Line, Area, Baseline
  - High-Low, Heikin Ashi
  - Renko, Line Break, Kagi
  - Point & Figure

- **Time Intervals**: 
  - Long-term: 5y, 1y, 3m, 1m
  - Short-term: 5d, 1d
  - Intraday: 5m, 15m, 1h

#### Technical Indicators (25 indicators)
**Trend Indicators:**
- Moving Averages (5, 20, 50, 200)
- Exponential Moving Averages (20, 50, 200)
- Parabolic SAR
- Ichimoku Cloud

**Momentum Indicators:**
- RSI (Relative Strength Index)
- MACD
- Stochastic Oscillator
- CCI (Commodity Channel Index)
- Momentum Indicator
- Williams %R
- ROC (Rate of Change)

**Volatility Indicators:**
- Bollinger Bands
- ATR (Average True Range)

**Volume Indicators:**
- Volume
- OBV (On-Balance Volume)
- CMF (Chaikin Money Flow)
- ADL (Accumulation/Distribution Line)
- VWAP

**Support/Resistance:**
- Fibonacci Retracement
- Pivot Points

#### Drawing Tools (Left Sidebar)
**Categories:**
- Cursors & Selection
- Trend Lines
- Geometric Shapes
- Text & Annotations
- Fibonacci Tools
- Advanced Patterns

**Specific Tools:**
- Cursor, Crosshair
- Trend Line, Ray, Extended Line
- Horizontal Line, Vertical Line
- Rectangle, Circle, Triangle
- Brush, Highlighter
- Text, Notes
- Fibonacci Retracement/Extension
- Pitchfork, Gann Fan

#### News Integration 🆕
- **News Events Display**: Markers on chart at news timestamps
- **News Tooltips**: Hover to see news details
- **NewsToast Component**: Floating panel with:
  - Event filtering (All, Positive, Negative, Neutral)
  - Sentiment scores (FinBERT-based)
  - Impact scores
  - Price change percentages
  - Direct links to articles
  - Source domain display
  - Timestamp formatting

#### Insights Mode 🆕
- **Lightbulb Button**: Toggle news insights mode
- **Period Selection**: Click chart to select start/end dates
- **Crosshair Selection**: Use crosshair to pick time ranges
- **Visual Feedback**: Highlighted periods
- **State Management**: 
  - `insightsMode` toggle
  - `insightsStartDate` & `insightsEndDate` tracking

#### Portfolio Generator 💼
**Bottom Resizable Sidebar with:**
- Date Selection (Manual or Chart-based)
- Target Return slider (%)
- Risk Appetite selector
- Investment Horizon
- Initial Capital input
- Inflation rate adjustment
- Sector inclusion/exclusion filters

**Sectors Available:**
- Technology, Finance, Healthcare
- Energy, Manufacturing, Retail
- Telecom, Automotive, Pharma
- FMCG, Infrastructure, etc.

#### Watchlist (Right Sidebar)
**Features:**
- 49 Nifty 50 stocks pre-loaded
- Real-time price updates (simulated)
- Color-coded gains/losses
- Quick stock switching
- Collapsible panel
- Search functionality
- Add/Remove stocks

**Pre-loaded Stocks:**
- Major Indices (Nifty 50, Bank Nifty, Nifty IT, etc.)
- All Nifty 50 constituents with live prices

#### OHLC Display
- Real-time Open, High, Low, Close values
- Percentage change display
- Color-coded (green for bullish, red for bearish)
- Top-left chart overlay

#### UI Controls
**Top Toolbar:**
- Chart style selector
- Drawing tools menu
- Technical indicators dropdown
- Undo/Redo buttons
- Timeframe selector
- Buy/Sell buttons
- Insights button (Lightbulb)
- Settings, Screenshot, Share buttons

**Bottom Timeline:**
- Interval switcher (5y, 1y, 3m, 1m, 5d, 1d)

**Right Panel Icons:**
- Watchlist toggle
- Portfolio Generator
- Orders
- Positions
- Alerts
- Settings

### 4. **Mutual Funds** (`app/mutual-funds/page.tsx`)
- Mutual funds listing
- Fund performance charts
- Category filters
- Investment calculator

### 5. **Futures & Options** (`app/fo/page.tsx`)
- F&O contracts listing
- Options chain
- Strike price calculator
- Greeks display

---

## 🧩 Components Deep Dive

### TradingChart Component (`components/TradingChart.tsx`)
**Props:**
```typescript
interface TradingChartProps {
  symbol: string;
  interval: string;
  chartType: string;
  onCrosshairMove?: (data: any) => void;
  activeIndicators?: string[];
  onChartClick?: (timestamp: number) => void;
  onChartRightClick?: () => void;
  chartDateSelectionMode?: boolean;
  selectedStartDate?: number | null;
  selectedEndDate?: number | null;
  refreshTrigger?: number;
}
```

**Key Features:**
- Chart rendering with lightweight-charts
- Multi-pane support for separate indicators
- News markers overlay
- Crosshair hover detection
- Click/right-click handlers
- Data validation and sorting
- Infinite scroll (load more historical data)
- Theme-aware styling
- Responsive layout

**Technical Calculations:**
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- Volume analysis
- ATR, OBV, ROC, Stochastic, etc.

### NewsToast Component (`components/NewsToast.tsx`)
**Props:**
```typescript
interface NewsToastProps {
  events: NewsEvent[];
  position: { x: number; y: number };
  onClose: () => void;
}
```

**Features:**
- Filter by sentiment (All, Positive, Negative, Neutral)
- Event count badges
- Sentiment color coding
- Impact score display
- Price change metrics
- External link to articles
- Responsive positioning
- Dark mode support

---

## 🎨 Design System

### Color Palette
**Light Mode:**
- Primary Green: `#00D09C` (Groww-inspired)
- Background: `#F8F9FA`
- Text: `#44475B`
- Secondary Text: `#7C7E8C`
- Borders: `#E0E0E0`

**Dark Mode:**
- Background: `#0C0E12`
- Card Background: `#1A1D24`
- Secondary BG: `#131722`
- Text: `#FFFFFF`
- Secondary Text: `#7C7E8C`
- Borders: `#2A2E39`

**Chart Colors:**
- Bullish (Green): `#00D09C`
- Bearish (Red): `#EB4D5C`

### Typography
- **Font Family**: Inter (system fallback)
- **Sizes**: 
  - xs: 10px-11px (labels, metadata)
  - sm: 12px-13px (body text)
  - base: 14px-15px (headings)
  - lg: 16px-18px (page titles)

### Spacing
- Compact: 1-2 spacing units (4-8px)
- Standard: 3-4 spacing units (12-16px)
- Generous: 6-8 spacing units (24-32px)

---

## 🔄 State Management

### Local Storage Persistence
- **Selected Stock**: Auto-saves current stock selection
- **Theme Preference**: Persists dark/light mode choice

### Component State (Terminal)
```typescript
// Chart controls
selectedStock: string
selectedInterval: string
selectedChartType: string

// UI toggles
isWatchlistOpen: boolean
isPortfolioSidebarOpen: boolean
insightsMode: boolean

// Drawing tools
activeLeftTool: string
showToolsMenu: boolean

// Indicators
activeIndicators: string[]
showIndicatorsMenu: boolean

// News insights
insightsStartDate: number | null
insightsEndDate: number | null

// Portfolio generator
portfolioStartDate: string
portfolioEndDate: string
targetReturn: number
riskAppetite: string
```

---

## 🔌 API Integration

### Backend Endpoints Used
```
GET /api/stock-data/{symbol}?interval={interval}
  → Fetches OHLC data for chart

GET /api/chart-events/{company}
  → Fetches news events for company

GET /api/portfolio/generate
  → Generates optimized portfolio
```

### Data Flow
1. User selects stock → Fetch OHLC data
2. Chart renders → Apply technical indicators
3. Fetch news events → Display markers
4. User hovers marker → Show NewsToast
5. User selects period (Insights) → Filter relevant news

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (Basic watchlist, simplified chart)
- **Tablet**: 640px - 1024px (Collapsible sidebars)
- **Desktop**: > 1024px (Full terminal layout)

### Mobile Optimizations
- Collapsible sidebars
- Touch-friendly controls
- Simplified toolbars
- Bottom sheet for portfolio generator

---

## 🚀 Performance Optimizations

### Chart Performance
- Data validation and deduplication
- Efficient indicator calculations
- Lazy loading of historical data
- Debounced crosshair events
- Ref-based chart instance management

### Rendering
- Component memoization opportunities
- Conditional rendering for modals
- Virtual scrolling in watchlist
- CSS transitions over JS animations

---

## 🎯 User Workflows

### Stock Analysis Workflow
1. Select stock from watchlist
2. Choose time interval
3. Apply technical indicators
4. Draw trend lines/patterns
5. Review news events
6. Make trading decision

### News Insights Workflow
1. Click Lightbulb button (activate Insights Mode)
2. Click chart to select start date
3. Click again to select end date
4. View filtered news in highlighted period
5. Analyze sentiment and impact
6. Toggle off Insights Mode

### Portfolio Generation Workflow
1. Open Portfolio Generator sidebar
2. Set date range (manual or chart-based)
3. Configure risk parameters
4. Select sectors
5. Generate portfolio
6. Review allocation
7. Execute trades

---

## ✅ Completed Features

- ✅ Full trading terminal UI
- ✅ 13 chart types
- ✅ 25 technical indicators
- ✅ Drawing tools (cursor, trend lines, shapes)
- ✅ News events integration
- ✅ NewsToast component with filtering
- ✅ Insights mode toggle
- ✅ Period selection with crosshair
- ✅ OHLC display
- ✅ Watchlist with 49 Nifty 50 stocks
- ✅ Portfolio generator UI
- ✅ Theme toggle (dark/light)
- ✅ Responsive layout
- ✅ Stock persistence

---

## 🔨 Pending Features

### High Priority
- ⏳ **News Insights Dialog**: Display filtered news when period is selected
- ⏳ **Fibonacci Drawing Tool**: Interactive retracement levels
- ⏳ **Trend Line Drawing**: Click-and-drag trend lines
- ⏳ **Pattern Recognition**: Auto-detect chart patterns

### Medium Priority
- ⏳ **Horizontal/Vertical Lines**: Interactive line drawing
- ⏳ **Shape Drawing**: Rectangles, circles for marking zones
- ⏳ **Text Annotations**: Add notes on chart
- ⏳ **Drawing Persistence**: Save drawings to backend

### Low Priority
- ⏳ **Multi-chart Layout**: Split screen for multiple stocks
- ⏳ **Alerts System**: Price/indicator-based alerts
- ⏳ **Export Charts**: PNG/PDF export
- ⏳ **Social Sharing**: Share chart snapshots

---

## 🐛 Known Issues

1. **News Tooltips**: Previously persisted across stock changes (FIXED)
2. **GDELT API**: Empty responses for large date ranges (FIXED with chunking)
3. **Encoding**: Unicode characters in news titles (FIXED with UTF-8 handling)

---

## 📊 Data Sources

### Current
- **Stock Prices**: yfinance (Yahoo Finance API)
- **News Events**: GDELT API
- **Sentiment Analysis**: FinBERT transformer model
- **Storage**: Elasticsearch (stock_news index)

### Future Integrations
- Real-time WebSocket for prices
- Options chain data from NSE
- Fundamental data (P/E, EPS, etc.)
- Order execution via broker APIs

---

## 🎓 Learning Resources

### For Developers
- Next.js App Router docs
- lightweight-charts documentation
- Tailwind CSS utility classes
- React hooks best practices

### For Users
- Chart reading guides
- Technical indicator explanations
- Drawing tools tutorials
- Portfolio optimization strategies

---

## 🔐 Security Considerations

- Client-side only (no auth yet)
- localStorage for preferences
- No sensitive data stored
- API calls through Next.js API routes (CORS handling)

---

## 📈 Future Roadmap

### Q1 2024
- Complete drawing tools
- News insights dialog
- Pattern recognition

### Q2 2024
- Multi-chart layouts
- Advanced order types
- Social features

### Q3 2024
- Mobile app (React Native)
- Real-time data feeds
- Broker integration

---

## 🤝 Contributing Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Tailwind utility-first approach
- Component-driven architecture
- Meaningful variable names
- Add JSDoc comments for complex logic

### Component Structure
```typescript
"use client"; // If using hooks

import statements

interface Props { ... }

export default function ComponentName({ props }: Props) {
  // State
  // Effects
  // Handlers
  // Render
}
```

---

## 📞 Contact & Support

**Developer**: Amartya Kumar
**Email**: kumaramartya11@gmail.com
**Repository**: AmartyaKumar11/Meridian

---

**Last Updated**: November 21, 2025
**Version**: 0.1.0 (Alpha)
