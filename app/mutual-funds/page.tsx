"use client";

import { Bell, Search, User, TrendingUp, TrendingDown, ChevronRight, Star, Filter, Sun, Moon, LogOut } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

export default function MutualFunds() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    router.push('/');
  };

  const collections = [
    {
      title: "Better Than FD",
      subtitle: "Low risk mutual funds",
      returns: "7-9%",
      risk: "Low Risk",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Top 100",
      subtitle: "Hand-picked funds",
      returns: "12-15%",
      risk: "Moderate Risk",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Tax Saver",
      subtitle: "Save tax, earn returns",
      returns: "10-13%",
      risk: "Moderate Risk",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "New Launches",
      subtitle: "Latest funds",
      returns: "Market Linked",
      risk: "Moderate Risk",
      color: "from-orange-500 to-red-500"
    }
  ];

  const topFunds = [
    {
      name: "Parag Parikh Flexi Cap Fund",
      category: "Equity - Flexi Cap",
      returns1Y: "42.3%",
      returns3Y: "28.5%",
      returns5Y: "25.2%",
      minInvestment: "₹100",
      rating: 5
    },
    {
      name: "Axis Bluechip Fund",
      category: "Equity - Large Cap",
      returns1Y: "38.7%",
      returns3Y: "22.4%",
      returns5Y: "18.9%",
      minInvestment: "₹100",
      rating: 4
    },
    {
      name: "Mirae Asset Large Cap Fund",
      category: "Equity - Large Cap",
      returns1Y: "35.2%",
      returns3Y: "20.8%",
      returns5Y: "17.5%",
      minInvestment: "₹100",
      rating: 5
    },
    {
      name: "ICICI Prudential Bluechip Fund",
      category: "Equity - Large Cap",
      returns1Y: "33.8%",
      returns3Y: "19.6%",
      returns5Y: "16.3%",
      minInvestment: "₹100",
      rating: 4
    },
    {
      name: "SBI Bluechip Fund",
      category: "Equity - Large Cap",
      returns1Y: "32.5%",
      returns3Y: "18.7%",
      returns5Y: "15.8%",
      minInvestment: "₹100",
      rating: 4
    },
    {
      name: "Kotak Flexicap Fund",
      category: "Equity - Flexi Cap",
      returns1Y: "40.2%",
      returns3Y: "24.3%",
      returns5Y: "21.5%",
      minInvestment: "₹100",
      rating: 5
    }
  ];

  const categories = [
    { name: "All", count: 1500 },
    { name: "Equity", count: 450 },
    { name: "Debt", count: 320 },
    { name: "Hybrid", count: 180 },
    { name: "Index Funds", count: 95 },
    { name: "Tax Saver (ELSS)", count: 42 }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

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
                <a href="/dashboard" className="text-[#7C7E8C] dark:text-gray-400 hover:text-black dark:hover:text-white">Stocks</a>
                <a href="/fo" className="text-[#7C7E8C] dark:text-gray-400 hover:text-black dark:hover:text-white">F&O</a>
                <a href="/mutual-funds" className="text-black dark:text-white font-medium">Mutual Funds</a>
              </div>
            </div>

            {/* Right - Search, Terminal, Trade, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[#F8F9FA] dark:bg-[#1F2228] rounded-md px-3 py-1.5 w-56">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search funds..."
                  className="bg-transparent border-none outline-none ml-2 text-xs text-[#44475B] dark:text-gray-300 placeholder-gray-400 w-full"
                />
              </div>
              <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-[#44475B] dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-md hover:border-gray-400 dark:hover:border-gray-600">
                <span>Terminal</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-[#44475B] dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-md hover:border-gray-400 dark:hover:border-gray-600">
                <span>915.trade</span>
              </button>
              <button className="p-2 text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded-md">
                <Bell className="w-4 h-4" />
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228] rounded-md"
                >
                  <User className="w-4 h-4" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1A1D24] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <div className="text-sm font-medium text-[#44475B] dark:text-gray-200">Amartya Kumar</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">kumaramartya11@gmail.com</div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">Available Balance: <span className="font-medium">₹0.00</span></div>
                    </div>
                    
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-xs text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228]">All Orders</a>
                      <a href="#" className="block px-4 py-2 text-xs text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228]">Bank Details</a>
                      <a href="#" className="block px-4 py-2 text-xs text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228]">24x7 Support</a>
                      <a href="#" className="block px-4 py-2 text-xs text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228]">Reports</a>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-1">
                      <button 
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228]"
                      >
                        <span>Theme</span>
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#1F2228]"
                      >
                        <span>Logout</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#44475B] dark:text-white mb-2">Explore Mutual Funds</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Invest in hand-picked mutual funds curated by experts</p>
        </div>

        {/* Collections Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-[#44475B] dark:text-white mb-4">Popular Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((collection, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-[#1A1D24] rounded-xl p-5 cursor-pointer hover:shadow-lg dark:hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${collection.color} mb-4 group-hover:scale-110 transition-transform`}></div>
                <h3 className="text-base font-semibold text-[#44475B] dark:text-white mb-1">{collection.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{collection.subtitle}</p>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[#00D09C] font-medium">{collection.returns}</div>
                    <div className="text-gray-500 dark:text-gray-400">{collection.risk}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00D09C] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.name
                    ? "bg-[#00D09C] text-white"
                    : "bg-white dark:bg-[#1A1D24] text-[#44475B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F2228] border border-gray-200 dark:border-gray-800"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Top Funds Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#44475B] dark:text-white">Top Rated Funds</h2>
            <button className="flex items-center space-x-2 text-xs text-[#00D09C] hover:text-[#00B386]">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          <div className="space-y-3">
            {topFunds.map((fund, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-[#1A1D24] rounded-xl p-5 hover:shadow-md dark:hover:shadow-lg transition-all border border-gray-100 dark:border-gray-800 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-[#44475B] dark:text-white mb-1 group-hover:text-[#00D09C] transition-colors">
                          {fund.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{fund.category}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < fund.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-4">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">1Y Returns</div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-[#00D09C]" />
                          <span className="text-sm font-semibold text-[#00D09C]">{fund.returns1Y}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">3Y Returns</div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-[#00D09C]" />
                          <span className="text-sm font-semibold text-[#00D09C]">{fund.returns3Y}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">5Y Returns</div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-[#00D09C]" />
                          <span className="text-sm font-semibold text-[#00D09C]">{fund.returns5Y}</span>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min. Investment</div>
                        <div className="text-sm font-semibold text-[#44475B] dark:text-white">{fund.minInvestment}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="ml-6 px-6 py-2 bg-[#00D09C] hover:bg-[#00B386] text-white text-xs font-medium rounded-md transition-colors">
                    Invest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div className="mt-6 text-center">
          <button className="px-8 py-3 bg-white dark:bg-[#1A1D24] text-[#00D09C] hover:bg-gray-50 dark:hover:bg-[#1F2228] text-sm font-medium rounded-lg border border-[#00D09C] transition-colors">
            View All Funds
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1A1D24] border-t border-gray-200 dark:border-gray-800 mt-16 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00D09C] to-[#00B386] rounded-full"></div>
                <span className="text-lg font-bold text-[#44475B] dark:text-white">Meridian</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your trusted investment partner for stocks, F&O, and mutual funds.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#44475B] dark:text-white mb-3">Products</h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#00D09C]">Stocks</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Futures & Options</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Mutual Funds</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">IPO</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#44475B] dark:text-white mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#00D09C]">About Us</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Careers</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Press</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#44475B] dark:text-white mb-3">Support</h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-[#00D09C]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#00D09C]">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              2024 Meridian. All rights reserved. Investment in securities market are subject to market risks.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}
