export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#F8F9FA] to-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center">
          {/* Centered Content */}
          <div className="space-y-6 text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-[#44475B] leading-tight">
              Where Insight Meets Investment
            </h1>
            <p className="text-xl text-[#7C7E8C] leading-relaxed">
              Smarter Insights. Sharper Investments
            </p>
            <button className="bg-[#00B386] text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-[#009970] transition-colors shadow-lg cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
