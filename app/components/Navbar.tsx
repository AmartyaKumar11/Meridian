"use client";

import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer mr-12">
            <span className="text-xl font-bold text-black">Meridian</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10 flex-1">
            {/* Stocks Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] hover:text-black text-sm font-medium transition-colors flex items-center cursor-pointer">
                Stocks
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[800px] bg-white shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-[#44475B] font-semibold text-base mb-2">Invest in Stocks →</h3>
                      <p className="text-sm text-gray-500">Invest in stocks, ETFs, IPOs with fast orders</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Intraday</h4>
                      <p className="text-xs text-gray-500">Monitor top intraday performers</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">ETFs</h4>
                      <p className="text-xs text-gray-500">Get the best of Mutual Funds and flexibility</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">IPO</h4>
                      <p className="text-xs text-gray-500">Track upcoming and ongoing IPOs</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">MTFs</h4>
                      <p className="text-xs text-gray-500">Buy now, pay later</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Stock Screener</h4>
                      <p className="text-xs text-gray-500">Filter based on RSI, PE ratio and more</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Stock Events</h4>
                      <p className="text-xs text-gray-500">Dividends, bonus, buybacks and more</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Demat Account</h4>
                      <p className="text-xs text-gray-500">Begin your stock market journey</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Share Market Today</h4>
                      <p className="text-xs text-gray-500">Live news updates from stock market</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* F&O Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] hover:text-black text-sm font-medium transition-colors flex items-center cursor-pointer">
                F&O
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[800px] bg-white shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-[#44475B] font-semibold text-base mb-2">Trade in Futures & Options →</h3>
                      <p className="text-sm text-gray-500">Trade in F&O using the terminal</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Indices</h4>
                      <p className="text-xs text-gray-500">Track markets across the globe</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Terminal</h4>
                      <p className="text-xs text-gray-500">Track charts, orders, positions, watchlists</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Option chain</h4>
                      <p className="text-xs text-gray-500">Analyse chains, view payoffs, create baskets</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Pledge</h4>
                      <p className="text-xs text-gray-500">Get extra balance for trading</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Commodities</h4>
                      <p className="text-xs text-gray-500">Trade in Crude Oil, Gold, Silver and more</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">API trading</h4>
                      <p className="text-xs text-gray-500">Set up and execute trades through our API</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mutual Funds Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] hover:text-black text-sm font-medium transition-colors flex items-center cursor-pointer">
                Mutual Funds
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[800px] bg-white shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-[#44475B] font-semibold text-base mb-2">Invest in Mutual Funds →</h3>
                      <p className="text-sm text-gray-500">Invest in direct mutual funds at zero charges</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Mutual Fund Houses</h4>
                      <p className="text-xs text-gray-500">Know about AMCs, funds, fund managers</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">NFO's</h4>
                      <p className="text-xs text-gray-500">Track all active NFOs in one place</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Mutual Funds by Meridian</h4>
                      <p className="text-xs text-gray-500">Mutual funds designed for your goals</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Mutual Funds screener</h4>
                      <p className="text-xs text-gray-500">Filter funds based on risk, fund size</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Track Funds</h4>
                      <p className="text-xs text-gray-500">Import funds and track all investments</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Compare Funds</h4>
                      <p className="text-xs text-gray-500">Compare multiple funds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Dropdown */}
            <div className="relative group">
              <button className="text-[#44475B] hover:text-black text-sm font-medium transition-colors flex items-center cursor-pointer">
                More
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-[500px] bg-white shadow-xl rounded-lg p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">SIP calculator</h4>
                      <p className="text-xs text-gray-500">Estimate returns on a SIP</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Brokerage calculator</h4>
                      <p className="text-xs text-gray-500">Estimate charges for your trade</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Margin calculator</h4>
                      <p className="text-xs text-gray-500">Estimate balance needed to buy/sell</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">SWP calculator</h4>
                      <p className="text-xs text-gray-500">Returns on your systematic withdrawal</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Pricing</h4>
                      <p className="text-xs text-gray-500">Brokerage and charges on Meridian</p>
                    </div>
                    <div>
                      <h4 className="text-[#44475B] font-semibold text-sm mb-1">Blog</h4>
                      <p className="text-xs text-gray-500">Read our latest articles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar and Login Button */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="h-4 w-px bg-gray-300 mx-2"></span>
              <input
                type="text"
                placeholder="Search for stocks"
                className="bg-transparent border-none outline-none text-[#44475B] placeholder-gray-400 text-sm w-48 cursor-text"
              />
              <span className="text-xs text-gray-400 ml-2">Ctrl+K</span>
            </div>

            {/* Login Button */}
            <Link
              href="/login"
              className="bg-[#00B386] text-white px-5 py-2 rounded-md font-medium text-sm hover:bg-[#009970] transition-colors cursor-pointer"
            >
              Login / Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
