interface HeroProps {
  onOpenAuth: () => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  return (
    <section className="bg-gradient-to-b from-[#F8F9FA] to-white dark:from-[#131722] dark:to-[#0C0E12] py-20 md:py-32 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center">
          {/* Centered Content */}
          <div className="space-y-6 text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-[#44475B] dark:text-white leading-tight transition-colors">
              Where Insight Meets Investment
            </h1>
            <p className="text-xl text-[#7C7E8C] dark:text-gray-400 leading-relaxed transition-colors">
              Smarter Insights. Sharper Investments
            </p>
            <button 
              onClick={onOpenAuth}
              className="bg-[#00B386] text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-[#009970] transition-colors shadow-lg cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
