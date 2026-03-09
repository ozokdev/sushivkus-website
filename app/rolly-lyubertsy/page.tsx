import { Metadata } from "next";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Роллы с доставкой в Люберцах — от 199 ₽ | Суши Вкус",
  description:
    "Заказать роллы с доставкой в Люберцах. Филадельфия, Калифорния, запечённые роллы, темпура. Свежие ингредиенты, быстрая доставка от 30 минут. Суши Вкус.",
  keywords:
    "роллы Люберцы, заказать роллы Люберцы, доставка роллов Люберцы, Филадельфия Люберцы, Калифорния ролл Люберцы, роллы на дом Люберцы",
  alternates: { canonical: "/rolly-lyubertsy" },
  openGraph: {
    title: "Роллы с доставкой в Люберцах | Суши Вкус",
    description:
      "Большой выбор роллов с доставкой в Люберцах. Филадельфия, Калифорния и другие!",
    url: "https://sushivkus.ru/rolly-lyubertsy",
    siteName: "Суши Вкус",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RollyPage() {
  const rolls = menuItems.filter((i) => i.category === "rolls").slice(0, 8);
  const minPrice =
    rolls.length > 0 ? Math.min(...rolls.map((i) => i.price)) : 199;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">
            Главная
          </Link>{" "}
          / <span className="text-white">Роллы в Люберцах</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black mb-6">
          Роллы с доставкой в{" "}
          <span className="text-accent">Люберцах</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
          <p>
            Заказывайте свежие роллы с доставкой по Люберцам от{" "}
            <strong>{minPrice} ₽</strong>. В меню <strong>Суши Вкус</strong>{" "}
            — классические роллы, запечённые, темпура, Филадельфия, Калифорния
            и авторские роллы.
          </p>
          <p>
            Мы используем свежий лосось, тунец, угорь и креветки. Каждый ролл
            готовится непосредственно перед доставкой, чтобы вы получили
            максимально свежий продукт.
          </p>
          <p>
            Доставка от 30 минут. Работаем ежедневно с 10:00 до 23:00.
            Бесплатная доставка при заказе от 1000 ₽.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Популярные роллы</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {rolls.map((item) => (
            <Link
              key={item.id}
              href="/category/rolls"
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
            href="/category/rolls"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Все роллы
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
