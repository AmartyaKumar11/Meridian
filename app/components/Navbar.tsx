"use client";

import Link from "next/link";
import { Search, ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  onOpenAuth: () => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-[#1A1D24] sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer mr-12">
            <span className="text-xl font-bold text-black dark:text-white transition-colors">Meridian</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10 flex-1">
            {/* Stocks Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] dark:text-gray-300 hover:text-black dark:hover:text-white text-sm font-medium transition-colors flex items-center cursor-pointer">
                Stocks
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[800px] bg-white dark:bg-[#1A1D24] shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-[#44475B] dark:text-white font-semibold text-base mb-2">Invest in Stocks →</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Invest in stocks, ETFs, IPOs with fast orders</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Intraday</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Monitor top intraday performers</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">ETFs</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get the best of Mutual Funds and flexibility</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">IPO</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Track upcoming and ongoing IPOs</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">MTFs</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Buy now, pay later</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Stock Screener</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Filter based on RSI, PE ratio and more</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Stock Events</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Dividends, bonus, buybacks and more</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Demat Account</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Begin your stock market journey</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Share Market Today</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Live news updates from stock market</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* F&O Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] dark:text-gray-300 hover:text-black dark:hover:text-white text-sm font-medium transition-colors flex items-center cursor-pointer">
                F&O
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[800px] bg-white dark:bg-[#1A1D24] shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-[#44475B] dark:text-white font-semibold text-base mb-2">Trade in Futures & Options →</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Trade in F&O using the terminal</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Indices</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Track markets across the globe</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Terminal</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Track charts, orders, positions, watchlists</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Option chain</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Analyse chains, view payoffs, create baskets</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Pledge</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get extra balance for trading</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Commodities</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Trade in Crude Oil, Gold, Silver and more</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">API trading</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Set up and execute trades through our API</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mutual Funds Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] dark:text-gray-300 hover:text-black dark:hover:text-white text-sm font-medium transition-colors flex items-center cursor-pointer">
                Mutual Funds
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[800px] bg-white dark:bg-[#1A1D24] shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-[#44475B] dark:text-white font-semibold text-base mb-2">Invest in Mutual Funds →</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Invest in direct mutual funds at zero charges</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Mutual Fund Houses</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Know about AMCs, funds, fund managers</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">NFO's</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Track all active NFOs in one place</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Mutual Funds by Meridian</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mutual funds designed for your goals</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Mutual Funds screener</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Filter funds based on risk, fund size</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Track Funds</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Import funds and track all investments</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Compare Funds</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Compare multiple funds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] dark:text-gray-300 hover:text-black dark:hover:text-white text-sm font-medium transition-colors flex items-center cursor-pointer">
                More
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[500px] bg-white dark:bg-[#1A1D24] shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">SIP calculator</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estimate returns on a SIP</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Brokerage calculator</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estimate charges for your trade</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Margin calculator</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estimate balance needed to buy/sell</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">SWP calculator</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Returns on your systematic withdrawal</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Pricing</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Brokerage and charges on Meridian</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] dark:text-white font-semibold text-sm mb-1">Blog</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Read our latest articles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar, Theme Toggle and Login Button */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-white dark:bg-[#1F2228] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></span>
              <input
                type="text"
                placeholder="Search for stocks"
                className="bg-transparent border-none outline-none text-[#44475B] dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 text-sm w-48 cursor-text"
              />
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">Ctrl+K</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F2228] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Login Button */}
            <button
              onClick={onOpenAuth}
              className="bg-[#00B386] text-white px-5 py-2 rounded-md font-medium text-sm hover:bg-[#009970] transition-colors cursor-pointer"
            >
              Login / Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
