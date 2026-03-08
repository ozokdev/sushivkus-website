"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { categories, type Category } from "@/data/menu";

// Иконки-эмодзи для каждой категории
const categoryIcons: Record<Category, string> = {
  all: "🍱",
  popular: "🔥",
  rolls: "🍣",
  sets: "🎁",
  pizza: "🍕",
  poke: "🥗",
  soups: "🍜",
  snacks: "🍟",
  salads: "🥬",
  sauces: "🥢",
};

interface CategoryNavProps {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

export default function CategoryNav({
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (catId: Category) => {
    onCategoryChange(catId);
    // Скролл к секции категории
    if (catId === "all") {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    } else {
      document.getElementById(`cat-${catId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={`sticky top-16 md:top-20 z-40 transition-all duration-300 ${
        isSticky
          ? "bg-dark/95 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat.id
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <span className="text-base">{categoryIcons[cat.id]}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
