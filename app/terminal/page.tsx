"use client";

import { 
  Search, Bell, User, Moon, Sun, LogOut,
  Plus, Minus, TrendingUp, Undo2, Redo2, 
  Settings, Camera, Share2, X, PenTool, 
  Mouse, Type, Circle, Square, Triangle,
  TrendingDown, Maximize2, Activity, Eye,
  Lock, Trash2, Grid, BarChart3, List,
  ChevronRight, Pencil, FileBarChart, CreditCard
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import PageTransition from "../components/PageTransition";

export default function Terminal() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(true);
  const [isIndicesOpen, setIsIndicesOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("1d");
  const [activeLeftTool, setActiveLeftTool] = useState("cursor");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    router.push('/');
  };

  const leftSidebarTools = [
    { id: "cursor", icon: Mouse, label: "Cursor" },
    { id: "crosshair", icon: Plus, label: "Crosshair" },
    { id: "line", icon: TrendingUp, label: "Trend Line" },
    { id: "horizontal", icon: Minus, label: "Horizontal Line" },
    { id: "ray", icon: Activity, label: "Ray" },
    { id: "arrow", icon: TrendingDown, label: "Arrow" },
    { id: "text", icon: Type, label: "Text" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "pen", icon: PenTool, label: "Drawing" },
    { id: "ruler", icon: Grid, label: "Ruler" },
    { id: "fibonacci", icon: BarChart3, label: "Fibonacci" },
    { id: "favorites", icon: Activity, label: "Favorites" },
    { id: "zoom", icon: Maximize2, label: "Zoom" },
    { id: "view", icon: Eye, label: "View" },
    { id: "lock", icon: Lock, label: "Lock" },
    { id: "delete", icon: Trash2, label: "Delete" },
  ];

  const intervals = ["5y", "1y", "3m", "1m", "5d", "1d"];
  const chartTypes = ["5m", "15m", "1h", "1d"];

  const watchlistStocks = [
    { name: "Adani Power", price: "₹162.20", change: "+0.10", percent: "(0.08%)", positive: true },
    { name: "Tata Motors", price: "₹945.30", change: "+12.50", percent: "(1.34%)", positive: true },
    { name: "Reliance", price: "₹2,456.70", change: "-23.40", percent: "(0.94%)", positive: false },
    { name: "HDFC Bank", price: "₹1,678.90", change: "+8.20", percent: "(0.49%)", positive: true },
    { name: "Infosys", price: "₹1,432.50", change: "-15.60", percent: "(1.08%)", positive: false },
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
      <div className={`flex flex-1 overflow-hidden transition-all duration-300 ${isIndicesOpen ? 'blur-[2px] brightness-50' : ''}`}>
        {/* Left Sidebar - Drawing Tools */}
        <div className="w-14 bg-white dark:bg-[#1A1D24] border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-2 space-y-1 overflow-y-auto scrollbar-hide">
          {leftSidebarTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveLeftTool(tool.id)}
              className={`p-1.5 rounded-md transition-colors ${
                activeLeftTool === tool.id
                  ? "bg-[#00D09C] text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1F2228]"
              }`}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col">
          {/* Chart Top Bar */}
          <div className="bg-white dark:bg-[#1A1D24] border-b border-gray-200 dark:border-gray-800 px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Stock Info */}
              <div className="flex items-center space-x-3">
                <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228]">
                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-[#44475B] dark:text-white">ADANI POWER</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">5 • NSE</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-[#44475B] dark:text-white">O 127.23</span>
                    <span className="text-[#44475B] dark:text-white">H 127.23</span>
                    <span className="text-[#44475B] dark:text-white">L 126.22</span>
                    <span className="text-red-500">C 126.35 -0.82 (-0.64%)</span>
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

              {/* Indicators Button */}
              <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-[#44475B] dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-[#1F2228]">
                <Activity className="w-3.5 h-3.5" />
                <span>Indicators</span>
              </button>

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
          <div className="flex-1 bg-white dark:bg-[#1A1D24] relative">
            {/* Placeholder for Chart */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Chart will be displayed here</p>
                <p className="text-xs mt-2">Requires live data integration</p>
              </div>
            </div>
          </div>

          {/* Bottom Timeframe Bar */}
          <div className="bg-white dark:bg-[#1A1D24] border-t border-gray-200 dark:border-gray-800 px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {intervals.map((interval) => (
                <button
                  key={interval}
                  onClick={() => setSelectedInterval(interval)}
                  className={`px-2.5 py-0.5 text-xs rounded transition-colors ${
                    selectedInterval === interval
                      ? "bg-[#00D09C] text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1F2228]"
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
              <span>14:51:50 (UTC+5:30)</span>
              <button className="hover:text-[#00D09C]">%</button>
              <button className="hover:text-[#00D09C]">log</button>
              <button className="text-[#00D09C]">auto</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Watchlist */}
        {isWatchlistOpen && (
          <div className="w-80 bg-white dark:bg-[#1A1D24] border-l border-gray-200 dark:border-gray-800 flex flex-col relative">
            {/* Watchlist Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-[#44475B] dark:text-white">My Watchlist</h3>
                <button className="text-[#00D09C] hover:text-[#00B386]">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center bg-[#F8F9FA] dark:bg-[#1F2228] rounded-md px-2.5 py-1.5">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search & add"
                  className="bg-transparent border-none outline-none ml-2 text-xs text-[#44475B] dark:text-gray-300 placeholder-gray-400 w-full"
                />
              </div>
            </div>

            {/* Watchlist Items */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-2.5">
                <div className="flex items-center justify-between mb-2 text-[10px] text-gray-500 dark:text-gray-400">
                  <span>Company</span>
                  <span>Market price</span>
                </div>
                {watchlistStocks.map((stock, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1F2228] cursor-pointer px-2 -mx-2 rounded"
                  >
                    <div>
                      <div className="text-xs font-medium text-[#44475B] dark:text-white">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-[#44475B] dark:text-white">{stock.price}</div>
                      <div className={`text-[10px] ${stock.positive ? 'text-[#00D09C]' : 'text-red-500'}`}>
                        {stock.change} {stock.percent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Watchlist Bottom Tabs */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-2 space-y-1">
              <button className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#44475B] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2228] rounded">
                <span>Positions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#44475B] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2228] rounded">
                <span>Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Far Right Vertical Sidebar - Additional Tools */}
        <div className="w-20 bg-white dark:bg-[#1A1D24] border-l border-gray-200 dark:border-gray-800 flex flex-col items-center py-3 space-y-3 overflow-y-auto scrollbar-hide">
          <button 
            onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
            className={`flex flex-col items-center space-y-0.5 p-1.5 rounded-md transition-colors ${
              isWatchlistOpen 
                ? "text-[#00D09C]" 
                : "text-gray-600 dark:text-gray-400 hover:text-[#00D09C]"
            }`}
          >
            <List className="w-4 h-4" />
            <span className="text-[8px]">Watchlist</span>
          </button>

          <button className="flex flex-col items-center space-y-0.5 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-[#00D09C] transition-colors">
            <Circle className="w-4 h-4" />
            <span className="text-[8px]">Positions</span>
          </button>

          <button className="flex flex-col items-center space-y-0.5 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-[#00D09C] transition-colors">
            <FileBarChart className="w-4 h-4" />
            <span className="text-[8px]">Orders</span>
          </button>

          <button className="flex flex-col items-center space-y-0.5 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-[#00D09C] transition-colors">
            <Activity className="w-4 h-4" />
            <span className="text-[8px]">Chain</span>
          </button>

          <button className="flex flex-col items-center space-y-0.5 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-[#00D09C] transition-colors">
            <BarChart3 className="w-4 h-4" />
            <span className="text-[8px]">Depth</span>
          </button>

          <button className="flex flex-col items-center space-y-0.5 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-[#00D09C] transition-colors">
            <Grid className="w-4 h-4" />
            <span className="text-[8px]">Holdings</span>
          </button>

          <button className="flex flex-col items-center space-y-0.5 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-[#00D09C] transition-colors">
            <CreditCard className="w-4 h-4" />
            <span className="text-[8px]">Balance</span>
          </button>

          <div className="flex-1"></div>

          <button className="flex flex-col items-center space-y-0.5 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-[#00D09C] transition-colors">
            <Maximize2 className="w-4 h-4" />
            <span className="text-[8px]">Layout</span>
          </button>
        </div>
      </div>

      {/* All Indices Sidebar Modal */}
      <>
        {isIndicesOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40 transition-all duration-300"
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
            <div className="flex-1 overflow-y-auto p-4">
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
      </>
    </div>
    </PageTransition>
  );
}
