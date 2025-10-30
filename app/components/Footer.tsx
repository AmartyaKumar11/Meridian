export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1A1D24] border-t border-gray-200 dark:border-gray-800 mt-16 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-9 gap-8 mb-8">
          {/* Address & Social */}
          <div className="col-span-2 space-y-3">
            <div className="space-y-1 text-xs text-[#7C7E8C] dark:text-gray-400">
              <p>No. 1418, 19th Main Road,</p>
              <p>Opp. JW Marriot Hotel, Vanganahalli,</p>
              <p>1st Sector, HSR Layout</p>
              <p>Bangalore - 560102</p>
              <p>Karnataka</p>
            </div>
            <div className="space-y-2">
              <button className="text-xs text-[#00B386] hover:text-[#009970] underline">Contact Us</button>
              <div className="flex items-center space-x-3 text-[#7C7E8C] dark:text-gray-400">
                <a href="#" className="hover:text-[#44475B] dark:hover:text-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="hover:text-[#44475B] dark:hover:text-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="hover:text-[#44475B] dark:hover:text-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="hover:text-[#44475B] dark:hover:text-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="hover:text-[#44475B] dark:hover:text-gray-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Download App */}
          <div className="col-span-2">
            <h3 className="text-xs font-semibold text-[#44475B] dark:text-white mb-3">Download the App</h3>
            <div className="flex space-x-2">
              <a href="#" className="hover:opacity-80 dark:text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              </a>
              <a href="#" className="hover:opacity-80 dark:text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
              </a>
            </div>
          </div>

          {/* MERIDIAN */}
          <div className="col-span-2">
            <h3 className="text-xs font-semibold text-[#44475B] dark:text-white mb-3">MERIDIAN</h3>
            <div className="space-y-2">
              {["About Us", "Pricing", "Blog", "Media & Press", "Careers", "Help & Support", "Trust & Safety", "Investor Relations"].map((item, idx) => (
                <a key={idx} href="#" className="block text-xs text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">{item}</a>
              ))}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="col-span-2">
            <h3 className="text-xs font-semibold text-[#44475B] dark:text-white mb-3">PRODUCTS</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {["Stocks", "F&O", "MTF", "ETF", "IPO", "Mutual Funds", "Commodities", "Meridian Terminal", "915 Terminal", "Stocks Screener", "Algo Trading", "Meridian Digest", "Demat Account", "Meridian AMC"].map((item, idx) => (
                <a key={idx} href="#" className="text-xs text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">{item}</a>
              ))}
            </div>
          </div>

          {/* Quick Links - Empty for now */}
          <div className="col-span-3">
            <div className="text-right">
              <div className="text-[10px] text-[#7C7E8C] dark:text-gray-400">Version: 6.7.8</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex items-center space-x-6 text-xs text-[#44475B] dark:text-gray-300 mb-6">
            <button className="border-b-2 border-[#00B386] pb-2">Share Market</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">Indices</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">F&O</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">Mutual Funds</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">ETFs</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">Funds By Meridian</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">Calculators</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">IPO</button>
            <button className="text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">Miscellaneous</button>
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
                  <a key={idx} href="#" className="block text-xs text-[#7C7E8C] dark:text-gray-400 hover:text-[#44475B] dark:hover:text-gray-200">{item}</a>
                ))}
              </div>
            ))}
          </div>

          <div className="text-xs text-[#7C7E8C] dark:text-gray-400">
            © 2016-2025 Meridian. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
