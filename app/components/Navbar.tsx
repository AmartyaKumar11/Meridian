"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#00D09C]">Meridian</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/stocks"
              className="text-[#44475B] hover:text-[#00D09C] font-medium transition-colors"
            >
              Stocks
            </Link>
            <Link
              href="/fo"
              className="text-[#44475B] hover:text-[#00D09C] font-medium transition-colors"
            >
              F&O
            </Link>
            <Link
              href="/mutual-funds"
              className="text-[#44475B] hover:text-[#00D09C] font-medium transition-colors"
            >
              Mutual Funds
            </Link>
            <div className="relative group">
              <button className="text-[#44475B] hover:text-[#00D09C] font-medium transition-colors flex items-center">
                More
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar and Login Button */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-[#F8F9FA] rounded-md px-3 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for stocks"
                className="bg-transparent border-none outline-none ml-2 text-[#44475B] placeholder-gray-400 w-64"
              />
            </div>

            {/* Login Button */}
            <Link
              href="/login"
              className="bg-[#00D09C] text-white px-6 py-2 rounded-md font-medium hover:bg-[#00B386] transition-colors"
            >
              Login / Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
