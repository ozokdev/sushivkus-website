"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

import DeliveryInfo from "@/components/DeliveryInfo";
import WorkTimer from "@/components/WorkTimer";
import PageTabs from "@/components/PageTabs";
import Promo from "@/components/Promo";
import MenuSection from "@/components/Menu";
import CategoryGrid from "@/components/CategoryGrid";
import Cart from "@/components/Cart";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MobileNav from "@/components/MobileNav";
import Toast from "@/components/Toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <>
      {/* Верхняя промо-полоска */}
      <TopBar />
      <Header />
      <main>
        {/* 1. Промо слайдер — 7 слайдов */}
        <Hero />
        {/* 3. Таймер работы */}
        <WorkTimer />
        {/* 4. Блок доставки */}
        <DeliveryInfo />
        {/* 5. Табы: Главная / Отзывы / О нас */}
        <PageTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "main" && (
          <>
            <Promo />
            <CategoryGrid />
            <MenuSection />
          </>
        )}

        {activeTab === "reviews" && (
          <section id="reviews" className="py-16 pb-24 md:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8">Отзывы</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Анна К.",
                    rating: 5,
                    text: "Заказываю уже третий раз! Роллы всегда свежие, доставка быстрая. Особенно понравился сет Элита — рекомендую!",
                  },
                  {
                    name: "Дмитрий В.",
                    rating: 5,
                    text: "Лучшая доставка суши в Люберцах. Филадельфия Классик — огонь! Курьер приехал за 40 минут.",
                  },
                  {
                    name: "Мария С.",
                    rating: 4,
                    text: "Хорошие порции, свежие ингредиенты. Том Ям с креветками — отличный. Буду заказывать ещё!",
                  },
                  {
                    name: "Алексей П.",
                    rating: 5,
                    text: "Заказали сет Корпоратив на работу — хватило на 8 человек! Все были довольны, цена приятная.",
                  },
                  {
                    name: "Елена Т.",
                    rating: 5,
                    text: "Поке с лососем просто восхитительный! Красивая подача, всё свежее и вкусное.",
                  },
                  {
                    name: "Сергей Н.",
                    rating: 4,
                    text: "Пицца Пепперони и Калифорния Темпура — мой любимый заказ. Всегда доставляют вовремя.",
                  },
                ].map((review) => (
                  <div
                    key={review.name}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-yellow-400 text-sm">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section id="about" className="py-16 pb-24 md:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8">О нас</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong className="text-white">KELECHEK SUSHI</strong> — это
                    доставка свежих суши и роллов в г. Люберцы. Мы работаем для
                    вас ежедневно с 10:00 до 23:00.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Наши повара готовят каждый ролл с любовью, используя только
                    свежие и качественные ингредиенты. Мы закупаем рыбу у
                    проверенных поставщиков и следим за качеством каждого
                    продукта.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Доставляем по Люберцам и ближайшим районам. Минимальная сумма
                    заказа — 500₽. Бесплатная доставка от 2000₽.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="font-bold mb-2">📍 Адрес</h3>
                    <p className="text-gray-400 text-sm">
                      Суши пицца шосейная 42
                    </p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="font-bold mb-2">📞 Телефон</h3>
                    <a
                      href="tel:+79253206190"
                      className="text-accent text-sm hover:underline"
                    >
                      8 (925) 320-61-90
                    </a>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="font-bold mb-2">🕐 Время работы</h3>
                    <p className="text-gray-400 text-sm">
                      Ежедневно: 10:00 — 23:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Cart />
      <OrderForm />
      <ScrollToTop />
      {/* Мобильная нижняя навигация */}
      <MobileNav />
      {/* Тост уведомления */}
      <Toast />
    </>
  );
}
