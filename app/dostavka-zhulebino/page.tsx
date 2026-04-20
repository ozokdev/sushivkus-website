import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Доставка суши в Жулебино — от 35 минут | Аригато Суши",
  description:
    "Доставка суши и роллов в Жулебино из Люберец. Быстрая доставка от 35 минут. Свежие роллы, сеты, пицца. Бесплатно от 1000 ₽. Аригато Суши.",
  keywords:
    "доставка суши Жулебино, суши Жулебино, роллы Жулебино, доставка еды Жулебино, суши на дом Жулебино",
  alternates: { canonical: "/dostavka-zhulebino" },
  openGraph: {
    title: "Доставка суши в Жулебино | Аригато Суши",
    description: "Суши и роллы с доставкой в Жулебино от 35 минут!",
    url: "https://sushivkus.ru/dostavka-zhulebino",
    siteName: "Аригато Суши",
    locale: "ru_RU",
    type: "website",
  },
};

export default function DostavkaZhulebino() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">
            Главная
          </Link>{" "}
          /{" "}
          <Link href="/dostavka-lyubertsy" className="hover:text-accent">
            Доставка
          </Link>{" "}
          / <span className="text-white">Жулебино</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black mb-6">
          Доставка суши в{" "}
          <span className="text-accent">Жулебино</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
          <p>
            <strong>Аригато Суши</strong> доставляет свежие суши, роллы и пиццу в
            Жулебино. Время доставки — от <strong>35 минут</strong>.
          </p>
          <p>
            Жулебино — удобная зона доставки рядом с Люберцами. Мы привозим
            заказы горячими. Бесплатная доставка при заказе от 1000 ₽.
          </p>
          <p>
            Более 100 позиций в меню: роллы, сеты, пицца, поке, супы и салаты.
            Свежие ингредиенты и быстрое приготовление.
          </p>
          <p>
            Заказ онлайн или по телефону{" "}
            <a href="tel:+79255372825" className="text-accent">
              +7 (925) 537-28-25
            </a>
            . Работаем ежедневно с 10:00 до 23:00.
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">
          <h2 className="font-bold text-xl mb-3">Доставка в Жулебино</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Время доставки</p>
              <p className="font-bold text-accent">35-45 минут</p>
            </div>
            <div>
              <p className="text-gray-500">Бесплатно от</p>
              <p className="font-bold text-accent">1000 ₽</p>
            </div>
            <div>
              <p className="text-gray-500">Режим работы</p>
              <p className="font-bold">10:00 — 23:00</p>
            </div>
            <div>
              <p className="text-gray-500">Телефон</p>
              <p className="font-bold">+7 (925) 537-28-25</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Перейти в меню
          </Link>
          <Link
            href="/dostavka-lyubertsy"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Все зоны доставки
          </Link>
        </div>
      </div>
    </div>
  );
}
