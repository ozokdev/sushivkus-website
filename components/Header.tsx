"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, MapPin, Phone, Clock, MessageCircle, Send } from "lucide-react";
import { useCartStore } from "@/store/cartStore";


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { toggleCart } = useCartStore();
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const totalPrice = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark/98 backdrop-blur-xl shadow-lg shadow-black/30"
          : "bg-dark/90 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Логотип */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl md:text-2xl font-black tracking-tight">
              <span className="text-accent">Суши</span>
              <span className="text-white ml-1">Вкус</span>
            </span>
          </a>

          {/* Центр — адрес, телефон, время работы (десктоп) */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-accent" />
              <span>г. Люберцы</span>
            </div>
            <a
              href="tel:+79253206190"
              className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-accent" />
              8 (925) 320-61-90
            </a>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4 text-accent" />
              <span>10:00 – 23:00</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/79253206190"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-green-600/10 hover:bg-green-600/20 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
              </a>
              <a
                href="https://t.me/kelechek_sushi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                title="Telegram"
              >
                <Send className="w-4 h-4 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Правая часть */}
          <div className="flex items-center gap-3">
            {/* Кнопка корзины */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-accent hover:bg-accent-hover rounded-xl transition-all duration-200"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-white text-accent text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              {totalPrice > 0 && (
                <span className="text-white font-semibold text-sm hidden sm:block">
                  {totalPrice} ₽
                </span>
              )}
            </button>

            {/* Бургер мобил */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
            >
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark/98 backdrop-blur-lg border-t border-white/5"
          >
            <div className="px-6 py-4 space-y-3">
              <a
                href="https://yandex.ru/maps/?text=г.+Люберцы,+ул.+Шоссейная,+42"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-accent text-sm transition-colors"
              >
                <MapPin className="w-4 h-4 text-accent" />
                <span>ул. Шоссейная, 42, г. Люберцы</span>
              </a>
              <a href="tel:+79253206190" className="flex items-center gap-2 text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                8 (925) 320-61-90
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span>10:00 – 23:00</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://wa.me/79253206190"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-green-600/10 rounded-lg text-green-500 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href="https://t.me/kelechek_sushi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-lg text-blue-400 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </a>
              </div>
              <div className="border-t border-white/5 pt-3 space-y-1">
                {["Главная", "Меню", "Отзывы", "О нас"].map((label) => (
                  <a
                    key={label}
                    href={`#${label === "Главная" ? "" : label === "Меню" ? "menu" : label === "Отзывы" ? "reviews" : "about"}`}
                    onClick={() => setMobileMenu(false)}
                    className="block py-2 text-gray-300 hover:text-accent transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
