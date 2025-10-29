export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#F8F9FA] to-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-[#44475B] leading-tight">
              Invest in everything
            </h1>
            <p className="text-xl text-[#7C7E8C] leading-relaxed">
              Online platform to invest in stocks, derivatives, mutual funds, and more
            </p>
            <button className="bg-[#00D09C] text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-[#00B386] transition-colors shadow-lg">
              Get Started
            </button>
          </div>

          {/* Right Illustration Placeholder */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-[#00D09C] to-[#00B386] rounded-3xl h-96 flex items-center justify-center shadow-2xl">
              <div className="text-white text-center">
                <svg
                  className="w-64 h-64 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <p className="text-xl font-semibold">Investment Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
