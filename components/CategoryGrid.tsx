"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { menuItems, type Category } from "@/data/menu";

// Категории с подходящими фото
const categoryCards: {
  id: Category;
  name: string;
  image: string;
}[] = [
  {
    id: "rolls",
    name: "РОЛЛЫ",
    image: "/photo/california_tempura.jpg",
  },
  {
    id: "sets",
    name: "СЕТЫ",
    image: "/photo/set_all_inclusive.jpg",
  },
  {
    id: "pizza",
    name: "ПИЦЦА",
    image: "/photo/pepperoni.jpg",
  },
  {
    id: "poke",
    name: "ПОКЕ",
    image: "/photo/poke_salmon.jpg",
  },
  {
    id: "soups",
    name: "СУПЫ",
    image: "/photo/tom_yam_shrimp.jpg",
  },
  {
    id: "snacks",
    name: "ЗАКУСКИ",
    image: "/photo/krevetki_tempura.jpg",
  },
  {
    id: "salads",
    name: "САЛАТЫ",
    image: "/photo/salat_caesar.jpg",
  },
  {
    id: "sauces",
    name: "СОУСЫ",
    image: "/photo/orehovyy_sous.jpg",
  },
];

// Получаем минимальную цену и кол-во для каждой категории
function getCategoryStats(catId: Category) {
  const items = menuItems.filter((item) => item.category === catId);
  const minPrice =
    items.length > 0 ? Math.min(...items.map((i) => i.price)) : 0;
  return { count: items.length, minPrice };
}

export default function CategoryGrid() {
  const handleClick = (catId: Category) => {
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
          {categoryCards.map((card, index) => {
            const stats = getCategoryStats(card.id);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: Math.min(index * 0.06, 0.35) }}
                onClick={() => handleClick(card.id)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
              >
                {/* Фоновое изображение */}
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />

                {/* Градиент */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />

                {/* Бейдж кол-во */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/15 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-lg">
                    {stats.count} поз.
                  </span>
                </div>

                {/* Название и цена */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg uppercase tracking-wide leading-tight">
                    {card.name}
                  </h3>
                  <p className="text-white/70 text-[11px] sm:text-xs mt-0.5 font-medium">
                    от {stats.minPrice} ₽
                  </p>
                </div>

                {/* Ховер-линия снизу */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
