"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import { categoryList } from "@/data/categories";
import type { Category } from "@/data/menu";

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
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-5"
        >
          Меню
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {categoryList.map((card, index) => {
            const stats = getCategoryStats(card.id);
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
                    src={card.image}
                    alt={card.nameFull}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority={index < 4}
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg leading-tight">
                      {card.nameFull}
                    </h3>
                    <p className="text-white font-extrabold text-base sm:text-xl drop-shadow-lg mt-0.5">
                      ОТ {stats.minPrice} ₽
                    </p>
                  </div>

                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                      {stats.count} поз.
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
