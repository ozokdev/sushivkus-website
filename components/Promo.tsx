"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const promos = [
  {
    title: "Скидка 20%",
    subtitle: "На первый заказ от 1500₽",
    image: "/photo/set_all_inclusive.jpg",
    color: "from-accent to-orange-600",
  },
  {
    title: "Сет дня -30%",
    subtitle: "Каждый день новое предложение",
    image: "/photo/set_romantika.jpg",
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "Бесплатная доставка",
    subtitle: "При заказе от 2000₽",
    image: "/photo/set_california.jpg",
    color: "from-emerald-600 to-teal-600",
  },
];

export default function Promo() {
  return (
    <section id="promo" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Акции</h2>

        <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
          {promos.map((promo, index) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden h-36 md:h-44 group cursor-pointer"
            >
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} opacity-75`} />
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <h3 className="text-white font-bold text-lg md:text-xl">
                  {promo.title}
                </h3>
                <p className="text-white/80 text-xs md:text-sm mt-1">
                  {promo.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
