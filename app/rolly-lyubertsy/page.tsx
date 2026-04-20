import { Metadata } from "next";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Роллы с доставкой в Люберцах — от 199 ₽ | Аригато Суши",
  description:
    "🍱 Заказать роллы с доставкой в Люберцах. Филадельфия, Калифорния, запечённые роллы, темпура от 199 ₽. Свежая рыба, быстрая доставка 45–60 минут. Бесплатно от 1000 ₽.",
  keywords:
    "роллы Люберцы, заказать роллы Люберцы, доставка роллов Люберцы, Филадельфия Люберцы, Калифорния ролл Люберцы, роллы на дом Люберцы, запечённые роллы Люберцы, темпура роллы Люберцы, дешёвые роллы Люберцы, роллы с лососем Люберцы",
  alternates: { canonical: "/rolly-lyubertsy" },
  openGraph: {
    title: "Роллы с доставкой в Люберцах | Аригато Суши",
    description:
      "Большой выбор роллов с доставкой в Люберцах. Филадельфия, Калифорния и другие!",
    url: "https://sushivkus.ru/rolly-lyubertsy",
    siteName: "Аригато Суши",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RollyPage() {
  const rolls = menuItems.filter((i) => i.category === "rolls").slice(0, 8);
  const minPrice = rolls.length > 0 ? Math.min(...rolls.map((i) => i.price)) : 199;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://sushivkus.ru" },
      { "@type": "ListItem", position: 2, name: "Роллы в Люберцах", item: "https://sushivkus.ru/rolly-lyubertsy" },
    ],
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Роллы — Аригато Суши Люберцы",
    image: "https://sushivkus.ru/opengraph-image",
    description: "Свежие роллы с доставкой в Люберцах. Классические, запечённые, Филадельфия, Калифорния.",
    brand: { "@type": "Brand", name: "Аригато Суши" },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: minPrice,
      highPrice: 990,
      priceCurrency: "RUB",
      offerCount: rolls.length,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
    },
  };

  const faqs = [
    {
      q: "Сколько стоит самый дешёвый ролл в Люберцах?",
      a: `В нашем меню роллы начинаются от ${minPrice} ₽. Это классические роллы с огурцом, авокадо или лососем. Большие запечённые и авторские роллы — от 390–490 ₽.`,
    },
    {
      q: "Какие самые популярные роллы?",
      a: "Хиты нашего меню: Филадельфия Классик, Калифорния с крабом, Манчестер, Цезарь, Окинава и запечённые роллы с лососем.",
    },
    {
      q: "Есть ли вегетарианские роллы?",
      a: "Да! У нас есть вегетарианский ролл, ролл с огурцом, с авокадо, с манго. Ищите в категории «Роллы» на сайте.",
    },
    {
      q: "Можно ли заказать роллы без имбиря и васаби?",
      a: "Конечно. Напишите в комментарии к заказу «без имбиря» или «без васаби» — мы учтём.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-accent">Главная</Link>
            {" / "}
            <span className="text-white">Роллы в Люберцах</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Роллы с доставкой в <span className="text-accent">Люберцах</span> — от {minPrice} ₽
          </h1>

          <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
            <p className="text-lg">
              Заказывайте свежие <strong>роллы в Люберцах</strong> от <strong>{minPrice} ₽</strong>{" "}
              с доставкой от <strong>Аригато Суши</strong>. В нашем меню — более 30 видов роллов:
              классические, запечённые, темпура, авторские с креативными начинками.
            </p>
            <p>
              Мы используем <strong>свежего лосося и тунца</strong> премиум-класса, качественный
              нори, ароматный рис и свежие овощи. Каждый ролл готовится{" "}
              <strong>непосредственно перед доставкой</strong>, чтобы рис был тёплым, а рыба — свежей.
              Никаких замороженных заготовок — только свежая ежедневная готовка.
            </p>
            <p>
              Работаем <strong>ежедневно с 10:00 до 22:00</strong>. Доставка занимает 45–60 минут.
              При заказе от 1000 ₽ — <strong>доставка бесплатно</strong>. Самовывоз по адресу
              Шоссейная 42 со скидкой 10%.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Виды роллов в нашем меню</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { title: "Классические роллы", desc: "Калифорния, Филадельфия, Цезарь, Манчестер — знакомые всем любимые вкусы." },
              { title: "Запечённые роллы", desc: "Горячие роллы с сырной шапкой — хит осени и зимы, сытные и ароматные." },
              { title: "Темпура роллы", desc: "Роллы в хрустящей японской панировке — обалденно хрустят снаружи, нежные внутри." },
              { title: "Авторские роллы", desc: "Эксклюзивные рецепты нашего шефа — яркие сочетания вкусов и необычные начинки." },
              { title: "Роллы с лососем", desc: "Самые популярные — с нежным копчёным и свежим лососем." },
              { title: "Вегетарианские", desc: "Роллы без рыбы: с авокадо, огурцом, манго, сыром филадельфия." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="font-bold text-accent mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Популярные роллы</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {rolls.map((item) => (
              <Link
                key={item.id}
                href="/category/rolls"
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-colors"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={item.image} alt={`${item.name} — роллы с доставкой в Люберцах`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-accent font-bold">{item.price} ₽</p>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Похожие страницы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
            <Link href="/sety-lyubertsy" className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-accent/30 transition-colors">
              <p className="font-bold">Сеты роллов</p>
              <p className="text-gray-500 text-sm">Большие наборы — выгоднее</p>
            </Link>
            <Link href="/dostavka-sushi-lyubertsy" className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-accent/30 transition-colors">
              <p className="font-bold">Доставка суши</p>
              <p className="text-gray-500 text-sm">Условия и зоны доставки</p>
            </Link>
            <Link href="/yaponskaya-kuhnya-lyubertsy" className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-accent/30 transition-colors">
              <p className="font-bold">Японская кухня</p>
              <p className="text-gray-500 text-sm">Поке, супы, сашими</p>
            </Link>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Вопросы о роллах</h2>
          <div className="space-y-3 mb-10">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>{f.q}</span>
                  <span className="text-accent group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/category/rolls" className="inline-block bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Все роллы
            </Link>
            <Link href="/" className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              В меню
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
