"use client";

import { useState } from "react";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AuthModal from "./components/AuthModal";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C0E12] transition-colors">
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />
      <Hero onOpenAuth={() => setIsAuthModalOpen(true)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
