"use client";

import { Bell, Search, TrendingUp, TrendingDown, Filter, BarChart3, Target, Zap, CreditCard, FileBarChart, Headphones, Sun, LogOut, FileText, Moon } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

export default function FOPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0C0E12] transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-[#1A1D24]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left - Logo and Main Nav */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-[#00D09C] to-[#00B386] rounded-full"></div>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-xs">
                <a href="/dashboard" className="text-[#7C7E8C] hover:text-black">Stocks</a>
                <a href="/fo" className="text-black font-medium">F&O</a>
                <a href="/mutual-funds" className="text-[#7C7E8C] hover:text-black">Mutual Funds</a>
              </div>
            </div>

            {/* Right - Search, Terminal, Trade, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[#F8F9FA] dark:bg-[#1F2228] rounded-md px-3 py-1.5 w-56">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Groww..."
                  className="bg-transparent border-none outline-none ml-2 text-xs text-[#44475B] dark:text-gray-300 placeholder-gray-400 w-full"
                />
                <span className="text-[10px] text-gray-400">Ctrl+K</span>
              </div>
              <button 
                onClick={() => router.push('/terminal')}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs text-[#44475B] hover:text-black border border-gray-300 rounded-md hover:border-gray-400"
              >
                <span>Terminal</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-[#44475B] hover:text-black border border-gray-300 rounded-md hover:border-gray-400">
                <span>915.trade</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <Bell className="w-4 h-4 text-gray-600 cursor-pointer" />
              <div className="relative">
                <div 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-full cursor-pointer"
                ></div>
                
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                      {/* Profile Header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-[#44475B]">Amartya Kumar</h3>
                            <p className="text-xs text-[#7C7E8C]">kumaramartya11@gmail.com</p>
                          </div>
                          <button className="text-gray-400 hover:text-[#44475B]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-5 h-5 text-[#7C7E8C] group-hover:text-[#44475B]" />
                            <div>
                              <div className="text-xs font-medium text-[#44475B]">₹0.00</div>
                              <div className="text-[10px] text-[#7C7E8C]">Stocks, F&O balance</div>
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <FileBarChart className="w-5 h-5 text-[#7C7E8C] group-hover:text-[#44475B]" />
                            <span className="text-xs text-[#44475B]">All Orders</span>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-[#7C7E8C] group-hover:text-[#44475B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span className="text-xs text-[#44475B]">Bank Details</span>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <Headphones className="w-5 h-5 text-[#7C7E8C] group-hover:text-[#44475B]" />
                            <span className="text-xs text-[#44475B]">24 x 7 Customer Support</span>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-[#7C7E8C] group-hover:text-[#44475B]" />
                            <span className="text-xs text-[#44475B]">Reports</span>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-200 p-4">
                        <button 
                          onClick={toggleTheme}
                          className="w-full flex items-center justify-between text-xs text-[#44475B] hover:text-[#00B386] mb-2"
                        >
                          <div className="flex items-center space-x-2">
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            <span>Theme</span>
                          </div>
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-between text-xs text-red-600 hover:text-red-700"
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="underline">Log out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[52px] z-40">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center space-x-8 text-xs">
            <button className="py-2.5 border-b-2 border-[#00B386] text-[#00B386] font-medium">Explore</button>
            <button className="py-2.5 text-[#7C7E8C] hover:text-[#44475B]">Positions</button>
            <button className="py-2.5 text-[#7C7E8C] hover:text-[#44475B]">Orders</button>
          </div>
        </div>
      </div>

      {/* Market Indices Ticker */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[96px] z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-2">
          <div className="flex items-center space-x-8 text-xs overflow-x-auto">
            {[
              { name: "NIFTY", price: "26,053.90", change: "117.70 (0.45%)", isPositive: true },
              { name: "SENSEX", price: "84,997.13", change: "368.97 (0.44%)", isPositive: true },
              { name: "BANKNIFTY", price: "58,385.25", change: "171.15 (0.29%)", isPositive: true },
              { name: "MIDCPNIFTY", price: "13,430.75", change: "64.55 (0.48%)", isPositive: true },
              { name: "FINNIFTY", price: "27,587", change: "82.35 (0.30%)", isPositive: true },
            ].map((index, idx) => (
              <div key={idx} className="relative group flex items-center space-x-2 whitespace-nowrap">
                <span className="text-[#44475B] font-medium">{index.name}</span>
                <span className="text-[#44475B]">{index.price}</span>
                <span className={index.isPositive ? "text-green-600" : "text-red-600"}>{index.change}</span>
                
                {/* Hover Menu */}
                <div className="absolute top-full left-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 text-xs">
                    <button className="w-full px-4 py-2 text-left text-[#44475B] hover:bg-gray-50 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Option chain</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-[#44475B] hover:bg-gray-50 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Terminal</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Top Traded */}
            <div className="bg-white rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#44475B]">Top traded</h2>
                <button className="text-[#00B386] text-xs font-medium hover:text-[#009970]">See more</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "SENSEX", price: "84,997.13", change: "368.97 (+0.44%)", isNegative: false },
                  { name: "NIFTY 50", price: "26,053.90", change: "117.70 (+0.45%)", isNegative: false },
                  { name: "BANK NIFTY", price: "58,385.25", change: "171.15 (+0.29%)", isNegative: false },
                  { name: "BANKEX", price: "65,771.44", change: "219.40 (+0.33%)", isNegative: false },
                  { name: "Adani Green Energy", price: "₹1,112.60", change: "108.40 (+10.79%)", isNegative: false },
                  { name: "L&T", price: "₹3,958.10", change: "-14.70 (-0.37%)", isNegative: true },
                ].map((item, idx) => (
                  <div key={idx} className="relative group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium text-[#44475B]">{item.name}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    {/* Mini Chart */}
                    <div className="h-12 mb-3">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        {item.isNegative ? (
                          <>
                            <rect x="8" y="10" width="3" height="15" fill="#ef4444" opacity="0.3" />
                            <rect x="14" y="8" width="3" height="18" fill="#22c55e" opacity="0.3" />
                            <rect x="20" y="12" width="3" height="14" fill="#ef4444" opacity="0.3" />
                            <rect x="26" y="6" width="3" height="20" fill="#22c55e" opacity="0.3" />
                            <rect x="32" y="10" width="3" height="16" fill="#22c55e" opacity="0.3" />
                            <rect x="38" y="8" width="3" height="18" fill="#22c55e" opacity="0.3" />
                            <rect x="44" y="14" width="3" height="12" fill="#ef4444" opacity="0.3" />
                            <rect x="50" y="10" width="3" height="16" fill="#22c55e" opacity="0.3" />
                            <rect x="56" y="12" width="3" height="14" fill="#ef4444" opacity="0.3" />
                            <rect x="62" y="8" width="3" height="18" fill="#22c55e" opacity="0.3" />
                            <rect x="68" y="11" width="3" height="15" fill="#22c55e" opacity="0.3" />
                            <rect x="74" y="13" width="3" height="13" fill="#ef4444" opacity="0.3" />
                            <rect x="80" y="9" width="3" height="17" fill="#22c55e" opacity="0.3" />
                            <rect x="86" y="15" width="3" height="11" fill="#ef4444" opacity="0.3" />
                          </>
                        ) : (
                          <>
                            <rect x="8" y="20" width="3" height="10" fill="#ef4444" opacity="0.3" />
                            <rect x="14" y="18" width="3" height="12" fill="#22c55e" opacity="0.3" />
                            <rect x="20" y="22" width="3" height="8" fill="#ef4444" opacity="0.3" />
                            <rect x="26" y="16" width="3" height="14" fill="#22c55e" opacity="0.3" />
                            <rect x="32" y="14" width="3" height="16" fill="#22c55e" opacity="0.3" />
                            <rect x="38" y="12" width="3" height="18" fill="#22c55e" opacity="0.3" />
                            <rect x="44" y="10" width="3" height="20" fill="#22c55e" opacity="0.3" />
                            <rect x="50" y="8" width="3" height="22" fill="#22c55e" opacity="0.3" />
                            <rect x="56" y="6" width="3" height="24" fill="#22c55e" opacity="0.3" />
                            <rect x="62" y="8" width="3" height="22" fill="#22c55e" opacity="0.3" />
                            <rect x="68" y="10" width="3" height="20" fill="#22c55e" opacity="0.3" />
                            <rect x="74" y="12" width="3" height="18" fill="#22c55e" opacity="0.3" />
                            <rect x="80" y="10" width="3" height="20" fill="#22c55e" opacity="0.3" />
                            <rect x="86" y="14" width="3" height="16" fill="#22c55e" opacity="0.3" />
                          </>
                        )}
                      </svg>
                    </div>
                    <div className="text-base font-semibold text-[#44475B] mb-0.5">{item.price}</div>
                    <div className={`text-xs ${item.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                      {item.change}
                    </div>

                    {/* Hover Menu */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 text-xs">
                        <button className="w-full px-4 py-2 text-left text-[#44475B] hover:bg-gray-50 flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span>Option chain</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-[#44475B] hover:bg-gray-50 flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Terminal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* F&O Stocks */}
            <div className="bg-white rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#44475B]">F&O Stocks</h2>
                <button className="text-[#00B386] text-xs font-medium hover:text-[#009970]">See more</button>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <button className="px-3 py-1.5 bg-white rounded-full text-xs border border-gray-300 text-[#44475B]">
                  1 day ▼
                </button>
                <button className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-[#44475B]">Gainers</button>
                <button className="px-3 py-1.5 text-xs text-[#7C7E8C] hover:bg-gray-50 rounded-full">Losers</button>
              </div>
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-4 text-xs text-[#7C7E8C] pb-2 border-b">
                  <div className="col-span-6">Stocks</div>
                  <div className="col-span-3 text-right">Price</div>
                  <div className="col-span-2 text-right">1D Change</div>
                  <div className="col-span-1 text-right">Volume</div>
                </div>
                {[
                  { name: "Adani Green Energy", logo: "adani", price: "₹1,112.60", change: "108.40 (+10.79%)", volume: "3,62,32,727", isNegative: false },
                  { name: "Varun Beverages", logo: "VB", price: "₹495.45", change: "41.30 (+9.09%)", volume: "4,45,67,490", isNegative: false },
                  { name: "SAIL", logo: "SAIL", price: "₹140.55", change: "8.39 (+6.35%)", volume: "14,34,38,521", isNegative: false },
                  { name: "IOCL", logo: "IOCL", price: "₹163.09", change: "8.57 (+5.55%)", volume: "5,84,49,093", isNegative: false },
                  { name: "Adani Energy Solut.", logo: "adani", price: "₹967.55", change: "46.35 (+5.03%)", volume: "62,02,463", isNegative: false },
                ].map((stock, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 items-center py-2.5 hover:bg-gray-50 cursor-pointer">
                    <div className="col-span-6 flex items-center space-x-2">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-semibold text-[#44475B]">{stock.logo.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-xs text-[#44475B]">{stock.name}</span>
                    </div>
                    <div className="col-span-3 text-right text-xs text-[#44475B]">{stock.price}</div>
                    <div className={`col-span-2 text-right text-xs ${stock.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                      {stock.change}
                    </div>
                    <div className="col-span-1 text-right text-xs text-[#44475B]">{stock.volume}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Traded Index Futures */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Top traded index futures</h2>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "NIFTY 25 Nov Fut", price: "₹26,238.70", change: "0.00 (0.00%)", icon: "X", color: "orange" },
                  { name: "BANKNIFTY 25 Nov Fut", price: "₹58,766.00", change: "0.00 (0.00%)", icon: "M", color: "orange" },
                  { name: "NIFTY 30 Dec Fut", price: "₹26,411.20", change: "0.00 (0.00%)", icon: "X", color: "orange" },
                  { name: "MIDCPNIFTY 25 Nov Fut", price: "₹13,513.35", change: "0.00 (0.00%)", icon: "M", color: "orange" },
                ].map((future, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`w-10 h-10 bg-${future.color}-100 rounded-lg flex items-center justify-center mb-2`}>
                      <span className={`text-base font-bold text-${future.color}-600`}>{future.icon}</span>
                    </div>
                    <div className="text-xs font-medium text-[#44475B] mb-2">{future.name}</div>
                    <div className="text-base font-semibold text-[#44475B] mb-0.5">{future.price}</div>
                    <div className="text-xs text-[#7C7E8C]">{future.change}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Traded Stock Futures */}
            <div className="bg-white rounded-lg p-5">
              <h2 className="text-lg font-semibold text-[#44475B] mb-4">Top traded stock futures</h2>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "VBL 25 Nov Fut", logo: "VB", price: "₹498.65", change: "0.00 (0.00%)" },
                  { name: "ADANIGREEN 25 Nov Fut", logo: "adani", price: "₹1,118.80", change: "0.00 (0.00%)" },
                  { name: "COALINDIA 25 Nov Fut", logo: "CI", price: "₹383.60", change: "0.00 (0.00%)" },
                  { name: "VEDL 25 Nov Fut", logo: "VE", price: "₹518.55", change: "0.00 (0.00%)" },
                ].map((future, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-xs font-semibold text-[#44475B]">{future.logo.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="text-xs font-medium text-[#44475B] mb-2">{future.name}</div>
                    <div className="text-base font-semibold text-[#44475B] mb-0.5">{future.price}</div>
                    <div className="text-xs text-[#7C7E8C]">{future.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-6 sticky top-[135px] self-start">
            {/* Unlock F&O */}
            <div className="bg-white rounded-lg p-5">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-full mb-4 flex items-center justify-center border-4 border-green-200">
                  <TrendingUp className="w-12 h-12 text-[#00B386]" />
                </div>
                <h3 className="text-base font-semibold text-[#44475B] mb-2 text-center">Unlock Futures & Options</h3>
                <p className="text-xs text-[#7C7E8C] text-center mb-4">Start trading Futures and Options</p>
                <button className="w-full bg-[#00B386] text-white text-xs font-medium py-2.5 rounded-lg hover:bg-[#009970] transition-colors">
                  PROCEED TO UNLOCK
                </button>
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

            {/* MERIDIAN */}
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
              <button className="text-[#7C7E8C] hover:text-[#44475B]">Funds By Meridian</button>
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
    </PageTransition>
  );
}
