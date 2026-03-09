import { Metadata } from "next";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import { categoryList } from "@/data/categories";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Доставка суши в Люберцах — бесплатно от 1000 ₽ | Суши Вкус",
  description:
    "Доставка суши и роллов в Люберцах от 30 минут. Свежие ингредиенты, большой выбор роллов, сетов и пиццы. Бесплатная доставка от 1000 ₽. Заказ онлайн на sushivkus.ru",
  keywords:
    "доставка суши Люберцы, суши на дом Люберцы, заказать суши Люберцы, доставка роллов Люберцы, суши с доставкой Люберцы, суши Люберцы недорого",
  alternates: { canonical: "/dostavka-sushi-lyubertsy" },
  openGraph: {
    title: "Доставка суши в Люберцах | Суши Вкус",
    description:
      "Быстрая доставка суши, роллов и пиццы в Люберцах. От 30 минут до двери!",
    url: "https://sushivkus.ru/dostavka-sushi-lyubertsy",
    siteName: "Суши Вкус",
    locale: "ru_RU",
    type: "website",
  },
};

export default function DostavkaSushiPage() {
  const popular = menuItems.filter((i) => i.isPopular).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Суши Вкус — Доставка суши в Люберцах",
    url: "https://sushivkus.ru/dostavka-sushi-lyubertsy",
    telephone: "+79255372825",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Шоссейная, 42",
      addressLocality: "Люберцы",
      addressRegion: "Московская область",
      postalCode: "140002",
      addressCountry: "RU",
    },
    servesCuisine: "Японская",
    priceRange: "₽₽",
    areaServed: { "@type": "City", name: "Люберцы" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-accent">
              Главная
            </Link>{" "}
            / <span className="text-white">Доставка суши в Люберцах</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-black mb-6">
            Доставка суши в <span className="text-accent">Люберцах</span>
          </h1>

          <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
            <p>
              <strong>Суши Вкус</strong> — это быстрая доставка свежих суши,
              роллов и пиццы по Люберцам. Мы готовим из свежих ингредиентов и
              доставляем заказ от <strong>30 минут</strong>. Работаем ежедневно с
              10:00 до 23:00.
            </p>
            <p>
              Наш адрес: <strong>ул. Шоссейная, 42, Люберцы</strong>. Вы можете
              заказать онлайн или по телефону{" "}
              <a href="tel:+79255372825" className="text-accent">
                +7 (925) 537-28-25
              </a>
              . Бесплатная доставка при заказе от 1000 ₽.
            </p>
            <p>
              В нашем меню более 100 позиций: классические и запечённые роллы,
              большие сеты для компании, горячая пицца, поке-боулы, супы Том Ям и
              Мисо, свежие салаты и закуски.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4">Популярные позиции</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {popular.map((item) => (
              <Link
                key={item.id}
                href={`/category/${item.category}`}
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

          <h2 className="text-2xl font-bold mb-4">Наши категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {categoryList.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-accent/30 transition-colors text-center"
              >
                <p className="font-bold">{cat.nameFull}</p>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Почему выбирают нас?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              {
                title: "Быстрая доставка",
                desc: "От 30 минут по Люберцам",
              },
              {
                title: "Свежие ингредиенты",
                desc: "Готовим из свежей рыбы каждый день",
              },
              {
                title: "Бесплатная доставка",
                desc: "При заказе от 1000 ₽",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 rounded-xl p-5 border border-white/10"
              >
                <h3 className="font-bold text-accent mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
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
    </>
  );
}
