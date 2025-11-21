"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PORTFOLIOS = {
    portfolio1: {
        id: "Portfolio 1",
        generatedDate: "2024-11-21",
        strategy: "Maximum Sharpe Ratio",
        inputs: {
            initialCapital: 1000000,
            riskAppetite: "Moderate",
            targetReturn: 15,
            stockUniverse: "NIFTY50",
            optimizationMode: "max_sharpe",
            rebalancingFreq: "Quarterly"
        },
        metrics: {
            expectedReturn: 18.45,
            volatility: 12.34,
            sharpeRatio: 1.52,
            maxDrawdown: -8.23,
            var95: -2.45,
            cvar95: -3.12
        },
        holdings: [
            { ticker: "RELIANCE", name: "Reliance Industries", weight: 14.2, shares: 58, price: 2456.30, allocation: 142454 },
            { ticker: "INFY", name: "Infosys", weight: 12.8, shares: 85, price: 1498.20, allocation: 127347 },
            { ticker: "TCS", name: "Tata Consultancy Services", weight: 11.5, shares: 34, price: 3389.40, allocation: 115240 },
            { ticker: "HDFCBANK", name: "HDFC Bank", weight: 10.3, shares: 63, price: 1645.50, allocation: 103667 },
            { ticker: "BHARTIARTL", name: "Bharti Airtel", weight: 9.7, shares: 83, price: 1167.80, allocation: 96927 },
            { ticker: "BAJFINANCE", name: "Bajaj Finance", weight: 8.9, shares: 13, price: 6878.50, allocation: 89421 },
            { ticker: "ASIANPAINT", name: "Asian Paints", weight: 7.4, shares: 25, price: 2989.30, allocation: 74733 },
            { ticker: "LT", name: "Larsen & Toubro", weight: 6.8, shares: 23, price: 2989.60, allocation: 68761 },
            { ticker: "MARUTI", name: "Maruti Suzuki", weight: 6.2, shares: 6, price: 9756.40, allocation: 58538 },
            { ticker: "TITAN", name: "Titan Company", weight: 5.5, shares: 17, price: 3223.50, allocation: 54800 },
            { ticker: "WIPRO", name: "Wipro Limited", weight: 4.3, shares: 92, price: 467.20, allocation: 42982 },
            { ticker: "TECHM", name: "Tech Mahindra", weight: 2.4, shares: 18, price: 1334.50, allocation: 24021 }
        ],
        summary: {
            totalInvested: 998891,
            numStocks: 12,
            transactionCost: 999
        }
    },
    portfolio2: {
        id: "Portfolio 2",
        generatedDate: "2024-11-21",
        strategy: "Minimum Volatility",
        inputs: {
            initialCapital: 1000000,
            riskAppetite: "Conservative",
            targetReturn: 10,
            stockUniverse: "NIFTY50",
            optimizationMode: "min_volatility",
            rebalancingFreq: "Semi-Annual"
        },
        metrics: {
            expectedReturn: 11.89,
            volatility: 7.92,
            sharpeRatio: 0.91,
            maxDrawdown: -4.67,
            var95: -1.52,
            cvar95: -2.01
        },
        holdings: [
            { ticker: "HDFCBANK", name: "HDFC Bank", weight: 18.5, shares: 112, price: 1645.50, allocation: 184296 },
            { ticker: "ICICIBANK", name: "ICICI Bank", weight: 16.2, shares: 173, price: 934.60, allocation: 161686 },
            { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", weight: 13.7, shares: 79, price: 1734.20, allocation: 137002 },
            { ticker: "HINDUNILVR", name: "Hindustan Unilever", weight: 11.4, shares: 45, price: 2534.70, allocation: 114062 },
            { ticker: "ITC", name: "ITC Limited", weight: 10.8, shares: 243, price: 443.50, allocation: 107771 },
            { ticker: "NESTLEIND", name: "Nestle India", weight: 9.3, shares: 4, price: 25234.60, allocation: 100938 },
            { ticker: "BRITANNIA", name: "Britannia Industries", weight: 7.9, shares: 16, price: 4845.30, allocation: 77525 },
            { ticker: "POWERGRID", name: "Power Grid Corp", weight: 6.2, shares: 220, price: 281.40, allocation: 61908 },
            { ticker: "NTPC", name: "NTPC Limited", weight: 4.1, shares: 124, price: 329.80, allocation: 40895 },
            { ticker: "COALINDIA", name: "Coal India", weight: 1.9, shares: 46, price: 411.20, allocation: 18915 }
        ],
        summary: {
            totalInvested: 1004998,
            numStocks: 10,
            transactionCost: 1005
        }
    },
    portfolio3: {
        id: "Portfolio 3",
        generatedDate: "2024-11-21",
        strategy: "Risk Parity",
        inputs: {
            initialCapital: 1000000,
            riskAppetite: "Aggressive",
            targetReturn: 18,
            stockUniverse: "NIFTY50",
            optimizationMode: "risk_parity",
            rebalancingFreq: "Monthly"
        },
        metrics: {
            expectedReturn: 15.23,
            volatility: 9.87,
            sharpeRatio: 1.18,
            maxDrawdown: -6.45,
            var95: -1.89,
            cvar95: -2.54
        },
        holdings: [
            { ticker: "RELIANCE", name: "Reliance Industries", weight: 11.3, shares: 46, price: 2456.30, allocation: 112990 },
            { ticker: "TCS", name: "Tata Consultancy Services", weight: 10.7, shares: 32, price: 3389.40, allocation: 108461 },
            { ticker: "ICICIBANK", name: "ICICI Bank", weight: 9.8, shares: 105, price: 934.60, allocation: 98133 },
            { ticker: "INFY", name: "Infosys", weight: 9.2, shares: 61, price: 1498.20, allocation: 91390 },
            { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", weight: 8.6, shares: 50, price: 1734.20, allocation: 86710 },
            { ticker: "ITC", name: "ITC Limited", weight: 8.1, shares: 182, price: 443.50, allocation: 80717 },
            { ticker: "HINDUNILVR", name: "Hindustan Unilever", weight: 7.5, shares: 30, price: 2534.70, allocation: 76041 },
            { ticker: "SBIN", name: "State Bank of India", weight: 6.9, shares: 113, price: 611.20, allocation: 69066 },
            { ticker: "LT", name: "Larsen & Toubro", weight: 6.4, shares: 21, price: 2989.60, allocation: 62782 },
            { ticker: "BHARTIARTL", name: "Bharti Airtel", weight: 5.8, shares: 50, price: 1167.80, allocation: 58390 },
            { ticker: "AXISBANK", name: "Axis Bank", weight: 5.3, shares: 57, price: 934.50, allocation: 53267 },
            { ticker: "ASIANPAINT", name: "Asian Paints", weight: 4.7, shares: 16, price: 2989.30, allocation: 47829 },
            { ticker: "SUNPHARMA", name: "Sun Pharma", weight: 3.9, shares: 25, price: 1567.30, allocation: 39183 },
            { ticker: "ULTRACEMCO", name: "UltraTech Cement", weight: 1.8, shares: 2, price: 9012.40, allocation: 18025 }
        ],
        summary: {
            totalInvested: 1003984,
            numStocks: 14,
            transactionCost: 1004
        }
    }
};

export default function PortfolioAgent() {
    const router = useRouter();
    const [selectedPortfolio, setSelectedPortfolio] = useState<keyof typeof PORTFOLIOS>("portfolio1");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const portfolio = PORTFOLIOS[selectedPortfolio];

    const handleDownloadPDF = async () => {
        if (!contentRef.current) return;

        setIsGeneratingPDF(true);

        const originalWarn = console.warn;
        console.warn = (...args: any[]) => {
            if (args[0]?.includes?.('Attempting to parse an unsupported color')) return;
            originalWarn(...args);
        };

        try {
            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${portfolio.id.replace(' ', '_')}_Report_${portfolio.generatedDate}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            console.warn = originalWarn;
            setIsGeneratingPDF(false);
        }
    };

    const handleCreatePortfolio = () => {
        router.push("/portfolio");
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#F8F9FA] dark:bg-[#0C0E12] transition-colors duration-300 flex flex-col">
            <header className="flex-none h-14 bg-white dark:bg-[#1A1D24] border-b border-gray-200 dark:border-gray-800">
                <div className="h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push("/terminal")}
                            className="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-base font-semibold text-[#44475B] dark:text-white">
                            Portfolio Agent
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleCreatePortfolio}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-[#23272F] border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create Portfolio</span>
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGeneratingPDF}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-[#00D09C] hover:bg-[#00B386] text-white rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden flex">
                <div className="w-56 bg-white dark:bg-[#1A1D24] border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
                    <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Portfolios</h2>
                    <div className="space-y-2">
                        {Object.entries(PORTFOLIOS).map(([key, p]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedPortfolio(key as keyof typeof PORTFOLIOS)}
                                className={`w-full p-3 rounded text-left transition-all text-sm ${selectedPortfolio === key
                                        ? "bg-[#00D09C]/10 border border-[#00D09C]/30"
                                        : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                            >
                                <div className="font-medium text-[#44475B] dark:text-white">{p.id}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{p.strategy}</div>
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{p.generatedDate}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div ref={contentRef} className="max-w-[1400px] mx-auto space-y-6">
                        <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#44475B] dark:text-white">{portfolio.id}</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {portfolio.strategy} | Generated on {portfolio.generatedDate}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Investment</div>
                                    <div className="text-lg font-semibold text-[#44475B] dark:text-white">
                                        ₹{portfolio.summary.totalInvested.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Input Parameters</h3>
                                <div className="grid grid-cols-6 gap-3 text-xs">
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">Initial Capital</div>
                                        <div className="font-medium text-[#44475B] dark:text-white">₹{portfolio.inputs.initialCapital.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">Risk Appetite</div>
                                        <div className="font-medium text-[#44475B] dark:text-white">{portfolio.inputs.riskAppetite}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">Target Return</div>
                                        <div className="font-medium text-[#44475B] dark:text-white">{portfolio.inputs.targetReturn}%</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">Universe</div>
                                        <div className="font-medium text-[#44475B] dark:text-white">{portfolio.inputs.stockUniverse}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">Optimization</div>
                                        <div className="font-medium text-[#44475B] dark:text-white">{portfolio.inputs.optimizationMode.replace('_', ' ')}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">Rebalancing</div>
                                        <div className="font-medium text-[#44475B] dark:text-white">{portfolio.inputs.rebalancingFreq}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 gap-4">
                            <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 p-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Expected Return</div>
                                <div className="text-xl font-semibold text-[#00D09C] mt-1">{portfolio.metrics.expectedReturn}%</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Annualized</div>
                            </div>

                            <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 p-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Volatility</div>
                                <div className="text-xl font-semibold text-[#44475B] dark:text-white mt-1">{portfolio.metrics.volatility}%</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Std Dev</div>
                            </div>

                            <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 p-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Sharpe Ratio</div>
                                <div className="text-xl font-semibold text-[#44475B] dark:text-white mt-1">{portfolio.metrics.sharpeRatio}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Risk-Adjusted</div>
                            </div>

                            <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 p-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Max Drawdown</div>
                                <div className="text-xl font-semibold text-red-500 mt-1">{portfolio.metrics.maxDrawdown}%</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Worst Case</div>
                            </div>

                            <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 p-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">VaR (95%)</div>
                                <div className="text-xl font-semibold text-[#44475B] dark:text-white mt-1">{portfolio.metrics.var95}%</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Value at Risk</div>
                            </div>

                            <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 p-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">CVaR (95%)</div>
                                <div className="text-xl font-semibold text-[#44475B] dark:text-white mt-1">{portfolio.metrics.cvar95}%</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">Conditional VaR</div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1A1D24] rounded border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="text-sm font-semibold text-[#44475B] dark:text-white">Portfolio Holdings</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {portfolio.summary.numStocks} stocks | Transaction Cost: ₹{portfolio.summary.transactionCost}
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 dark:bg-[#0C0E12] text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="px-5 py-2.5 font-medium text-left">Ticker</th>
                                            <th className="px-5 py-2.5 font-medium text-left">Company Name</th>
                                            <th className="px-5 py-2.5 font-medium text-right">Weight</th>
                                            <th className="px-5 py-2.5 font-medium text-right">Shares</th>
                                            <th className="px-5 py-2.5 font-medium text-right">Price</th>
                                            <th className="px-5 py-2.5 font-medium text-right">Allocation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {portfolio.holdings.map((stock, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#131722] transition-colors">
                                                <td className="px-5 py-2.5 font-medium text-[#44475B] dark:text-white">{stock.ticker}</td>
                                                <td className="px-5 py-2.5 text-gray-600 dark:text-gray-300">{stock.name}</td>
                                                <td className="px-5 py-2.5 text-right">
                                                    <span className="px-2 py-0.5 rounded bg-[#00D09C]/10 text-[#00D09C] font-medium">
                                                        {stock.weight.toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="px-5 py-2.5 text-right text-gray-600 dark:text-gray-300">{stock.shares}</td>
                                                <td className="px-5 py-2.5 text-right text-gray-600 dark:text-gray-300">
                                                    ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-5 py-2.5 text-right font-medium text-[#44475B] dark:text-white">
                                                    ₹{stock.allocation.toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 dark:bg-[#0C0E12] border-t-2 border-gray-300 dark:border-gray-700">
                                        <tr>
                                            <td colSpan={5} className="px-5 py-2.5 font-semibold text-[#44475B] dark:text-white text-right">Total Invested</td>
                                            <td className="px-5 py-2.5 font-semibold text-[#44475B] dark:text-white text-right">
                                                ₹{portfolio.summary.totalInvested.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
