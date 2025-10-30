"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get saved theme or default to light
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    console.log("Initial theme from localStorage:", savedTheme);
    setTheme(savedTheme);
    
    // Apply the theme to document
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    console.log("Toggle theme called, current theme:", theme);
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("New theme:", newTheme);
    
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Apply to document immediately
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      console.log("Added dark class to document");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("Removed dark class from document");
    }
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
