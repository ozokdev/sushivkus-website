"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // DOM'дон чыныгы абалды окуу
    setIsDark(!document.documentElement.classList.contains("light-mode"));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const goingDark = root.classList.contains("light-mode");

    if (goingDark) {
      root.classList.remove("light-mode");
      root.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
    setIsDark(goingDark);
  };

  return (
    <button
      onClick={toggle}
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
