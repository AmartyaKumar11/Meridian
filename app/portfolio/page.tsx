"use client";

import { useState } from "react";
import { 
  FileBarChart, 
  ArrowLeft, 
  CheckCircle2, 
  Circle,
  ChevronRight 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PortfolioAgentPage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { id: 0, name: "Welcome", icon: FileBarChart },
    { id: 1, name: "User Inputs", icon: Circle },
    { id: 2, name: "Data Ingestion", icon: Circle },
    { id: 3, name: "Return & Risk", icon: Circle },
    { id: 4, name: "Constraints", icon: Circle },
    { id: 5, name: "Optimization", icon: Circle },
    { id: 6, name: "Share Calculation", icon: Circle },
    { id: 7, name: "Risk Analysis", icon: Circle },
    { id: 8, name: "Monte Carlo", icon: Circle },
    { id: 9, name: "Explanation", icon: Circle },
    { id: 10, name: "Results", icon: Circle },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0C0E12] transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#1A1D24] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/terminal")}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Back to Terminal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#00D09C]/10 rounded-lg">
                  <FileBarChart className="w-6 h-6 text-[#00D09C]" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#44475B] dark:text-white">
                    Portfolio Agent
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI-Powered Portfolio Optimization
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stage Progress Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                      index < currentStage
                        ? "bg-[#00D09C] text-white"
                        : index === currentStage
                        ? "bg-[#00D09C] text-white ring-4 ring-[#00D09C]/20"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }`}
                  >
                    {index < currentStage ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-1 transition-colors ${
                        index < currentStage
                          ? "bg-[#00D09C]"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stage Navigation Breadcrumb - Mobile */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1D24] rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stages[currentStage].name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Step {currentStage + 1} of {stages.length}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-[#1A1D24] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 min-h-[600px]">
          {currentStage === 0 && <WelcomeStage onNext={() => setCurrentStage(1)} />}
          {currentStage === 1 && <div className="p-8">User Inputs Stage - Coming Soon</div>}
          {currentStage === 2 && <div className="p-8">Data Ingestion Stage - Coming Soon</div>}
          {/* Add other stages here */}
        </div>
      </main>
    </div>
  );
}

// Welcome Stage Component
function WelcomeStage({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[600px]">
      <div className="p-6 bg-[#00D09C]/10 rounded-2xl mb-6">
        <FileBarChart className="w-20 h-20 text-[#00D09C]" />
      </div>
      
      <h2 className="text-3xl font-bold text-[#44475B] dark:text-white mb-4">
        Welcome to Portfolio Agent
      </h2>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
        Build an optimized stock portfolio tailored to your financial goals, risk appetite, 
        and investment horizon. Our AI-powered agent will guide you through every step of 
        the process.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
        <div className="p-6 bg-gray-50 dark:bg-[#23272F] rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-[#00D09C]/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-[#44475B] dark:text-white mb-2">
            Data-Driven
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analyze 5 years of historical data with advanced statistical methods
          </p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-[#23272F] rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-[#00D09C]/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="font-semibold text-[#44475B] dark:text-white mb-2">
            Optimized
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Maximize Sharpe ratio with advanced portfolio optimization
          </p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-[#23272F] rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-[#00D09C]/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔮</span>
          </div>
          <h3 className="font-semibold text-[#44475B] dark:text-white mb-2">
            Forward-Looking
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            10,000 Monte Carlo simulations to visualize future outcomes
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-xl">
        <h3 className="font-semibold text-[#44475B] dark:text-white mb-3">
          What You'll Get:
        </h3>
        <ul className="text-left space-y-2">
          {[
            "Personalized portfolio based on your risk appetite",
            "11 comprehensive risk metrics with benchmark comparison",
            "Monte Carlo probability analysis for future returns",
            "Plain English explanations of all calculations",
            "Downloadable reports in PDF, JSON, and CSV formats"
          ].map((item, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#00D09C] mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onNext}
        className="mt-12 px-8 py-4 bg-[#00D09C] hover:bg-[#00B386] text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2"
      >
        <span>Get Started</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
