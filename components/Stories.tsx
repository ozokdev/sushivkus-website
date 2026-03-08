"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const stories = [
  {
    id: 1,
    title: "Новинки",
    thumb: "/photo/poke_tuna.jpg",
    slides: [
      { image: "/photo/poke_tuna.jpg", text: "Поке с тунцом — 480₽" },
      { image: "/photo/poke_eel.jpg", text: "Поке с угрём — 490₽" },
    ],
  },
  {
    id: 2,
    title: "Хиты",
    thumb: "/photo/philadelphia_classic.jpg",
    slides: [
      { image: "/photo/philadelphia_classic.jpg", text: "Филадельфия Классик — 450₽" },
      { image: "/photo/manchester.jpg", text: "Манчестер — 490₽" },
    ],
  },
  {
    id: 3,
    title: "Сеты",
    thumb: "/photo/set_elita.jpg",
    slides: [
      { image: "/photo/set_elita.jpg", text: "Сет Элита — 32шт за 2490₽" },
      { image: "/photo/set_mechta.jpg", text: "Сет Мечта — 40шт за 2690₽" },
    ],
  },
  {
    id: 4,
    title: "Пицца",
    thumb: "/photo/pepperoni.jpg",
    slides: [
      { image: "/photo/pepperoni.jpg", text: "Пепперони — 520₽" },
      { image: "/photo/four_cheese.jpg", text: "4 сыра — 590₽" },
    ],
  },
  {
    id: 5,
    title: "Горячее",
    thumb: "/photo/tom_yam_shrimp.jpg",
    slides: [
      { image: "/photo/tom_yam_shrimp.jpg", text: "Том Ям с креветками — 420₽" },
      { image: "/photo/tom_yam_salmon.jpg", text: "Том Ям с лососем — 390₽" },
    ],
  },
  {
    id: 6,
    title: "Акции",
    thumb: "/photo/set_all_inclusive.jpg",
    slides: [
      { image: "/photo/set_all_inclusive.jpg", text: "Сет All Inclusive — 48шт за 2990₽" },
      { image: "/photo/set_corporativ.jpg", text: "Сет Корпоратив — 64шт за 3990₽" },
    ],
  },
];

export default function Stories() {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const openStory = (id: number) => {
    setActiveStory(id);
    setSlideIndex(0);
  };

  const closeStory = () => {
    setActiveStory(null);
    setSlideIndex(0);
  };

  const currentStory = stories.find((s) => s.id === activeStory);

  const nextSlide = () => {
    if (!currentStory) return;
    if (slideIndex < currentStory.slides.length - 1) {
      setSlideIndex((p) => p + 1);
    } else {
      // Переход к следующей истории
      const idx = stories.findIndex((s) => s.id === activeStory);
      if (idx < stories.length - 1) {
        setActiveStory(stories[idx + 1].id);
        setSlideIndex(0);
      } else {
        closeStory();
      }
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex((p) => p - 1);
    } else {
      const idx = stories.findIndex((s) => s.id === activeStory);
      if (idx > 0) {
        setActiveStory(stories[idx - 1].id);
        setSlideIndex(stories[idx - 1].slides.length - 1);
      }
    }
  };

  return (
    <>
      {/* Превью сторис */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => openStory(story.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] bg-gradient-to-br from-accent via-orange-500 to-pink-500">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-dark">
                  <Image
                    src={story.thumb}
                    alt={story.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="text-[11px] text-gray-400 group-hover:text-white transition-colors">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Полноэкранная история */}
      <AnimatePresence>
        {currentStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          >
            <div className="relative w-full max-w-md h-full max-h-[90vh] mx-auto">
              {/* Прогресс бар */}
              <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
                {currentStory.slides.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white rounded-full transition-all duration-300 ${
                        idx < slideIndex
                          ? "w-full"
                          : idx === slideIndex
                          ? "w-full animate-pulse"
                          : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Закрыть */}
              <button
                onClick={closeStory}
                className="absolute top-10 right-4 z-10 p-2 bg-black/30 rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Изображение */}
              <Image
                src={currentStory.slides[slideIndex].image}
                alt=""
                fill
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 rounded-xl" />

              {/* Текст */}
              <div className="absolute bottom-8 left-6 right-6">
                <p className="text-white text-xl font-bold drop-shadow-lg">
                  {currentStory.slides[slideIndex].text}
                </p>
              </div>

              {/* Навигация по клику */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-0 w-1/3 h-full z-[5]"
              />
              <button
                onClick={nextSlide}
                className="absolute right-0 top-0 w-2/3 h-full z-[5]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
