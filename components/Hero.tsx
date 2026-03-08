"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 7 слайдов промо-баннеров
const slides = [
  {
    id: 1,
    title: "Скидка 20% на первый заказ",
    subtitle: "Для новых клиентов при заказе от 1500₽. Промокод KELECHEK20",
    image: "/photo/set_elita.jpg",
    badge: "АКЦИЯ",
    gradient: "from-accent/80 to-orange-600/60",
  },
  {
    id: 2,
    title: "Сет Мечта — хит продаж!",
    subtitle: "40 шт. лучших роллов всего за 2690₽",
    image: "/photo/set_mechta.jpg",
    badge: "ХИТ",
    gradient: "from-purple-600/80 to-pink-600/60",
  },
  {
    id: 3,
    title: "Бесплатная доставка",
    subtitle: "При заказе от 2000₽ доставим бесплатно по Люберцам",
    image: "/photo/set_boni_klaid.jpg",
    badge: "FREE",
    gradient: "from-emerald-600/80 to-teal-600/60",
  },
  {
    id: 4,
    title: "Новые поке-боулы",
    subtitle: "Попробуйте свежие поке с лососем, тунцом и креветкой",
    image: "/photo/poke_salmon.jpg",
    badge: "NEW",
    gradient: "from-blue-600/80 to-cyan-600/60",
  },
  {
    id: 5,
    title: "Сет Корпоратив — 64 шт.",
    subtitle: "Идеально для компании! Большой выбор роллов по выгодной цене",
    image: "/photo/set_corporativ.jpg",
    badge: "ТОП",
    gradient: "from-amber-600/80 to-yellow-600/60",
  },
  {
    id: 6,
    title: "Том Ям — тайский хит",
    subtitle: "Горячий суп с креветками и кокосовым молоком",
    image: "/photo/tom_yam_shrimp.jpg",
    badge: "ГОРЯЧЕЕ",
    gradient: "from-red-700/80 to-orange-700/60",
  },
  {
    id: 7,
    title: "Пицца на любой вкус",
    subtitle: "6 видов пиццы: Пепперони, 4 сыра, Маргарита и другие",
    image: "/photo/pepperoni.jpg",
    badge: "ПИЦЦА",
    gradient: "from-rose-600/80 to-red-600/60",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-[200px] sm:h-[280px] md:h-[380px] lg:h-[420px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[current].image}
                alt={slides[current].title}
                fill
                className="object-cover"
                priority
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slides[current].gradient}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-block w-fit px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-bold tracking-wider mb-3"
                >
                  {slides[current].badge}
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-2 max-w-lg drop-shadow-lg"
                >
                  {slides[current].title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-white/80 text-sm sm:text-base md:text-lg max-w-md"
                >
                  {slides[current].subtitle}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Стрелки навигации */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-all hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-all hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Индикаторы + прогресс */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Счётчик слайдов */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 text-white/70 text-xs font-medium">
            {current + 1} / {slides.length}
          </div>
        </div>
      </div>
    </section>
  );
}
