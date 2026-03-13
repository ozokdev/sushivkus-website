"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const isDark = theme === "dark";

  useEffect(() => { initTheme(); }, [initTheme]);

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full p-0.5 transition-colors duration-300 ${
        isDark
          ? "bg-white/10 hover:bg-white/15"
          : "bg-amber-100 hover:bg-amber-200"
      }`}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      aria-label="Переключить тему"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark
            ? "bg-slate-700 ml-0"
            : "bg-white shadow-sm ml-auto"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-blue-300" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </motion.div>
    </button>
  );
}
