import { Metadata } from "next";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Сеты роллов с доставкой в Люберцах — выгодные наборы | Аригато Суши",
  description:
    "Заказать сеты роллов с доставкой в Люберцах. Большие наборы от 16 до 64 штук для компании, семьи или корпоратива. Выгодные цены, быстрая доставка.",
  keywords:
    "сеты роллов Люберцы, наборы суши Люберцы, сет суши доставка Люберцы, большой сет роллов, сеты для компании Люберцы",
  alternates: { canonical: "/sety-lyubertsy" },
  openGraph: {
    title: "Сеты роллов в Люберцах | Аригато Суши",
    description:
      "Выгодные сеты роллов с доставкой в Люберцах. Наборы от 16 до 64 штук!",
    url: "https://sushivkus.ru/sety-lyubertsy",
    siteName: "Аригато Суши",
    locale: "ru_RU",
    type: "website",
  },
};

export default function SetyPage() {
  const sets = menuItems.filter((i) => i.category === "sets").slice(0, 8);
  const minPrice =
    sets.length > 0 ? Math.min(...sets.map((i) => i.price)) : 599;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">
            Главная
          </Link>{" "}
          / <span className="text-white">Сеты в Люберцах</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black mb-6">
          Сеты роллов с доставкой в{" "}
          <span className="text-accent">Люберцах</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
          <p>
            Выгодные сеты роллов от <strong>{minPrice} ₽</strong> с доставкой
            по Люберцам. Наборы от 16 до 64 штук — идеально для двоих,
            компании или корпоратива.
          </p>
          <p>
            В каждом сете — разнообразие вкусов: классические, запечённые и
            авторские роллы. Закажите сет и сэкономьте до 30% по сравнению с
            заказом по отдельности.
          </p>
          <p>
            Доставка от 30 минут. Бесплатно при заказе от 1000 ₽. Работаем
            ежедневно с 10:00 до 23:00.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Наши сеты</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {sets.map((item) => (
            <Link
              key={item.id}
              href="/category/sets"
              className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-colors"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                <p className="text-accent font-bold">{item.price} ₽</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/category/sets"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Все сеты
          </Link>
          <Link
            href="/"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            В меню
          </Link>
        </div>
      </div>
    </div>
  );
}
