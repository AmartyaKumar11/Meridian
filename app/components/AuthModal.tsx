"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const investmentTypes = [
  "Stocks",
  "F&O",
  "Mutual Funds",
  "Intraday",
  "ETFs",
  "IPO",
  "MTF",
  "Commodities",
];

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const duration = 4000; // 4 seconds per text (slower)
    const interval = 30; // Update every 30ms
    const increment = (100 / duration) * interval;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          return 0;
        }
        return next;
      });
    }, interval);

    // Text change
    const textInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % investmentTypes.length);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 z-40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-5xl w-full h-[600px] overflow-hidden flex relative animate-bounce-in pointer-events-auto"
          style={{
            animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side - Green Background with Animated Text */}
        <div className="w-1/2 bg-gradient-to-br from-[#00D09C] via-[#00B386] to-[#00D09C] p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 Q50,30 100,0 L100,100 L0,100 Z" fill="white" opacity="0.1"/>
              <circle cx="20" cy="60" r="15" fill="white" opacity="0.05"/>
              <circle cx="80" cy="30" r="20" fill="white" opacity="0.05"/>
              <path d="M10,80 Q30,70 50,75 T90,85" stroke="white" strokeWidth="0.5" fill="none" opacity="0.2"/>
            </svg>
          </div>

          {/* Top Text */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Simple, Free<br />Investing.
            </h2>
          </div>

          {/* Bottom Animated Section */}
          <div className="relative z-10">
            {/* Progress Bar */}
            <div className="w-16 h-1 bg-white bg-opacity-30 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ 
                  width: `${progress}%`,
                  transition: 'width 30ms linear'
                }}
              />
            </div>

            {/* Animated Text */}
            <div className="relative h-16">
              {investmentTypes.map((type, index) => (
                <div
                  key={type}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentIndex
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl font-semibold text-white">{type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#44475B] mb-8 text-center">
            Welcome to Meridian
          </h2>

          {/* Google Sign In Button */}
          <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 rounded-md py-2.5 px-6 mb-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-[#44475B] font-medium text-sm">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">Or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Your Email Address"
            className="w-full border-b-2 border-gray-300 py-3 px-1 text-[#44475B] placeholder-gray-400 focus:outline-none focus:border-[#00B386] transition-colors mb-6"
          />

          {/* Continue Button */}
          <button className="w-full bg-[#00B386] text-white py-2.5 rounded-md font-semibold text-sm hover:bg-[#009970] transition-colors cursor-pointer mb-4">
            Continue
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By proceeding, I agree to{" "}
            <a href="#" className="text-[#44475B] underline hover:text-black">
              T&C
            </a>
            ,{" "}
            <a href="#" className="text-[#44475B] underline hover:text-black">
              Privacy Policy
            </a>{" "}
            &{" "}
            <a href="#" className="text-[#44475B] underline hover:text-black">
              Tariff Rates
            </a>
          </p>
        </div>
      </div>
    </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
