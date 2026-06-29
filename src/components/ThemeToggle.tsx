"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-stone-800 transition-all duration-200 active:scale-90"
      title={theme === "light" ? "Mode Gelap" : "Mode Terang"}
    >
      <span key={theme} className="animate-fade-in">
        {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </span>
    </button>
  );
}
