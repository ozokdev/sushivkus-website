import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Доставка суши в Некрасовку — от 30 минут | Суши Вкус",
  description:
    "Доставка суши и роллов в Некрасовку из Люберец. Быстрая доставка от 30 минут. Свежие роллы, сеты, пицца. Бесплатно от 1000 ₽. Суши Вкус.",
  keywords:
    "доставка суши Некрасовка, суши Некрасовка, роллы Некрасовка, доставка еды Некрасовка, суши на дом Некрасовка",
  alternates: { canonical: "/dostavka-nekrasovka" },
  openGraph: {
    title: "Доставка суши в Некрасовку | Суши Вкус",
    description: "Суши и роллы с доставкой в Некрасовку от 30 минут!",
    url: "https://sushivkus.ru/dostavka-nekrasovka",
    siteName: "Суши Вкус",
    locale: "ru_RU",
    type: "website",
  },
};

export default function DostavkaNekrasovka() {
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
          / <span className="text-white">Некрасовка</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black mb-6">
          Доставка суши в{" "}
          <span className="text-accent">Некрасовку</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
          <p>
            <strong>Суши Вкус</strong> доставляет свежие суши, роллы и пиццу в
            Некрасовку из Люберец. Время доставки — от{" "}
            <strong>30 минут</strong>.
          </p>
          <p>
            Некрасовка — одна из ближайших зон доставки. Мы привозим заказы
            горячими и свежими. Бесплатная доставка при заказе от 1000 ₽.
          </p>
          <p>
            В нашем меню — более 100 позиций: роллы Филадельфия, Калифорния,
            запечённые роллы, большие сеты, горячая пицца, поке-боулы и супы.
          </p>
          <p>
            Заказ онлайн на сайте или по телефону{" "}
            <a href="tel:+79255372825" className="text-accent">
              +7 (925) 537-28-25
            </a>
            . Работаем ежедневно с 10:00 до 23:00.
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">
          <h2 className="font-bold text-xl mb-3">Доставка в Некрасовку</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Время доставки</p>
              <p className="font-bold text-accent">30-40 минут</p>
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
