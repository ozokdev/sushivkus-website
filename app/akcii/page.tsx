import { Metadata } from "next";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Акции на суши в Люберцах — скидки и выгодные предложения | Аригато Суши",
  description:
    "Акции и скидки на доставку суши в Люберцах. Выгодные сеты, бесплатная доставка от 1000 ₽, скидки на первый заказ. Аригато Суши — Шоссейная 42.",
  keywords:
    "акции суши Люберцы, скидки суши Люберцы, выгодные сеты Люберцы, промо суши, акции на роллы",
  alternates: { canonical: "/akcii" },
  openGraph: {
    title: "Акции на суши в Люберцах | Аригато Суши",
    description:
      "Выгодные акции на суши, роллы и сеты с доставкой в Люберцах!",
    url: "https://sushivkus.ru/akcii",
    siteName: "Аригато Суши",
    locale: "ru_RU",
    type: "website",
  },
};

export default function AkciiPage() {
  const sets = menuItems.filter((i) => i.category === "sets").slice(0, 4);

  const promos = [
    {
      title: "Бесплатная доставка",
      desc: "При заказе от 1000 ₽ доставка бесплатно по всем Люберцам",
      badge: "от 1000 ₽",
      color: "border-green-500/30 bg-green-500/5",
      badgeColor: "bg-green-500",
    },
    {
      title: "Выгодные сеты",
      desc: "Закажите сет и сэкономьте до 30% по сравнению с заказом по отдельности",
      badge: "-30%",
      color: "border-accent/30 bg-accent/5",
      badgeColor: "bg-accent",
    },
    {
      title: "Скидка на самовывоз",
      desc: "Заберите заказ сами по адресу Шоссейная 42 и получите скидку 10%",
      badge: "-10%",
      color: "border-yellow-500/30 bg-yellow-500/5",
      badgeColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">
            Главная
          </Link>{" "}
          / <span className="text-white">Акции</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black mb-6">
          Акции на суши в{" "}
          <span className="text-accent">Люберцах</span>
        </h1>

        <p className="text-gray-300 mb-10 max-w-2xl leading-relaxed">
          Выгодные предложения от <strong>Аригато Суши</strong>. Экономьте на
          заказе суши и роллов с доставкой в Люберцах. Следите за обновлениями
          — мы регулярно добавляем новые акции!
        </p>

        <div className="space-y-4 mb-12">
          {promos.map((promo) => (
            <div
              key={promo.title}
              className={`rounded-xl p-6 border ${promo.color} flex items-start gap-4`}
            >
              <span
                className={`${promo.badgeColor} text-white text-sm font-bold px-3 py-1 rounded-lg shrink-0`}
              >
                {promo.badge}
              </span>
              <div>
                <h2 className="font-bold text-lg mb-1">{promo.title}</h2>
                <p className="text-gray-400 text-sm">{promo.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Выгодные сеты</h2>
        <p className="text-gray-500 text-sm mb-4">
          Сеты — самый выгодный способ заказать суши. Экономия до 30%!
        </p>
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

        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Перейти в меню
          </Link>
        </div>
      </div>
    </div>
  );
}
