"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import { categoryList } from "@/data/categories";
import type { Category } from "@/data/menu";
import { ArrowRight } from "lucide-react";

function getCategoryStats(catId: Category) {
  const items = menuItems.filter((item) => item.category === catId);
  const minPrice =
    items.length > 0 ? Math.min(...items.map((i) => i.price)) : 0;
  return { count: items.length, minPrice };
}

export default function CategoryGrid() {
  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 sm:mb-5"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Меню
          </h2>
        </motion.div>

        {/* Биринчи 2 — чоң карточкалар */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {categoryList.slice(0, 2).map((card, index) => {
            const stats = getCategoryStats(card.id);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={`/category/${card.slug}`}
                  className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group block keep-white shadow-lg shadow-black/10"
                >
                  <Image
                    src={card.image}
                    alt={card.nameFull}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, 50vw"
                    priority
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />

                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
                    <span className="bg-white text-gray-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
                      {stats.count} поз.
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                    <h3 className="text-white font-extrabold text-sm sm:text-xl tracking-wide drop-shadow-lg">
                      {card.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/80 text-[11px] sm:text-sm font-medium">
                        от {stats.minPrice} ₽
                      </span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Калган 6 — 3 колонка мобилде, 6 десктопто */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
          {categoryList.slice(2).map((card, index) => {
            const stats = getCategoryStats(card.id);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min((index + 2) * 0.05, 0.35) }}
              >
                <Link
                  href={`/category/${card.slug}`}
                  className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group block keep-white shadow-md shadow-black/10"
                >
                  <Image
                    src={card.image}
                    alt={card.nameFull}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 16vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                    <h3 className="text-white font-bold text-[10px] sm:text-xs tracking-wide drop-shadow-lg">
                      {card.name}
                    </h3>
                    <span className="text-white/70 text-[9px] sm:text-[11px] font-medium">
                      от {stats.minPrice} ₽
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
