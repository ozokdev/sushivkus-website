"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categoryList } from "@/data/categories";
import type { Category, MenuItem } from "@/data/menu";
import { useMenuStore } from "@/store/menuStore";

function getCategoryStats(catId: Category, items: MenuItem[]) {
  const filtered = items.filter((item) => item.category === catId);
  const minPrice =
    filtered.length > 0 ? Math.min(...filtered.map((i) => i.price)) : 0;
  return { count: filtered.length, minPrice };
}

export default function CategoryGrid() {
  const storeItems = useMenuStore((s) => s.items);
  const categoryMeta = useMenuStore((s) => s.categoryMeta);
  const fetched = useMenuStore((s) => s.fetched);
  const fetchMenu = useMenuStore((s) => s.fetchMenu);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const visibleCards = categoryList.filter((card) => {
    const meta = categoryMeta[card.slug] || categoryMeta[card.id];
    return !meta?.disabled;
  });

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-5"
        >
          Меню
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {!fetched
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-white/[0.04] animate-pulse"
                />
              ))
            : visibleCards.map((card, index) => {
                const stats = getCategoryStats(card.id, storeItems);
                const meta = categoryMeta[card.slug] || categoryMeta[card.id];
                const imageSrc = meta?.image
                  ? `https://sushivkus.ru${meta.image}`
                  : card.image;
                const displayPrice = meta?.minPrice || stats.minPrice;

                if (stats.count === 0 && displayPrice === 0) return null;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: Math.min(index * 0.06, 0.35) }}
                  >
                    <Link
                      href={`/category/${card.slug}`}
                      className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group block keep-white"
                    >
                      <Image
                        src={imageSrc}
                        alt={card.nameFull}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        priority={index < 4}
                      />

                      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-black/60" />

                      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4">
                        <h3
                          className="text-white font-bold text-sm sm:text-base leading-tight"
                          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
                        >
                          {card.nameFull}
                        </h3>
                        {displayPrice > 0 && (
                          <p
                            className="text-white font-extrabold text-lg sm:text-xl mt-0.5"
                            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
                          >
                            от {displayPrice} ₽
                          </p>
                        )}
                      </div>

                      {stats.count > 0 && (
                        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                          <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                            {stats.count} поз.
                          </span>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
