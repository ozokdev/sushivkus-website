import { Metadata } from "next";
import Link from "next/link";
import { categoryList } from "@/data/categories";

export const metadata: Metadata = {
  title: "Японская кухня в Люберцах с доставкой | Суши Вкус",
  description:
    "Японская кухня с доставкой в Люберцах: суши, роллы, поке, мисо-суп, том ям. Свежие ингредиенты, быстрая доставка от 30 минут. Суши Вкус — Шоссейная 42.",
  keywords:
    "японская кухня Люберцы, японский ресторан Люберцы, суши бар Люберцы, японская еда доставка Люберцы, азиатская кухня Люберцы",
  alternates: { canonical: "/yaponskaya-kuhnya-lyubertsy" },
  openGraph: {
    title: "Японская кухня в Люберцах | Суши Вкус",
    description:
      "Лучшая японская кухня с доставкой в Люберцах. Суши, роллы, поке и многое другое!",
    url: "https://sushivkus.ru/yaponskaya-kuhnya-lyubertsy",
    siteName: "Суши Вкус",
    locale: "ru_RU",
    type: "website",
  },
};

export default function YaponskayaKukhnyaPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">
            Главная
          </Link>{" "}
          / <span className="text-white">Японская кухня в Люберцах</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black mb-6">
          Японская кухня в{" "}
          <span className="text-accent">Люберцах</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
          <p>
            <strong>Суши Вкус</strong> — ваш ресторан японской кухни в
            Люберцах с доставкой на дом. Мы готовим суши, роллы, поке-боулы,
            супы Том Ям и Мисо, салаты и закуски из свежих ингредиентов.
          </p>
          <p>
            Наша кухня сочетает традиционные японские рецепты с современными
            вкусами. Мы используем качественный рис, свежую рыбу (лосось,
            тунец, угорь) и натуральные соусы.
          </p>
          <p>
            Закажите блюда японской кухни онлайн или по телефону{" "}
            <a href="tel:+79255372825" className="text-accent">
              +7 (925) 537-28-25
            </a>
            . Доставка от 30 минут, бесплатно от 1000 ₽.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Наше меню</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {categoryList.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-accent/30 transition-colors text-center"
            >
              <p className="font-bold text-lg mb-1">{cat.nameFull}</p>
              <p className="text-gray-500 text-xs line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Наши преимущества</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            {
              title: "Свежие ингредиенты",
              desc: "Рыба и морепродукты поставляются ежедневно",
            },
            {
              title: "Опытные повара",
              desc: "Готовим по традиционным японским рецептам",
            },
            {
              title: "Быстрая доставка",
              desc: "От 30 минут по всем Люберцам",
            },
            {
              title: "Выгодные цены",
              desc: "Доступная японская кухня без переплат",
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
  );
}
