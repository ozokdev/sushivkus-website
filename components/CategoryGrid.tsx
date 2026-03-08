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
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold mb-6"
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
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group block"
                >
                  <Image
                    src={card.image}
                    alt={card.nameFull}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />

                  <div className="absolute top-3 right-3">
                    <span className="bg-white/15 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-lg">
                      {stats.count} поз.
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg uppercase tracking-wide leading-tight">
                      {card.name}
                    </h3>
                    <p className="text-white/70 text-[11px] sm:text-xs mt-0.5 font-medium">
                      от {stats.minPrice} ₽
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
