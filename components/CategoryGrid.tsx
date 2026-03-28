"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { menuItems as staticMenuItems } from "@/data/menu";
import { categoryList } from "@/data/categories";
import type { Category, MenuItem } from "@/data/menu";
import { useMenuStore } from "@/store/menuStore";

interface ApiCategory {
  ID: number;
  slug: string;
  name: string;
  icon: string;
  image: string;
  min_price: number;
  is_active: boolean;
}

function getCategoryStats(catId: Category, items: MenuItem[]) {
  const filtered = items.filter((item) => item.category === catId);
  const minPrice =
    filtered.length > 0 ? Math.min(...filtered.map((i) => i.price)) : 0;
  return { count: filtered.length, minPrice };
}

export default function CategoryGrid() {
  const [apiImages, setApiImages] = useState<Record<string, string>>({});
  const [apiPrices, setApiPrices] = useState<Record<string, number>>({});
  const [disabledSlugs, setDisabledSlugs] = useState<Set<string>>(new Set());
  const storeItems = useMenuStore((s) => s.items);
  const fetchMenu = useMenuStore((s) => s.fetchMenu);
  // API'ден товар жүктөлсө — аны колдон, жоксо — статик
  const allItems = storeItems.length > 0 ? storeItems : staticMenuItems;

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    fetch("https://api.sushivkus.ru/api/categories")
      .then((r) => r.json())
      .then((data: ApiCategory[]) => {
        const imgMap: Record<string, string> = {};
        const priceMap: Record<string, number> = {};
        const disabled = new Set<string>();
        data.forEach((c) => {
          if (c.image) imgMap[c.slug] = c.image;
          if (c.min_price > 0) priceMap[c.slug] = c.min_price;
          if (!c.is_active) disabled.add(c.slug);
        });
        setApiImages(imgMap);
        setApiPrices(priceMap);
        setDisabledSlugs(disabled);
      })
      .catch(() => {});
  }, []);

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
          {categoryList
            .filter((card) => !disabledSlugs.has(card.slug) && !disabledSlugs.has(card.id))
            .map((card, index) => {
            const stats = getCategoryStats(card.id, allItems);
            const apiImg = apiImages[card.slug];
            const imageSrc = apiImg ? `https://sushivkus.ru${apiImg}` : card.image;
            // API'де min_price коюлса — аны колдон, жоксо — эсептелген бааны
            const displayPrice = apiPrices[card.slug] || apiPrices[card.id] || stats.minPrice;

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
                    unoptimized={!!apiImg}
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg leading-tight">
                      {card.nameFull}
                    </h3>
                    <p className="text-white font-extrabold text-base sm:text-xl drop-shadow-lg mt-0.5">
                      ОТ {displayPrice} ₽
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
