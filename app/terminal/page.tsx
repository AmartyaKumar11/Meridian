// Custom slider styles for modern, theme-matching look
// Add this at the top-level of the component render (just inside the main return)

"use client";

import { 
  Search, Bell, User, Moon, Sun, LogOut,
  Plus, Minus, TrendingUp, Undo2, Redo2, 
  Settings, Camera, Share2, X, PenTool, 
  Mouse, Type, Circle, Square, Triangle,
  TrendingDown, Maximize2, Activity, Eye,
  Lock, Trash2, Grid, BarChart3, List,
  ChevronRight, ChevronLeft, Pencil, FileBarChart, CreditCard,
  Target, Slash, Heart, Brush, Zap, Move
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import PageTransition from "../components/PageTransition";
import TradingChart from "../components/TradingChart";

export default function Terminal() {
  const [chartKey, setChartKey] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(true);
  const [isIndicesOpen, setIsIndicesOpen] = useState(false);
  const [isPortfolioSidebarOpen, setIsPortfolioSidebarOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("1d");
  const [selectedStock, setSelectedStock] = useState("RELIANCE.NS");
  const [selectedChartType, setSelectedChartType] = useState("candlestick");
  const [showChartTypeMenu, setShowChartTypeMenu] = useState(false);
  const [activeLeftTool, setActiveLeftTool] = useState("cursor");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0 });
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [searchIndicator, setSearchIndicator] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ohlcData, setOhlcData] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    change: number;
    changePercent: number;
    isBullish: boolean;
  } | null>(null);
  
  // Portfolio Generator states
  const [portfolioStartDate, setPortfolioStartDate] = useState("");
  const [portfolioEndDate, setPortfolioEndDate] = useState("");
  const [dateSelectionMode, setDateSelectionMode] = useState<"manual" | "chart">("manual");
  const [chartSelectedStart, setChartSelectedStart] = useState<number | null>(null);
  const [chartSelectedEnd, setChartSelectedEnd] = useState<number | null>(null);
  const [targetReturn, setTargetReturn] = useState(15);
  const [riskAppetite, setRiskAppetite] = useState("moderate");
  const [horizonYears, setHorizonYears] = useState(5);
  const [initialCapital, setInitialCapital] = useState(100000);
  const [inflation, setInflation] = useState(6);
  const [sectorsInclude, setSectorsInclude] = useState<string[]>([]);
  const [sectorsExclude, setSectorsExclude] = useState<string[]>([]);
  
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setChartKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const toggleIndicator = (indicatorId: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const getIndicatorsByCategory = (category: string) => {
    if (category === "All") return technicalIndicators;
    return technicalIndicators.filter(ind => ind.category === category);
  };

  const getFilteredIndicators = () => {
    if (searchIndicator) {
      return technicalIndicators.filter(ind => 
        ind.name.toLowerCase().includes(searchIndicator.toLowerCase())
      );
    }
    return technicalIndicators;
  };

  const handleCrosshairMove = (data: { open: number; high: number; low: number; close: number }) => {
    // Determine if candle is bullish (green) or bearish (red)
    const isBullish = data.close >= data.open;
    
    // Calculate change and percentage based on open vs close of this candle
    const change = data.close - data.open;
    const changePercent = data.open !== 0 ? (change / data.open) * 100 : 0;
    
    console.log('📍 Crosshair OHLC:', {
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
      change,
      changePercent: changePercent.toFixed(2) + '%',
      isBullish
    });
    
    setOhlcData({
      ...data,
      change: isNaN(change) ? 0 : change,
      changePercent: isNaN(changePercent) ? 0 : changePercent,
      isBullish,
    });
  };

  const handleLogout = () => {
    router.push('/');
  };

  // Handle chart click for date selection in Portfolio Generator
  const handleChartClick = (timestamp: number) => {
    if (dateSelectionMode === "chart" && isPortfolioSidebarOpen) {
      if (!chartSelectedStart) {
        setChartSelectedStart(timestamp);
      } else if (!chartSelectedEnd) {
        setChartSelectedEnd(timestamp);
      }
    }
  };

  // Handle right-click to clear chart date selection
  const handleChartRightClick = () => {
    if (dateSelectionMode === "chart" && isPortfolioSidebarOpen) {
      setChartSelectedStart(null);
      setChartSelectedEnd(null);
    }
  };

  // Sector options for portfolio generator
  const sectorOptions = [
    "Banking", "IT", "Pharmaceuticals", "Automobiles", "Energy",
    "FMCG", "Metals", "Real Estate", "Telecom", "Infrastructure"
  ];

  const drawingToolsCategories = [
    {
      id: "lines",
      label: "Line Tools",
      icon: TrendingUp,
      tools: [
        { id: "trend-line", label: "Trend Line", shortcut: "" },
        { id: "arrow", label: "Arrow", shortcut: "" },
        { id: "ray", label: "Ray", shortcut: "" },
        { id: "info-line", label: "Info Line", shortcut: "" },
        { id: "extended-line", label: "Extended Line", shortcut: "" },
        { id: "trend-angle", label: "Trend Angle", shortcut: "" },
        { id: "horizontal-line", label: "Horizontal Line", shortcut: "Alt + H" },
        { id: "horizontal-ray", label: "Horizontal Ray", shortcut: "Alt + J" },
        { id: "vertical-line", label: "Vertical Line", shortcut: "Alt + V" },
        { id: "cross-line", label: "Cross Line", shortcut: "Alt + C" },
        { id: "parallel-channel", label: "Parallel Channel", shortcut: "" },
        { id: "regression-trend", label: "Regression Trend", shortcut: "" },
        { id: "flat-top-bottom", label: "Flat Top/Bottom", shortcut: "" },
        { id: "disjoint-channel", label: "Disjoint Channel", shortcut: "" },
      ]
    },
    {
      id: "fibonacci",
      label: "Fibonacci",
      icon: BarChart3,
      tools: [
        { id: "fib-retracement", label: "Fib Retracement", shortcut: "" },
        { id: "fib-extension", label: "Trend-Based Fib Extension", shortcut: "" },
        { id: "pitchfork", label: "Pitchfork", shortcut: "" },
        { id: "schiff-pitchfork", label: "Schiff Pitchfork", shortcut: "" },
        { id: "modified-pitchfork", label: "Modified Schiff Pitchfork", shortcut: "" },
        { id: "inside-pitchfork", label: "Inside Pitchfork", shortcut: "" },
        { id: "fib-channel", label: "Fib Channel", shortcut: "" },
        { id: "fib-time-zone", label: "Fib Time Zone", shortcut: "" },
        { id: "fib-speed-fan", label: "Fib Speed Resistance Fan", shortcut: "" },
        { id: "fib-time", label: "Trend-Based Fib Time", shortcut: "" },
        { id: "fib-circles", label: "Fib Circles", shortcut: "" },
      ]
    },
    {
      id: "gann",
      label: "Gann Tools",
      icon: Grid,
      tools: [
        { id: "gann-box", label: "Gann Box", shortcut: "" },
        { id: "gann-square-fixed", label: "Gann Square Fixed", shortcut: "" },
        { id: "gann-square", label: "Gann Square", shortcut: "" },
        { id: "gann-fan", label: "Gann Fan", shortcut: "" },
      ]
    },
    {
      id: "shapes",
      label: "Shapes",
      icon: Square,
      tools: [
        { id: "brush", label: "Brush", shortcut: "" },
        { id: "highlighter", label: "Highlighter", shortcut: "" },
        { id: "rectangle", label: "Rectangle", shortcut: "" },
        { id: "circle", label: "Circle", shortcut: "" },
        { id: "ellipse", label: "Ellipse", shortcut: "" },
        { id: "path", label: "Path", shortcut: "" },
        { id: "curve", label: "Curve", shortcut: "" },
        { id: "polyline", label: "Polyline", shortcut: "" },
        { id: "triangle", label: "Triangle", shortcut: "" },
        { id: "rotated-rectangle", label: "Rotated Rectangle", shortcut: "" },
        { id: "arc", label: "Arc", shortcut: "" },
        { id: "double-curve", label: "Double Curve", shortcut: "" },
      ]
    },
    {
      id: "annotation",
      label: "Annotation",
      icon: Type,
      tools: [
        { id: "text", label: "Text", shortcut: "" },
        { id: "anchored-text", label: "Anchored Text", shortcut: "" },
        { id: "note", label: "Note", shortcut: "" },
        { id: "anchored-note", label: "Anchored Note", shortcut: "" },
        { id: "signpost", label: "Signpost", shortcut: "" },
        { id: "callout", label: "Callout", shortcut: "" },
        { id: "comment", label: "Comment", shortcut: "" },
        { id: "price-label", label: "Price Label", shortcut: "" },
        { id: "price-note", label: "Price Note", shortcut: "" },
        { id: "arrow-marker", label: "Arrow Marker", shortcut: "" },
        { id: "arrow-left", label: "Arrow Mark Left", shortcut: "" },
        { id: "arrow-right", label: "Arrow Mark Right", shortcut: "" },
        { id: "arrow-up", label: "Arrow Mark Up", shortcut: "" },
        { id: "arrow-down", label: "Arrow Mark Down", shortcut: "" },
        { id: "flag-mark", label: "Flag Mark", shortcut: "" },
      ]
    },
    {
      id: "patterns",
      label: "Patterns",
      icon: Activity,
      tools: [
        { id: "xabcd", label: "XABCD Pattern", shortcut: "" },
        { id: "cypher", label: "Cypher Pattern", shortcut: "" },
        { id: "abcd", label: "ABCD Pattern", shortcut: "" },
        { id: "triangle-pattern", label: "Triangle Pattern", shortcut: "" },
        { id: "three-drives", label: "Three Drives Pattern", shortcut: "" },
        { id: "head-shoulders", label: "Head and Shoulders", shortcut: "" },
        { id: "elliott-impulse", label: "Elliott Impulse Wave (12345)", shortcut: "" },
        { id: "elliott-triangle", label: "Elliott Triangle Wave (ABCDE)", shortcut: "" },
        { id: "elliott-triple", label: "Elliott Triple Combo Wave (WXYZ)", shortcut: "" },
        { id: "elliott-correction", label: "Elliott Correction Wave (ABC)", shortcut: "" },
        { id: "elliott-double", label: "Elliott Double Combo Wave (WXY)", shortcut: "" },
        { id: "cyclic-lines", label: "Cyclic Lines", shortcut: "" },
        { id: "time-cycles", label: "Time Cycles", shortcut: "" },
        { id: "sine-line", label: "Sine Line", shortcut: "" },
      ]
    },
    {
      id: "position",
      label: "Position & Range",
      icon: Target,
      tools: [
        { id: "long-position", label: "Long Position", shortcut: "" },
        { id: "short-position", label: "Short Position", shortcut: "" },
        { id: "forecast", label: "Forecast", shortcut: "" },
        { id: "date-range", label: "Date Range", shortcut: "" },
        { id: "price-range", label: "Price Range", shortcut: "" },
        { id: "date-price-range", label: "Date and Price Range", shortcut: "" },
        { id: "bars-pattern", label: "Bars Pattern", shortcut: "" },
        { id: "ghost-feed", label: "Ghost Feed", shortcut: "" },
        { id: "projection", label: "Projection", shortcut: "" },
        { id: "volume-profile", label: "Fixed Range Volume Profile", shortcut: "" },
      ]
    },
  ];

  const leftSidebarTools = [
    { id: "cursor", icon: Mouse, label: "Cursor", hasSubmenu: false },
    { id: "line", icon: Slash, label: "Line Tools", hasSubmenu: true, category: "lines" },
    { id: "gann", icon: Grid, label: "Gann Tools", hasSubmenu: true, category: "gann" },
    { id: "fibonacci", icon: BarChart3, label: "Fibonacci", hasSubmenu: true, category: "fibonacci" },
    { id: "patterns", icon: Activity, label: "Patterns", hasSubmenu: true, category: "patterns" },
    { id: "shapes", icon: Square, label: "Shapes", hasSubmenu: true, category: "shapes" },
    { id: "annotation", icon: Type, label: "Annotation", hasSubmenu: true, category: "annotation" },
    { id: "icons", icon: Heart, label: "Icons & Stickers", hasSubmenu: false },
    { id: "brush", icon: Brush, label: "Brush", hasSubmenu: false },
    { id: "measure", icon: Zap, label: "Measure", hasSubmenu: false },
    { id: "zoom", icon: Maximize2, label: "Zoom", hasSubmenu: false },
    { id: "magnet", icon: Move, label: "Magnet Mode", hasSubmenu: false },
    { id: "lock", icon: Lock, label: "Lock", hasSubmenu: false },
    { id: "hide", icon: Eye, label: "Hide/Show", hasSubmenu: false },
    { id: "settings", icon: Settings, label: "Settings", hasSubmenu: false },
    { id: "delete", icon: Trash2, label: "Remove Objects", hasSubmenu: false },
  ];

  const intervals = ["5y", "1y", "3m", "1m", "5d", "1d"];
  const chartTypes = ["5m", "15m", "1h", "1d"];

  const technicalIndicators = [
    { id: "ma-5", name: "Moving Average (5)", category: "Trend", color: "#00D09C" },
    { id: "ma-20", name: "Moving Average (20)", category: "Trend", color: "#2196F3" },
    { id: "ma-50", name: "Moving Average (50)", category: "Trend", color: "#FF9800" },
    { id: "ma-200", name: "Moving Average (200)", category: "Trend", color: "#F44336" },
    { id: "ema-20", name: "Exponential Moving Average (20)", category: "Trend", color: "#00BCD4" },
    { id: "ema-50", name: "Exponential Moving Average (50)", category: "Trend", color: "#FFC107" },
    { id: "ema-200", name: "Exponential Moving Average (200)", category: "Trend", color: "#E91E63" },
    { id: "rsi", name: "Relative Strength Index (RSI)", category: "Momentum", color: "#9C27B0" },
    { id: "macd", name: "MACD", category: "Momentum", color: "#3F51B5" },
    { id: "bollinger", name: "Bollinger Bands", category: "Volatility", color: "#607D8B" },
    { id: "volume", name: "Volume", category: "Volume", color: "#4CAF50" },
    { id: "atr", name: "Average True Range (ATR)", category: "Volatility", color: "#FF5722" },
    { id: "obv", name: "On-Balance Volume (OBV)", category: "Volume", color: "#8BC34A" },
    { id: "roc", name: "Rate of Change (ROC)", category: "Momentum", color: "#CDDC39" },
    { id: "stochastic", name: "Stochastic Oscillator", category: "Momentum", color: "#FFEB3B" },
    { id: "cci", name: "Commodity Channel Index (CCI)", category: "Momentum", color: "#00E676" },
    { id: "momentum", name: "Momentum Indicator", category: "Momentum", color: "#76FF03" },
    { id: "williams", name: "Williams %R", category: "Momentum", color: "#C6FF00" },
    { id: "cmf", name: "Chaikin Money Flow (CMF)", category: "Volume", color: "#AEEA00" },
    { id: "adl", name: "Accumulation/Distribution Line", category: "Volume", color: "#64DD17" },
    { id: "fibonacci", name: "Fibonacci Retracement", category: "Support/Resistance", color: "#FFD600" },
    { id: "sar", name: "Parabolic SAR", category: "Trend", color: "#FFAB00" },
    { id: "vwap", name: "VWAP", category: "Volume", color: "#FF6D00" },
    { id: "ichimoku", name: "Ichimoku Cloud", category: "Trend", color: "#DD2C00" },
    { id: "pivot", name: "Pivot Points", category: "Support/Resistance", color: "#D50000" },
  ];

  const indicatorCategories = [
    "All",
    "Trend",
    "Momentum",
    "Volatility",
    "Volume",
    "Support/Resistance"
  ];

  const chartStyleOptions = [
    { id: "bars", label: "Bars", icon: BarChart3 },
    { id: "candlestick", label: "Candles", icon: Activity },
    { id: "hollow-candlestick", label: "Hollow candles", icon: Activity },
    { id: "columns", label: "Columns", icon: BarChart3 },
    { id: "line", label: "Line", icon: TrendingUp },
    { id: "area", label: "Area", icon: Activity },
    { id: "baseline", label: "Baseline", icon: TrendingUp },
    { id: "high-low", label: "High-low", icon: BarChart3 },
    { id: "heikin-ashi", label: "Heikin Ashi", icon: Activity },
    { id: "renko", label: "Renko", icon: Grid },
    { id: "line-break", label: "Line break", icon: TrendingUp },
    { id: "kagi", label: "Kagi", icon: Activity },
    { id: "point-figure", label: "Point & figure", icon: Grid },
  ];

  const watchlistStocks = [
    // Major Indices
    { name: "Nifty 50", symbol: "^NSEI", price: "₹25,867.10", change: "-186.80", percent: "(0.72%)", positive: false },
    { name: "Bank Nifty", symbol: "^NSEBANK", price: "₹58,033.70", change: "-351.55", percent: "(0.60%)", positive: false },
    { name: "Nifty IT", symbol: "^CNXIT", price: "₹42,156.80", change: "+234.50", percent: "(0.56%)", positive: true },
    { name: "Nifty Midcap 50", symbol: "^NSEMDCP50", price: "₹13,464.15", change: "+33.40", percent: "(0.25%)", positive: true },
    { name: "Fin Nifty", symbol: "^CNXFIN", price: "₹27,377.90", change: "-209.75", percent: "(0.76%)", positive: false },
    
    // NIFTY 50 Stocks
    { name: "Adani Enterprises", symbol: "ADANIENT.NS", price: "₹2,678.90", change: "+34.50", percent: "(1.31%)", positive: true },
    { name: "Adani Ports", symbol: "ADANIPORTS.NS", price: "₹1,234.50", change: "+18.20", percent: "(1.50%)", positive: true },
    { name: "Apollo Hospital", symbol: "APOLLOHOSP.NS", price: "₹6,543.20", change: "-45.30", percent: "(0.69%)", positive: false },
    { name: "Asian Paints", symbol: "ASIANPAINT.NS", price: "₹2,934.50", change: "+28.70", percent: "(0.99%)", positive: true },
    { name: "Axis Bank", symbol: "AXISBANK.NS", price: "₹1,178.40", change: "+15.60", percent: "(1.34%)", positive: true },
    { name: "Bajaj Auto", symbol: "BAJAJ-AUTO.NS", price: "₹9,876.30", change: "+123.40", percent: "(1.27%)", positive: true },
    { name: "Bajaj Finance", symbol: "BAJFINANCE.NS", price: "₹7,234.50", change: "-78.40", percent: "(1.07%)", positive: false },
    { name: "Bajaj Finserv", symbol: "BAJAJFINSV.NS", price: "₹1,645.80", change: "+22.30", percent: "(1.37%)", positive: true },
    { name: "BPCL", symbol: "BPCL.NS", price: "₹345.60", change: "-5.40", percent: "(1.54%)", positive: false },
    { name: "Bharti Airtel", symbol: "BHARTIARTL.NS", price: "₹1,567.20", change: "+12.30", percent: "(0.79%)", positive: true },
    { name: "Britannia", symbol: "BRITANNIA.NS", price: "₹5,234.70", change: "+67.50", percent: "(1.31%)", positive: true },
    { name: "Cipla", symbol: "CIPLA.NS", price: "₹1,456.80", change: "-18.60", percent: "(1.26%)", positive: false },
    { name: "Coal India", symbol: "COALINDIA.NS", price: "₹456.30", change: "+8.20", percent: "(1.83%)", positive: true },
    { name: "Divi's Lab", symbol: "DIVISLAB.NS", price: "₹3,876.50", change: "-45.20", percent: "(1.15%)", positive: false },
    { name: "Dr. Reddy's", symbol: "DRREDDY.NS", price: "₹6,123.40", change: "+78.30", percent: "(1.30%)", positive: true },
    { name: "Eicher Motors", symbol: "EICHERMOT.NS", price: "₹4,987.60", change: "-56.40", percent: "(1.12%)", positive: false },
    { name: "Grasim", symbol: "GRASIM.NS", price: "₹2,456.80", change: "+34.50", percent: "(1.42%)", positive: true },
    { name: "HCL Technologies", symbol: "HCLTECH.NS", price: "₹1,834.70", change: "-12.50", percent: "(0.68%)", positive: false },
    { name: "HDFC Bank", symbol: "HDFCBANK.NS", price: "₹1,678.90", change: "+8.20", percent: "(0.49%)", positive: true },
    { name: "HDFC Life", symbol: "HDFCLIFE.NS", price: "₹678.40", change: "+12.30", percent: "(1.85%)", positive: true },
    { name: "Hero MotoCorp", symbol: "HEROMOTOCO.NS", price: "₹4,876.50", change: "-67.20", percent: "(1.36%)", positive: false },
    { name: "Hindalco", symbol: "HINDALCO.NS", price: "₹645.80", change: "+15.60", percent: "(2.47%)", positive: true },
    { name: "Hindustan Unilever", symbol: "HINDUNILVR.NS", price: "₹2,687.30", change: "-23.40", percent: "(0.86%)", positive: false },
    { name: "ICICI Bank", symbol: "ICICIBANK.NS", price: "₹1,245.80", change: "+18.50", percent: "(1.51%)", positive: true },
    { name: "IndusInd Bank", symbol: "INDUSINDBK.NS", price: "₹1,456.70", change: "-23.40", percent: "(1.58%)", positive: false },
    { name: "Infosys", symbol: "INFY.NS", price: "₹1,432.50", change: "-15.60", percent: "(1.08%)", positive: false },
    { name: "ITC Ltd", symbol: "ITC.NS", price: "₹478.30", change: "-3.20", percent: "(0.66%)", positive: false },
    { name: "JSW Steel", symbol: "JSWSTEEL.NS", price: "₹876.50", change: "+23.40", percent: "(2.74%)", positive: true },
    { name: "Kotak Bank", symbol: "KOTAKBANK.NS", price: "₹1,789.60", change: "+34.50", percent: "(1.97%)", positive: true },
    { name: "LTIMindtree", symbol: "LTIM.NS", price: "₹5,678.90", change: "-78.40", percent: "(1.36%)", positive: false },
    { name: "Larsen & Toubro", symbol: "LT.NS", price: "₹3,698.50", change: "+34.80", percent: "(0.95%)", positive: true },
    { name: "Mahindra & Mahindra", symbol: "M&M.NS", price: "₹2,984.60", change: "+45.90", percent: "(1.56%)", positive: true },
    { name: "Maruti Suzuki", symbol: "MARUTI.NS", price: "₹12,456.30", change: "+145.60", percent: "(1.18%)", positive: true },
    { name: "Nestle India", symbol: "NESTLEIND.NS", price: "₹2,567.80", change: "-34.50", percent: "(1.33%)", positive: false },
    { name: "NTPC", symbol: "NTPC.NS", price: "₹345.60", change: "+8.40", percent: "(2.49%)", positive: true },
    { name: "ONGC", symbol: "ONGC.NS", price: "₹256.80", change: "+5.60", percent: "(2.23%)", positive: true },
    { name: "Power Grid", symbol: "POWERGRID.NS", price: "₹289.40", change: "-4.20", percent: "(1.43%)", positive: false },
    { name: "Reliance Industries", symbol: "RELIANCE.NS", price: "₹2,456.70", change: "-23.40", percent: "(0.94%)", positive: false },
    { name: "SBI Life", symbol: "SBILIFE.NS", price: "₹1,567.80", change: "+23.40", percent: "(1.52%)", positive: true },
    { name: "State Bank of India", symbol: "SBIN.NS", price: "₹845.60", change: "+22.40", percent: "(2.72%)", positive: true },
    { name: "Sun Pharma", symbol: "SUNPHARMA.NS", price: "₹1,756.40", change: "+23.80", percent: "(1.37%)", positive: true },
    { name: "Tata Consumer", symbol: "TATACONSUM.NS", price: "₹1,234.50", change: "-18.60", percent: "(1.48%)", positive: false },
    { name: "Tata Motors", symbol: "TATAMOTORS.NS", price: "₹945.30", change: "+12.50", percent: "(1.34%)", positive: true },
    { name: "Tata Steel", symbol: "TATASTEEL.NS", price: "₹145.80", change: "+3.40", percent: "(2.39%)", positive: true },
    { name: "Tech Mahindra", symbol: "TECHM.NS", price: "₹1,678.90", change: "-23.40", percent: "(1.37%)", positive: false },
    { name: "Titan Company", symbol: "TITAN.NS", price: "₹3,567.90", change: "-34.50", percent: "(0.96%)", positive: false },
    { name: "Trent", symbol: "TRENT.NS", price: "₹6,789.40", change: "+123.50", percent: "(1.85%)", positive: true },
    { name: "UltraTech Cement", symbol: "ULTRACEMCO.NS", price: "₹10,234.60", change: "-145.30", percent: "(1.40%)", positive: false },
    { name: "Wipro", symbol: "WIPRO.NS", price: "₹567.80", change: "-8.30", percent: "(1.44%)", positive: false },
  ];

  const allIndices = [
    { name: "NIFTY", price: "25,867.10", change: "-186.80", percent: "(0.72%)", positive: false },
    { name: "SENSEX", price: "84,371.18", change: "-625.95", percent: "(0.74%)", positive: false },
    { name: "BANKNIFTY", price: "58,033.70", change: "-351.55", percent: "(0.60%)", positive: false },
    { name: "MIDCPNIFTY", price: "13,464.15", change: "+33.40", percent: "(0.25%)", positive: true },
    { name: "FINNIFTY", price: "27,377.90", change: "-209.75", percent: "(0.76%)", positive: false },
    { name: "BANKEX", price: "65,305.99", change: "-465.45", percent: "(0.71%)", positive: false },
  ];

  return (
    <div>
      <style jsx global>{`
        input[type='range'].custom-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 4px;
          outline: none;
          transition: background 0.2s;
        }
        .dark input[type='range'].custom-slider {
          background: #23272F;
        }
        input[type='range'].custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00D09C;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          cursor: pointer;
          transition: background 0.2s;
        }
        .dark input[type='range'].custom-slider::-webkit-slider-thumb {
          background: #00D09C;
          border: 2px solid #23272F;
        }
        input[type='range'].custom-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00D09C;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          cursor: pointer;
        }
        .dark input[type='range'].custom-slider::-moz-range-thumb {
          background: #00D09C;
          border: 2px solid #23272F;
        }
        input[type='range'].custom-slider::-ms-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #00D09C;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          cursor: pointer;
        }
        .dark input[type='range'].custom-slider::-ms-thumb {
          background: #00D09C;
          border: 2px solid #23272F;
        }
        input[type='range'].custom-slider:focus {
          outline: none;
        }
        input[type='range'].custom-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 4px;
        }
        input[type='range'].custom-slider::-ms-fill-lower {
          background: #00D09C;
        }
        input[type='range'].custom-slider::-ms-fill-upper {
          background: #e5e7eb;
        }
        .dark input[type='range'].custom-slider::-ms-fill-upper {
          background: #23272F;
        }
      `}</style>
      
      <PageTransition>
        <div className="h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0C0E12] transition-colors duration-300 overflow-hidden">
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-[#1A1D24]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300">
        <div className="max-w-full mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00D09C] to-[#00B386] rounded-full"></div>
              <span className="text-base font-semibold text-[#44475B] dark:text-white">Meridian Terminal</span>
            </div>

            {/* Center - Search */}
            <div className="flex items-center bg-[#F8F9FA] dark:bg-[#1F2228] rounded-md px-3 py-1.5 w-96">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Stocks, F&O, Indices etc."
                className="bg-transparent border-none outline-none ml-2 text-xs text-[#44475B] dark:text-gray-300 placeholder-gray-400 w-full"
              />
            </div>

            {/* Right - Market Indices and Profile */}
            <div className="flex items-center space-x-4">
              {/* Market Indices */}
              <div className="flex items-center space-x-3">
                <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1A1D24]">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">NIFTY</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#44475B] dark:text-white font-medium">25,868.80</span>
                    <span className="text-[10px] text-red-500">-185.10 (0.71%)</span>
                  </div>
                </div>
                <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1A1D24]">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">SENSEX</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#44475B] dark:text-white font-medium">84,393.27</span>
                    <span className="text-[10px] text-red-500">-603.86 (0.71%)</span>
                  </div>
                </div>
                <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1A1D24]">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">BANKNIFTY</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#44475B] dark:text-white font-medium">58,040.25</span>
                    <span className="text-[10px] text-red-500">-345.00 (0.59%)</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsIndicesOpen(true)}
                  className="text-xs text-[#00D09C] hover:text-[#00B386]"
                >
                  All Indices
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Terminal Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Drawing Tools */}
        <div className="w-12 bg-white dark:bg-[#131722] border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-3 space-y-0 overflow-y-auto scrollbar-hide relative transition-colors">
          {leftSidebarTools.map((tool, index) => (
            <div key={tool.id}>
              <button
                onClick={(e) => {
                  if (tool.hasSubmenu) {
                    const buttonRect = e.currentTarget.getBoundingClientRect();
                    const category = drawingToolsCategories.find(cat => cat.id === tool.category);
                    const estimatedMenuHeight = category ? (category.tools.length * 32 + 60) : 400; // 32px per item + header
                    const viewportHeight = window.innerHeight;
                    
                    let topPosition = buttonRect.top;
                    
                    // If menu would overflow bottom, shift it up
                    if (topPosition + estimatedMenuHeight > viewportHeight) {
                      topPosition = Math.max(0, viewportHeight - estimatedMenuHeight - 10);
                    }
                    
                    setMenuPosition({ top: topPosition });
                    setExpandedCategory(expandedCategory === tool.category ? null : tool.category || null);
                    setShowToolsMenu(expandedCategory === tool.category ? false : true);
                  } else {
                    // Toggle the tool: deselect if already active
                    setActiveLeftTool(activeLeftTool === tool.id ? "" : tool.id);
                    setShowToolsMenu(false);
                  }
                }}
                className={`w-full p-2.5 transition-colors relative ${
                  activeLeftTool === tool.id || (showToolsMenu && expandedCategory === tool.category)
                    ? "bg-[#2962FF] text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                title={tool.label}
              >
                <tool.icon className="w-4 h-4 mx-auto" />
                {tool.hasSubmenu && (
                  <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                )}
              </button>
              {/* Divider after certain tools */}
              {(index === 0 || index === 6 || index === 8 || index === 10 || index === 13) && (
                <div className="w-6 h-px bg-gray-300 dark:bg-gray-800 mx-auto my-1"></div>
              )}
            </div>
          ))}
        </div>

        {/* Drawing Tools Expandable Menu */}
        {showToolsMenu && expandedCategory && (
          <>
            <div 
              className="fixed inset-0 z-30"
              onClick={() => {
                setShowToolsMenu(false);
                setExpandedCategory(null);
              }}
            ></div>
            <div 
              className="fixed left-12 w-64 max-h-[90vh] bg-white dark:bg-[#1E222D] border border-gray-200 dark:border-gray-800 shadow-xl z-40 overflow-y-auto scrollbar-hide"
              style={{ top: `${menuPosition.top}px` }}
            >
              <div className="p-2">
                {drawingToolsCategories
                  .filter(cat => cat.id === expandedCategory)
                  .map((category) => (
                    <div key={category.id}>
                      <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center space-x-2">
                          <category.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs font-medium text-gray-900 dark:text-white">{category.label}</span>
                        </div>
                      </div>
                      <div className="mt-1 space-y-0">
                        {category.tools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              setActiveLeftTool(tool.id);
                              setShowToolsMenu(false);
                              setExpandedCategory(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                              activeLeftTool === tool.id
                                ? "bg-[#2962FF] text-white"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <span className="text-xs">{tool.label}</span>
                            {tool.shortcut && (
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">{tool.shortcut}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Chart Top Bar */}
          <div className="bg-white dark:bg-[#1A1D24] border-b border-gray-200 dark:border-gray-800 px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Stock Info */}
              <div className="flex items-center space-x-3">
                <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]">
                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-[#44475B] dark:text-white">
                        {watchlistStocks.find(s => s.symbol === selectedStock)?.name.toUpperCase() || "RELIANCE INDUSTRIES"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{selectedStock}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs mt-0.5">
                      <span className="text-[#44475B] dark:text-white">Interval: {selectedInterval.toUpperCase()}</span>
                      <span className="text-gray-500 dark:text-gray-400">Live Data</span>
                    </div>
                  </div>
                  
                  {/* Chart Type Selector */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowChartTypeMenu(!showChartTypeMenu)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded border border-gray-300 dark:border-gray-700"
                    >
                      {(() => {
                        const ChartIcon = chartStyleOptions.find(opt => opt.id === selectedChartType)?.icon || Activity;
                        return <ChartIcon className="w-3.5 h-3.5" />;
                      })()}
                      <span>{chartStyleOptions.find(opt => opt.id === selectedChartType)?.label || "Candles"}</span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${showChartTypeMenu ? 'rotate-90' : 'rotate-0'}`} />
                    </button>

                    {/* Chart Type Dropdown */}
                    {showChartTypeMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-30"
                          onClick={() => setShowChartTypeMenu(false)}
                        ></div>
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1E222D] border border-gray-200 dark:border-gray-700 rounded-md shadow-xl z-40 py-1">
                          {chartStyleOptions.map((option) => {
                            const OptionIcon = option.icon;
                            return (
                              <button
                                key={option.id}
                                onClick={() => {
                                  setSelectedChartType(option.id);
                                  setShowChartTypeMenu(false);
                                }}
                                className={`w-full flex items-center space-x-2 px-3 py-2 text-xs text-left transition-colors ${
                                  selectedChartType === option.id
                                    ? "bg-[#00D09C]/10 text-[#00D09C]"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                              >
                                <OptionIcon className="w-3.5 h-3.5" />
                                <span>{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Indicators Button */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowIndicatorsMenu(!showIndicatorsMenu);
                        setSelectedCategory(null);
                        setSearchIndicator("");
                      }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded border border-gray-300 dark:border-gray-700"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Indicators</span>
                      {activeIndicators.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-[#00D09C] text-white rounded-full">
                          {activeIndicators.length}
                        </span>
                      )}
                    </button>

                    {/* Primary Indicators Dropdown */}
                    {showIndicatorsMenu && !selectedCategory && (
                      <>
                        <div 
                          className="fixed inset-0 z-30"
                          onClick={() => {
                            setShowIndicatorsMenu(false);
                            setSearchIndicator("");
                          }}
                        ></div>
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-800 rounded shadow-2xl z-40">
                          {/* Header */}
                          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Indicators</h3>
                              <button
                                onClick={() => {
                                  setShowIndicatorsMenu(false);
                                  setSearchIndicator("");
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center bg-gray-100 dark:bg-[#1E222D] rounded px-2 py-1.5">
                              <Search className="w-3.5 h-3.5 text-gray-400" />
                              <input
                                type="text"
                                value={searchIndicator}
                                onChange={(e) => setSearchIndicator(e.target.value)}
                                placeholder="Search"
                                className="bg-transparent border-none outline-none ml-2 text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 w-full"
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="max-h-96 overflow-y-auto">
                            {searchIndicator ? (
                              // Search Results
                              <div className="py-1">
                                {getFilteredIndicators().length > 0 ? (
                                  getFilteredIndicators().map((indicator) => (
                                    <button
                                      key={indicator.id}
                                      onClick={() => toggleIndicator(indicator.id)}
                                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-left hover:bg-gray-50 dark:hover:bg-[#1E222D] transition-colors"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div 
                                          className="w-2.5 h-2.5 rounded-sm"
                                          style={{ backgroundColor: indicator.color }}
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">{indicator.name}</span>
                                      </div>
                                      {activeIndicators.includes(indicator.id) && (
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#00D09C] flex items-center justify-center">
                                          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      )}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                                    No indicators found
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Category List
                              <>
                                <div className="py-1">
                                  <div className="px-4 py-2 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    SCRIPT NAME
                                  </div>
                                  {indicatorCategories.filter(cat => cat !== "All").map((category) => {
                                    const categoryIndicators = getIndicatorsByCategory(category);
                                    const activeCount = categoryIndicators.filter(ind => activeIndicators.includes(ind.id)).length;
                                    
                                    return (
                                      <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-left hover:bg-gray-50 dark:hover:bg-[#1E222D] transition-colors group"
                                      >
                                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                                        <div className="flex items-center space-x-2">
                                          {activeCount > 0 && (
                                            <span className="px-1.5 py-0.5 text-[10px] bg-[#00D09C] text-white rounded">
                                              {activeCount}
                                            </span>
                                          )}
                                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Footer */}
                          {activeIndicators.length > 0 && (
                            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                              <button
                                onClick={() => setActiveIndicators([])}
                                className="w-full text-xs text-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Clear all ({activeIndicators.length})
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Secondary Category Dropdown */}
                    {showIndicatorsMenu && selectedCategory && (
                      <>
                        <div 
                          className="fixed inset-0 z-30"
                          onClick={() => {
                            setSelectedCategory(null);
                          }}
                        ></div>
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-800 rounded shadow-2xl z-40">
                          {/* Header */}
                          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{selectedCategory}</h3>
                            </div>
                          </div>

                          {/* Indicators List */}
                          <div className="max-h-96 overflow-y-auto py-1">
                            {getIndicatorsByCategory(selectedCategory).map((indicator) => (
                              <button
                                key={indicator.id}
                                onClick={() => toggleIndicator(indicator.id)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-left hover:bg-gray-50 dark:hover:bg-[#1E222D] transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className="w-2.5 h-2.5 rounded-sm"
                                    style={{ backgroundColor: indicator.color }}
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{indicator.name}</span>
                                </div>
                                {activeIndicators.includes(indicator.id) && (
                                  <div className="w-3.5 h-3.5 rounded-full bg-[#00D09C] flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center space-x-1 ml-8">
                {chartTypes.map((type) => (
                  <button
                    key={type}
                    className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded"
                  >
                    {type}
                  </button>
                ))}
              </div>
              {/* Undo/Redo */}
              <div className="flex items-center space-x-1">
                <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]">
                  <Undo2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]">
                  <Redo2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <button className="px-4 py-1.5 bg-[#00D09C] hover:bg-[#00B386] text-white text-xs font-medium rounded">
                B
              </button>
              <button className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded">
                S
              </button>
              <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]">
                <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]">
                <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              {isWatchlistOpen && (
                <button 
                  onClick={() => setIsWatchlistOpen(false)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Chart Canvas Area */}
          <div className="flex-1 bg-white dark:bg-[#0C0E12] relative transition-colors overflow-hidden cursor-crosshair">
            {/* OHLC Display - Top Left Corner */}
            {ohlcData && (
              <div className="absolute top-4 left-4 z-20 bg-gray-100/90 dark:bg-[#1A1D24]/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-lg">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500 dark:text-gray-400">O</span>
                    <span className={`font-medium ${ohlcData.isBullish ? 'text-[#00D09C]' : 'text-[#EB4D5C]'}`}>
                      {ohlcData.open.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500 dark:text-gray-400">H</span>
                    <span className={`font-medium ${ohlcData.isBullish ? 'text-[#00D09C]' : 'text-[#EB4D5C]'}`}>
                      {ohlcData.high.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500 dark:text-gray-400">L</span>
                    <span className={`font-medium ${ohlcData.isBullish ? 'text-[#00D09C]' : 'text-[#EB4D5C]'}`}>
                      {ohlcData.low.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500 dark:text-gray-400">C</span>
                    <span className={`font-medium ${ohlcData.isBullish ? 'text-[#00D09C]' : 'text-[#EB4D5C]'}`}>
                      {ohlcData.close.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 pl-2 border-l border-gray-300 dark:border-gray-700">
                    <span className={`font-medium ${ohlcData.isBullish ? 'text-[#00D09C]' : 'text-[#EB4D5C]'}`}>
                      {ohlcData.change >= 0 ? '+' : ''}{ohlcData.change?.toFixed(2) || '0.00'} ({ohlcData.changePercent >= 0 ? '+' : ''}{ohlcData.changePercent?.toFixed(2) || '0.00'}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
            

            <TradingChart 
              key={chartKey}
              symbol={selectedStock} 
              interval={selectedInterval} 
              chartType={selectedChartType}
              onCrosshairMove={handleCrosshairMove}
              activeIndicators={activeIndicators}
              onChartClick={handleChartClick}
              onChartRightClick={handleChartRightClick}
              chartDateSelectionMode={dateSelectionMode === "chart" && isPortfolioSidebarOpen}
              selectedStartDate={chartSelectedStart}
              selectedEndDate={chartSelectedEnd}
            />

            {/* Active Overlay Indicators Legend */}
            {activeIndicators.filter(id => {
              // Only show overlay indicators (not those in separate panes)
              const separatePaneIndicators = ['rsi', 'macd', 'stochastic', 'cci', 'momentum', 'williams', 'roc', 'volume', 'obv', 'cmf', 'adl', 'atr'];
              return !separatePaneIndicators.includes(id);
            }).length > 0 && (
              <div className="absolute top-20 left-4 bg-white/90 dark:bg-[#1A1D24]/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded px-3 py-2 z-10 shadow-lg">
                <div className="flex flex-col gap-1.5">
                  {activeIndicators.filter(id => {
                    const separatePaneIndicators = ['rsi', 'macd', 'stochastic', 'cci', 'momentum', 'williams', 'roc', 'volume', 'obv', 'cmf', 'adl', 'atr'];
                    return !separatePaneIndicators.includes(id);
                  }).map((id) => {
                    const indicator = technicalIndicators.find(ind => ind.id === id);
                    if (!indicator) return null;
                    return (
                      <div key={id} className="flex items-center space-x-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: indicator.color }}
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{indicator.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Timeframe Bar */}
          <div className="bg-white dark:bg-[#1A1D24] border-t border-gray-200 dark:border-gray-800 px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {intervals.map((interval) => (
                <button
                  key={interval}
                  onClick={() => setSelectedInterval(interval)}
                  className={`px-3 py-1 rounded transition-colors text-sm font-medium ${selectedInterval === interval ? 'bg-[#00D09C] text-white' : 'bg-gray-100 dark:bg-[#23272F] text-gray-700 dark:text-gray-300'}`}
                >{interval}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Watchlist */}
        {isWatchlistOpen && (
          <div className="w-80 bg-white dark:bg-[#1A1D24] border-l border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 overflow-hidden">
            {/* Watchlist Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#44475B] dark:text-white">Watchlist</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded">
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded">
                    <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Watchlist Stocks */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {watchlistStocks.map((stock, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedStock(stock.symbol)}
                  className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1F2228] cursor-pointer transition-colors ${
                    selectedStock === stock.symbol ? 'bg-[#00D09C]/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-[#44475B] dark:text-white">{stock.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{stock.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[#44475B] dark:text-white">{stock.price}</div>
                      <div className={`text-[10px] ${stock.positive ? 'text-[#00D09C]' : 'text-red-500'}`}>
                        {stock.change} {stock.percent}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rightmost Icon Sidebar */}
        <div className="w-12 bg-white dark:bg-[#131722] border-l border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 space-y-2 transition-colors">
          <button 
            onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
            className={`p-2.5 rounded transition-colors ${
              isWatchlistOpen 
                ? "bg-[#00D09C] text-white" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title="Watchlist"
          >
            <List className="w-4 h-4" />
          </button>
          
          <div className="w-6 h-px bg-gray-300 dark:bg-gray-800 my-1"></div>
          
          <button 
            onClick={() => setIsPortfolioSidebarOpen(!isPortfolioSidebarOpen)}
            className={`p-2.5 rounded transition-colors ${
              isPortfolioSidebarOpen 
                ? "bg-[#00D09C] text-white" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title="Portfolio Generator"
          >
            <FileBarChart className="w-4 h-4" />
          </button>
          
          <button 
            className="p-2.5 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Orders"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          
          <button 
            className="p-2.5 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Positions"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          
          <div className="w-6 h-px bg-gray-300 dark:bg-gray-800 my-1"></div>
          
          <button 
            className="p-2.5 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Alerts"
          >
            <Bell className="w-4 h-4" />
          </button>
          
          <button 
            className="p-2.5 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Portfolio Generator Modal Window */}
        {isPortfolioSidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
              onClick={() => setIsPortfolioSidebarOpen(false)}
            ></div>
            
            {/* Modal Window */}
            <div className="fixed inset-x-0 top-20 mx-auto w-[95%] max-w-[1400px] bg-white dark:bg-[#1A1D24] rounded-lg shadow-2xl z-50 max-h-[85vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#131722]">
                <div className="flex items-center space-x-3">
                  <FileBarChart className="w-5 h-5 text-[#00D09C]" />
                  <h2 className="text-lg font-semibold text-[#44475B] dark:text-white">Smart Portfolio Generator</h2>
                </div>
                <button 
                  onClick={() => setIsPortfolioSidebarOpen(false)}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#23272F] transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date Selection</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDateSelectionMode('manual')}
                        className={`flex-1 px-4 py-2 text-sm rounded transition-colors ${dateSelectionMode === 'manual' ? 'bg-[#00D09C] text-white' : 'bg-gray-100 dark:bg-[#1F2228] text-gray-700 dark:text-gray-300'}`}
                      >Manual</button>
                      <button
                        onClick={() => setDateSelectionMode('chart')}
                        className={`flex-1 px-4 py-2 text-sm rounded transition-colors ${dateSelectionMode === 'chart' ? 'bg-[#00D09C] text-white' : 'bg-gray-100 dark:bg-[#1F2228] text-gray-700 dark:text-gray-300'}`}
                      >From Chart</button>
                    </div>
                    {dateSelectionMode === 'manual' ? (
                      <div className="space-y-2">
                        <input 
                          type="date" 
                          value={portfolioStartDate} 
                          onChange={e => setPortfolioStartDate(e.target.value)} 
                          className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-[#23272F] border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100" 
                        />
                        <input 
                          type="date" 
                          value={portfolioEndDate} 
                          onChange={e => setPortfolioEndDate(e.target.value)} 
                          className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-[#23272F] border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100" 
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">Chart Selection Mode:</p>
                          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                            <li>Left-click chart: Set start date</li>
                            <li>Left-click again: Set end date</li>
                            <li>Right-click: Clear selection</li>
                          </ul>
                        </div>
                        {(chartSelectedStart || chartSelectedEnd) && (
                          <div className="bg-gray-100 dark:bg-[#23272F] rounded p-3 space-y-1">
                            {chartSelectedStart && (
                              <div className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Start:</span> {new Date(chartSelectedStart * 1000).toLocaleDateString()}
                              </div>
                            )}
                            {chartSelectedEnd && (
                              <div className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">End:</span> {new Date(chartSelectedEnd * 1000).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Risk Appetite */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Appetite</label>
                    <select
                      value={riskAppetite}
                      onChange={e => setRiskAppetite(e.target.value)}
                      className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-[#23272F] border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100"
                    >
                      <option value="low">Low Risk</option>
                      <option value="moderate">Moderate Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>

                  {/* Target Return */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Target Return: <span className="text-[#00D09C] font-bold">{targetReturn}%</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={targetReturn}
                      onChange={e => setTargetReturn(Number(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none bg-gray-200 dark:bg-[#23272F] accent-[#00D09C] custom-slider"
                      style={{ accentColor: '#00D09C' }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>5%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  {/* Investment Horizon */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Investment Horizon: <span className="text-[#00D09C] font-bold">{horizonYears} years</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={horizonYears}
                      onChange={e => setHorizonYears(Number(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none bg-gray-200 dark:bg-[#23272F] accent-[#00D09C] custom-slider"
                      style={{ accentColor: '#00D09C' }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1y</span>
                      <span>20y</span>
                    </div>
                  </div>

                  {/* Initial Capital */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Initial Capital (₹)</label>
                    <input
                      type="number"
                      value={initialCapital}
                      onChange={e => setInitialCapital(Number(e.target.value))}
                      className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-[#23272F] border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100"
                      placeholder="100000"
                    />
                  </div>

                  {/* Inflation Rate */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Inflation Rate: <span className="text-[#00D09C] font-bold">{inflation}%</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      step="0.5"
                      value={inflation}
                      onChange={e => setInflation(Number(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none bg-gray-200 dark:bg-[#23272F] accent-[#00D09C] custom-slider"
                      style={{ accentColor: '#00D09C' }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>2%</span>
                      <span>12%</span>
                    </div>
                  </div>

                  {/* Include Sectors */}
                  <div className="space-y-3 md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Include Sectors</label>
                    <div className="flex flex-wrap gap-2">
                      {sectorOptions.map(sector => (
                        <button
                          key={sector}
                          onClick={() => setSectorsInclude(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector])}
                          className={`px-3 py-1.5 text-xs rounded transition-colors ${sectorsInclude.includes(sector) ? 'bg-[#00D09C] text-white' : 'bg-gray-100 dark:bg-[#23272F] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A2E39]'}`}
                        >{sector}</button>
                      ))}
                    </div>
                  </div>

                  {/* Exclude Sectors */}
                  <div className="space-y-3 md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Exclude Sectors</label>
                    <div className="flex flex-wrap gap-2">
                      {sectorOptions.map(sector => (
                        <button
                          key={sector}
                          onClick={() => setSectorsExclude(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector])}
                          className={`px-3 py-1.5 text-xs rounded transition-colors ${sectorsExclude.includes(sector) ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-[#23272F] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A2E39]'}`}
                        >{sector}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#131722]">
                <button
                  onClick={() => setIsPortfolioSidebarOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-[#23272F] hover:bg-gray-300 dark:hover:bg-[#2A2E39] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Generating portfolio with params:', {
                      start: dateSelectionMode === 'manual' ? portfolioStartDate : chartSelectedStart,
                      end: dateSelectionMode === 'manual' ? portfolioEndDate : chartSelectedEnd,
                      targetReturn,
                      riskAppetite,
                      horizonYears,
                      initialCapital,
                      inflation: inflation / 100,
                      sectorsInclude,
                      sectorsExclude,
                    });
                    setIsPortfolioSidebarOpen(false);
                  }}
                  className="px-8 py-2.5 text-sm font-semibold bg-[#00D09C] hover:bg-[#00B386] text-white rounded transition-colors"
                >
                  Generate Portfolio
                </button>
              </div>
            </div>
          </>
        )}

        {/* All Indices Sidebar Modal */}
        {isIndicesOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 transition-all duration-300"
            onClick={() => setIsIndicesOpen(false)}
          ></div>
        )}
        <div className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-[#1A1D24] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isIndicesOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-[#44475B] dark:text-white">All indices</h2>
              <button 
                onClick={() => setIsIndicesOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Indices List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              {allIndices.map((index, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1F2228] cursor-pointer px-3 -mx-3 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-1 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="text-sm font-medium text-[#44475B] dark:text-white">{index.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#44475B] dark:text-white">{index.price}</div>
                    <div className={`text-xs ${index.positive ? 'text-[#00D09C]' : 'text-red-500'}`}>
                      {index.change} {index.percent}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button 
                onClick={() => setIsIndicesOpen(false)}
                className="w-full py-2.5 bg-gray-100 dark:bg-[#1F2228] text-gray-500 dark:text-gray-400 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
        </div>
      </PageTransition>
    </div>
  );
}
