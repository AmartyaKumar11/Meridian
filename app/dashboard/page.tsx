"use client";

import { Bell, Search, User, TrendingUp, TrendingDown, Bookmark, BarChart3, FileText, Target, Zap, Wallet, Calendar, Filter, Lightbulb, Truck, Flame, Wheat, Briefcase, Laptop } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left - Logo and Main Nav */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-[#00D09C] to-[#00B386] rounded-full"></div>
                <span className="text-base font-semibold text-[#44475B]">Stocks</span>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-xs">
                <a href="#" className="text-[#44475B] hover:text-black">F&O</a>
                <a href="#" className="text-[#44475B] hover:text-black">Mutual Funds</a>
              </div>
            </div>

            {/* Right - Search, Terminal, Trade, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[#F8F9FA] rounded-md px-3 py-1.5 w-56">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Groww..."
                  className="bg-transparent border-none outline-none ml-2 text-xs text-[#44475B] placeholder-gray-400 w-full"
                />
                <span className="text-[10px] text-gray-400">Ctrl+K</span>
              </div>
              <button className="flex items-center space-x-1 text-xs text-[#44475B] hover:text-black">
                <span>Terminal</span>
              </button>
              <button className="text-xs text-[#44475B] hover:text-black">915.trade</button>
              <Bell className="w-4 h-4 text-gray-600 cursor-pointer" />
              <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-full cursor-pointer"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[52px] z-40">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center space-x-8 text-xs">
            <button className="py-2.5 border-b-2 border-[#00B386] text-[#00B386] font-medium">Explore</button>
            <button className="py-2.5 text-[#7C7E8C] hover:text-[#44475B]">Holdings</button>
            <button className="py-2.5 text-[#7C7E8C] hover:text-[#44475B]">Positions</button>
            <button className="py-2.5 text-[#7C7E8C] hover:text-[#44475B]">Orders</button>
            <button className="py-2.5 text-[#7C7E8C] hover:text-[#44475B]">Watchlist</button>
          </div>
        </div>
      </div>

      {/* Market Indices Ticker */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[96px] z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-2">
          <div className="flex items-center space-x-8 text-xs overflow-x-auto">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-[#44475B] font-medium">NIFTY</span>
              <span className="text-[#44475B]">26,053.90</span>
              <span className="text-green-600">117.70 (0.45%)</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-[#44475B] font-medium">SENSEX</span>
              <span className="text-[#44475B]">84,997.13</span>
              <span className="text-green-600">368.97 (0.44%)</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-[#44475B] font-medium">BANKNIFTY</span>
              <span className="text-[#44475B]">58,385.25</span>
              <span className="text-green-600">171.15 (0.29%)</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-[#44475B] font-medium">MIDCPNIFTY</span>
              <span className="text-[#44475B]">13,430.75</span>
              <span className="text-green-600">64.55 (0.48%)</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-[#44475B] font-medium">FINNIFTY</span>
              <span className="text-[#44475B]">27,587</span>
              <span className="text-green-600">82.35 (0.30%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Most Bought Stocks */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Most bought stocks on Groww</h2>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "Adani Power", price: "162.10", change: "-0.23 (0.14%)", logo: "adani", isNegative: true },
                  { name: "Five Star Business", price: "605.05", change: "68.00 (12.66%)", logo: "fivestar", isNegative: false },
                  { name: "Vodafone Idea", price: "9.36", change: "-0.08 (0.85%)", logo: "vodafone", isNegative: true },
                  { name: "Coal India", price: "382.00", change: "-9.40 (2.40%)", logo: "coal", isNegative: true },
                ].map((stock, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-semibold text-[#44475B]">{stock.logo.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <Bookmark className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-xs font-medium text-[#44475B] mb-1">{stock.name}</div>
                    <div className="text-base font-semibold text-[#44475B] mb-0.5">₹{stock.price}</div>
                    <div className={`text-xs ${stock.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                      {stock.change}
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-[#00B386] text-xs font-medium mt-3 hover:text-[#009970]">See more →</button>
            </div>

            {/* Top Market Movers */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Top market movers</h2>
              <div className="flex items-center space-x-3 mb-4">
                <button className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-[#44475B]">Gainers</button>
                <button className="px-3 py-1.5 text-xs text-[#7C7E8C] hover:bg-gray-50 rounded-full">Losers</button>
                <button className="px-3 py-1.5 text-xs text-[#7C7E8C] hover:bg-gray-50 rounded-full">Volume shockers</button>
                <button className="px-3 py-1.5 text-xs text-[#7C7E8C] hover:bg-gray-50 rounded-full border border-gray-300">NIFTY 100 ▼</button>
              </div>
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-4 text-xs text-[#7C7E8C] pb-2 border-b">
                  <div className="col-span-5">Company</div>
                  <div className="col-span-1"></div>
                  <div className="col-span-3 text-right">Market price (1D)</div>
                  <div className="col-span-3 text-right">Volume</div>
                </div>
                {[
                  { name: "Adani Green Energy", price: "1,112.60", change: "108.40 (10.79%)", volume: "-", chart: "up", isNegative: false },
                  { name: "Varun Beverages", price: "495.45", change: "41.30 (9.09%)", volume: "4,45,67,490", chart: "up", isNegative: false },
                  { name: "IOCL", price: "163.09", change: "-12.45 (7.10%)", volume: "5,84,49,093", chart: "down", isNegative: true },
                  { name: "Adani Energy Solut.", price: "967.55", change: "46.35 (5.03%)", volume: "62,02,463", chart: "up", isNegative: false },
                  { name: "RECL", price: "385.55", change: "-8.20 (2.08%)", volume: "1,36,97,186", chart: "down", isNegative: true },
                  { name: "CG Power & Inds", price: "748.60", change: "26.10 (3.61%)", volume: "60,67,360", chart: "up", isNegative: false },
                ].map((stock, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 items-center py-2.5 hover:bg-gray-50 cursor-pointer">
                    <div className="col-span-5 flex items-center space-x-2">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-semibold text-[#44475B]">{stock.name.slice(0, 2)}</span>
                      </div>
                      <span className="text-xs text-[#44475B]">{stock.name}</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="w-14 h-7">
                        <svg viewBox="0 0 60 30" className="w-full h-full">
                          {stock.chart === "up" ? (
                            <path d="M 0 25 Q 15 20 30 15 T 60 5" fill="none" stroke="#00B386" strokeWidth="2"/>
                          ) : (
                            <path d="M 0 5 Q 15 10 30 15 T 60 25" fill="none" stroke="#ef4444" strokeWidth="2"/>
                          )}
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      <div className="text-xs text-[#44475B]">₹{stock.price}</div>
                      <div className={`text-[10px] ${stock.isNegative ? 'text-red-600' : 'text-green-600'}`}>{stock.change}</div>
                    </div>
                    <div className="col-span-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-[#44475B]">{stock.volume}</span>
                        <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                        <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-[#00B386] text-xs font-medium mt-3 hover:text-[#009970]">See more →</button>
            </div>

            {/* Most Traded Stocks in MTF */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Most traded stocks in MTF</h2>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "Five Star Business", price: "605.05", change: "68.00 (12.66%)", isNegative: false },
                  { name: "Adani Power", price: "162.10", change: "-0.23 (0.14%)", isNegative: true },
                  { name: "Netweb Technologies", price: "3,924.20", change: "-282.60 (6.72%)", isNegative: true },
                  { name: "SILVERBEES", price: "141.13", change: "7.32 (5.47%)", isNegative: false },
                ].map((stock, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-[#44475B]">{stock.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="text-xs font-medium text-[#44475B] mb-1">{stock.name}</div>
                    <div className="text-base font-semibold text-[#44475B] mb-0.5">₹{stock.price}</div>
                    <div className={`text-xs ${stock.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                      {stock.change}
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-[#00B386] text-xs font-medium mt-3 hover:text-[#009970]">See more →</button>
            </div>

            {/* Top Intraday Stocks */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Top intraday stocks</h2>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "Adani Power", price: "162.10", change: "-0.23 (0.14%)", isNegative: true },
                  { name: "Tata Motors", price: "780.45", change: "12.35 (1.61%)", isNegative: false },
                  { name: "Reliance Ind.", price: "2,850.20", change: "45.80 (1.63%)", isNegative: false },
                  { name: "HDFC Bank", price: "1,645.75", change: "-8.25 (0.50%)", isNegative: true },
                ].map((stock, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-[#44475B]">{stock.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="text-xs font-medium text-[#44475B] mb-1">{stock.name}</div>
                    <div className="text-base font-semibold text-[#44475B] mb-0.5">₹{stock.price}</div>
                    <div className={`text-xs ${stock.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                      {stock.change}
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-[#00B386] text-xs font-medium mt-3 hover:text-[#009970]">See more →</button>
            </div>

            {/* Sectors Trending Today */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Sectors trending today</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-xs text-[#7C7E8C] pb-2 border-b">
                  <div className="col-span-3">Sector</div>
                  <div className="col-span-6">Gainers/Losers</div>
                  <div className="col-span-3 text-right">1D price change</div>
                </div>
                {[
                  { name: "Power", icon: Lightbulb, gainers: 25, losers: 10, change: "+2.65%", isNegative: false, color: "text-yellow-600" },
                  { name: "Logistics", icon: Truck, gainers: 41, losers: 26, change: "+2.65%", isNegative: false, color: "text-blue-600" },
                  { name: "Gas Distribution", icon: Flame, gainers: 9, losers: 1, change: "+2.32%", isNegative: false, color: "text-orange-600" },
                  { name: "Edible Oil", icon: Wheat, gainers: 14, losers: 10, change: "-1.85%", isNegative: true, color: "text-amber-600" },
                  { name: "Brokers", icon: Briefcase, gainers: 27, losers: 21, change: "-4.33%", isNegative: true, color: "text-purple-600" },
                  { name: "IT - Hardware", icon: Laptop, gainers: 7, losers: 6, change: "-5.22%", isNegative: true, color: "text-gray-600" },
                ].map((sector, idx) => {
                  const IconComponent = sector.icon;
                  return (
                    <div key={idx} className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-gray-50 cursor-pointer">
                      <div className="col-span-3 flex items-center space-x-2">
                        <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ${sector.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-[#44475B]">{sector.name}</span>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-[#44475B]">{sector.gainers}</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                            <div 
                              className="bg-green-500 h-full" 
                              style={{ width: `${(sector.gainers / (sector.gainers + sector.losers)) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-red-500 h-full" 
                              style={{ width: `${(sector.losers / (sector.gainers + sector.losers)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-[#44475B]">{sector.losers}</span>
                        </div>
                      </div>
                      <div className={`col-span-3 text-right text-xs font-medium ${sector.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                        {sector.change}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="text-[#00B386] text-xs font-medium mt-3 hover:text-[#009970]">See all sectors →</button>
            </div>

            {/* ETFs by Groww */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">ETFs by Meridian</h2>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "Meridian Nifty Midcap 15...", price: "-", status: "NFO", statusText: "Open now", isOpen: true },
                  { name: "Meridian Gold ETF", price: "118.48", change: "4.49 (3.94%)", isOpen: false },
                  { name: "Meridian Silver ETF", price: "146.29", change: "9.49 (6.94%)", isOpen: false },
                  { name: "Meridian Nifty Smallcap 2...", price: "-", status: "NFO", statusText: "Closed", isOpen: false },
                ].map((etf, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00D09C] to-[#00B386] rounded-full flex items-center justify-center mb-2">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div className="text-xs font-medium text-[#44475B] mb-2">{etf.name}</div>
                    {etf.status ? (
                      <>
                        <div className="text-xs text-[#7C7E8C] mb-1">{etf.status}</div>
                        <div className={`text-xs ${etf.isOpen ? 'text-[#00B386]' : 'text-[#7C7E8C]'}`}>
                          {etf.statusText}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-base font-semibold text-[#44475B] mb-0.5">₹{etf.price}</div>
                        <div className="text-xs text-green-600">{etf.change}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <button className="text-[#00B386] text-xs font-medium mt-3 hover:text-[#009970]">See all ETFs →</button>
            </div>

            {/* Stocks in News Today */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Stocks in news today</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { 
                    name: "Bharat Heavy Electricals", 
                    logo: "BHEL",
                    change: "+3.39%", 
                    isNegative: false,
                    news: "New Delhi, Oct 29 (PTI) State-owned Bharat Heavy Electricals Ltd (BHEL) on Wednesday said its consolidat...",
                    source: "News18",
                    time: "3 hours"
                  },
                  { 
                    name: "Mahindra & Mahindra", 
                    logo: "M&M",
                    change: "-1.24%", 
                    isNegative: true,
                    news: "Mahindra & Mahindra and Samsung have collaborated to develop digital keys for electric SUVs, integrated with...",
                    source: "Business Standard",
                    time: "3 hours"
                  },
                  { 
                    name: "Hero MotoCorp", 
                    logo: "HERO",
                    change: "-1.03%", 
                    isNegative: true,
                    news: "Two-wheeler major Hero MotoCorp on Wednesday said it has entered France in partnership with GD France and...",
                    source: "The Hindu BusinessLine",
                    time: "3 hours"
                  },
                  { 
                    name: "Larsen & Toubro", 
                    logo: "L&T",
                    change: "-0.37%", 
                    isNegative: true,
                    news: "Infrastructure major Larsen & Toubro Ltd (L&T) on Wednesday (October 29) reported a 15.6% year-on-year...",
                    source: "CNBC TV18",
                    time: "4 hours"
                  },
                ].map((stock, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-[#44475B]">{stock.logo}</span>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#44475B]">{stock.name}</div>
                          <div className={`text-xs ${stock.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                            {stock.change}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#7C7E8C] leading-relaxed mb-2 line-clamp-2">{stock.news}</p>
                    <div className="text-[10px] text-[#7C7E8C]">{stock.source} · {stock.time}</div>
                  </div>
                ))}
              </div>
              <button className="text-[#00B386] text-xs font-medium mt-3 hover:text-[#009970]">See more news →</button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-6 sticky top-[135px] self-start">
            {/* Your Investments */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Your investments</h2>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-green-50 rounded-full mb-3 flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-[#00B386]" />
                </div>
                <p className="text-xs text-[#7C7E8C] text-center">You haven't invested yet</p>
              </div>
            </div>

            {/* Products & Tools */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Products & Tools</h2>
              <div className="space-y-2">
                {[
                  { name: "IPO", status: "6 open", icon: TrendingUp, color: "text-blue-600" },
                  { name: "Bonds", status: "1 open", icon: FileText, color: "text-purple-600" },
                  { name: "ETF Screener", status: "", icon: Filter, color: "text-orange-600" },
                  { name: "Intraday Screener", status: "", icon: Zap, color: "text-yellow-600" },
                  { name: "MTF stocks", status: "", icon: Wallet, color: "text-green-600" },
                  { name: "Events calendar", status: "", icon: Calendar, color: "text-red-600" },
                  { name: "All Stocks screener", status: "", icon: Target, color: "text-indigo-600" },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between py-2 hover:bg-gray-50 cursor-pointer rounded-lg px-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ${item.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-[#44475B]">{item.name}</span>
                      </div>
                      {item.status && (
                        <span className="text-[10px] text-[#00B386] font-medium">{item.status}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trading Screens */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Trading Screens</h2>
              <div className="space-y-2">
                {[
                  { name: "Resistance breakouts", type: "Bullish", color: "green" },
                  { name: "MACD above signal line", type: "Bullish", color: "green" },
                  { name: "RSI overbought", type: "Bearish", color: "red" },
                  { name: "RSI oversold", type: "Bullish", color: "green" },
                ].map((screen, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 hover:bg-gray-50 cursor-pointer rounded-lg px-2">
                    <div>
                      <div className={`text-[10px] ${screen.color === 'green' ? 'text-green-600' : 'text-red-600'} font-medium mb-0.5`}>
                        {screen.type}
                      </div>
                      <div className="text-xs text-[#44475B]">{screen.name}</div>
                    </div>
                    <div className="w-14 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
                      {screen.color === 'green' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8 mb-8">
            {/* Left Column - Logo and Address */}
            <div className="col-span-3">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00D09C] to-[#00B386] rounded-full"></div>
                <span className="text-lg font-semibold text-[#44475B]">Meridian</span>
              </div>
              <div className="text-xs text-[#7C7E8C] mb-4 leading-relaxed">
                <p>Vaishnavi Tech Park, South Tower, 3rd Floor</p>
                <p>Sarjapur Main Road, Bellandur, Bengaluru – 560103</p>
                <p>Karnataka</p>
              </div>
              <div className="space-y-2">
                <button className="text-xs text-[#00B386] hover:text-[#009970] underline">Contact Us</button>
                <div className="flex items-center space-x-3 text-[#7C7E8C]">
                  <a href="#" className="hover:text-[#44475B]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#44475B]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#44475B]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#44475B]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#" className="hover:text-[#44475B]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Download App */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold text-[#44475B] mb-3">Download the App</h3>
              <div className="flex space-x-2">
                <a href="#" className="hover:opacity-80">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                </a>
                <a href="#" className="hover:opacity-80">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                </a>
              </div>
            </div>

            {/* GROWW */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold text-[#44475B] mb-3">MERIDIAN</h3>
              <div className="space-y-2">
                {["About Us", "Pricing", "Blog", "Media & Press", "Careers", "Help & Support", "Trust & Safety", "Investor Relations"].map((item, idx) => (
                  <a key={idx} href="#" className="block text-xs text-[#7C7E8C] hover:text-[#44475B]">{item}</a>
                ))}
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold text-[#44475B] mb-3">PRODUCTS</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {["Stocks", "F&O", "MTF", "ETF", "IPO", "Mutual Funds", "Commodities", "Meridian Terminal", "915 Terminal", "Stocks Screener", "Algo Trading", "Meridian Digest", "Demat Account", "Meridian AMC"].map((item, idx) => (
                  <a key={idx} href="#" className="text-xs text-[#7C7E8C] hover:text-[#44475B]">{item}</a>
                ))}
              </div>
            </div>

            {/* Quick Links - Empty for now */}
            <div className="col-span-3">
              <div className="text-right">
                <div className="text-[10px] text-[#7C7E8C]">Version: 6.7.8</div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-6 text-xs text-[#44475B] mb-6">
              <button className="border-b-2 border-[#00B386] pb-2">Share Market</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">Indices</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">F&O</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">Mutual Funds</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">ETFs</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">Funds By Groww</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">Calculators</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">IPO</button>
              <button className="text-[#7C7E8C] hover:text-[#44475B]">Miscellaneous</button>
            </div>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[
                ["Top Gainers Stocks", "52 Weeks High Stocks", "Tata Motors"],
                ["Top Losers Stocks", "52 Weeks Low Stocks", "IREDA"],
                ["Most Traded Stocks", "Stocks Market Calender", "Tata Steel"],
                ["Stocks Feed", "Suzlon Energy", "Zomato (Eternal)"],
                ["FII DII Activity", "IRFC", "Bharat Electronics"]
              ].map((column, colIdx) => (
                <div key={colIdx} className="space-y-2">
                  {column.map((item, idx) => (
                    <a key={idx} href="#" className="block text-xs text-[#7C7E8C] hover:text-[#44475B]">{item}</a>
                  ))}
                </div>
              ))}
            </div>

            <div className="text-xs text-[#7C7E8C]">
              © 2016-2025 Meridian. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
