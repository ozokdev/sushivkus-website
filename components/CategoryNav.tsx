"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMenuStore } from "@/store/menuStore";

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function CategoryNav({
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) {
  const categories = useMenuStore((s) => s.categories);
  const [isSticky, setIsSticky] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
  };

  const handleClick = (catId: string) => {
    onCategoryChange(catId);
    if (catId === "all") {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setTimeout(() => {
        const el = document.getElementById(`cat-${catId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
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
        <div className="relative">
          {/* Солго жебе */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-dark/90 border border-white/10 rounded-full shadow-lg text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Оңго жебе */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-dark/90 border border-white/10 rounded-full shadow-lg text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Оңдогу fade gradient */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-dark/80 to-transparent pointer-events-none z-[5]" />
          )}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-dark/80 to-transparent pointer-events-none z-[5]" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-1.5 py-2 overflow-x-auto scrollbar-hide"
          >
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
                <span className="text-base">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
