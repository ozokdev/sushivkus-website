import { Metadata } from "next";
import Link from "next/link";
import { menuItems } from "@/data/menu";
import { categoryList } from "@/data/categories";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Доставка суши в Люберцах — от 45 минут | Аригато Суши",
  description:
    "🍣 Доставка суши, роллов и пиццы в Люберцах от Аригато Суши. Свежие ингредиенты, быстрая доставка 45–60 минут, бесплатно от 1000 ₽. Адрес: Шоссейная 42. Заказ онлайн круглосуточно!",
  keywords:
    "доставка суши Люберцы, суши на дом Люберцы, заказать суши Люберцы, доставка роллов Люберцы, суши с доставкой Люберцы, суши Люберцы недорого, Аригато Суши Люберцы, доставка еды Люберцы, японская кухня Люберцы, роллы на заказ Люберцы, суши круглосуточно",
  alternates: { canonical: "/dostavka-sushi-lyubertsy" },
  openGraph: {
    title: "Доставка суши в Люберцах | Аригато Суши",
    description:
      "Быстрая доставка суши, роллов и пиццы в Люберцах. 45–60 минут до двери!",
    url: "https://sushivkus.ru/dostavka-sushi-lyubertsy",
    siteName: "Аригато Суши",
    locale: "ru_RU",
    type: "website",
  },
};

export default function DostavkaSushiPage() {
  const popular = menuItems.filter((i) => i.isPopular).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Аригато Суши — Доставка суши в Люберцах",
    url: "https://sushivkus.ru/dostavka-sushi-lyubertsy",
    telephone: "+79255372825",
    image: "https://sushivkus.ru/opengraph-image",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Шоссейная, 42",
      addressLocality: "Люберцы",
      addressRegion: "Московская область",
      postalCode: "140002",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 55.6786,
      longitude: 37.8947,
    },
    servesCuisine: ["Японская", "Суши", "Пицца"],
    priceRange: "₽₽",
    areaServed: [
      { "@type": "City", name: "Люберцы" },
      { "@type": "City", name: "Некрасовка" },
      { "@type": "City", name: "Жулебино" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://sushivkus.ru" },
      { "@type": "ListItem", position: 2, name: "Доставка суши в Люберцах", item: "https://sushivkus.ru/dostavka-sushi-lyubertsy" },
    ],
  };

  const faqs = [
    {
      q: "Сколько стоит доставка суши в Люберцах?",
      a: "Доставка бесплатная при заказе от 1000 ₽. При сумме меньше 1000 ₽ стоимость доставки — 200 ₽. Минимальный заказ на доставку — 500 ₽.",
    },
    {
      q: "Как быстро доставят суши в Люберцах?",
      a: "Среднее время доставки — 45–60 минут. В часы пик (пятница-воскресенье вечером) возможно увеличение до 90 минут. Мы всегда предупреждаем, если время выходит за рамки стандарта.",
    },
    {
      q: "В какие районы Люберец доставляете?",
      a: "Мы доставляем по всему городу Люберцы, а также в Некрасовку, Жулебино, Томилино, Красково. Точную зону доставки уточняйте у оператора по телефону +7 (925) 537-28-25.",
    },
    {
      q: "Какие способы оплаты доступны?",
      a: "Принимаем наличные курьеру, банковские карты (Visa, Mastercard, МИР) онлайн и при получении, а также переводы через СБП и на карту Сбербанк.",
    },
    {
      q: "Где забрать заказ самовывозом?",
      a: "Забрать заказ можно по адресу ул. Шоссейная, 42, г. Люберцы. При самовывозе действует скидка 10%.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-accent">Главная</Link>
            {" / "}
            <span className="text-white">Доставка суши в Люберцах</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Доставка суши в <span className="text-accent">Люберцах</span> — от 45 минут
          </h1>

          <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
            <p className="text-lg">
              <strong>Аригато Суши</strong> — это быстрая и вкусная доставка свежих суши, роллов и пиццы
              по городу Люберцы и в ближайшие районы Подмосковья. Мы готовим из качественных ингредиентов
              каждый день и доставляем заказ в среднем за <strong>45–60 минут</strong>.
            </p>
            <p>
              Наш ресторан расположен по адресу <strong>ул. Шоссейная, 42, г. Люберцы</strong>.
              Вы можете заказать доставку онлайн на сайте, по телефону{" "}
              <a href="tel:+79255372825" className="text-accent font-semibold">+7 (925) 537-28-25</a>{" "}
              или через WhatsApp и Telegram. Доставка <strong>бесплатная при заказе от 1000 ₽</strong>,
              при сумме меньше — 200 ₽.
            </p>
            <p>
              В нашем меню более 100 позиций: <strong>классические и запечённые роллы</strong>{" "}
              (Филадельфия, Калифорния, Мастер, Цезарь), <strong>большие сеты</strong> на компанию от 16
              до 96 штук, <strong>горячая пицца</strong> из дровяной печи, поке-боулы с лососем и тунцом,
              супы Том Ям и Мисо, свежие салаты, закуски и горячие блюда.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Почему выбирают Аригато Суши?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { title: "Быстрая доставка", desc: "Среднее время — 45–60 минут. Отслеживание заказа онлайн." },
              { title: "Свежие ингредиенты", desc: "Закупаем рыбу и овощи каждое утро. Готовим только по заказу." },
              { title: "Бесплатная доставка", desc: "При заказе от 1000 ₽ по всем Люберцам." },
              { title: "Большой выбор", desc: "Более 100 позиций — от классических роллов до поке и пиццы." },
              { title: "Удобная оплата", desc: "Наличные, карта, СБП, онлайн-оплата через ЮKassa." },
              { title: "Скидка на самовывоз", desc: "Забирайте заказ сами по адресу Шоссейная 42 со скидкой 10%." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="font-bold text-accent mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Популярные позиции</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {popular.map((item) => (
              <Link
                key={item.id}
                href={`/category/${item.category}`}
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-colors"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={item.image} alt={`${item.name} — доставка в Люберцах`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-accent font-bold">{item.price} ₽</p>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Все категории меню</h2>
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

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Зона доставки</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">
            <p className="text-gray-300 mb-4">
              Мы доставляем свежие суши и роллы в следующие районы:
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300">
              <li>✓ Люберцы (весь город)</li>
              <li>✓ <Link href="/dostavka-nekrasovka" className="text-accent hover:underline">Некрасовка</Link></li>
              <li>✓ <Link href="/dostavka-zhulebino" className="text-accent hover:underline">Жулебино</Link></li>
              <li>✓ Томилино</li>
              <li>✓ Красково</li>
              <li>✓ Октябрьский</li>
            </ul>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
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

          <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Готовы заказать?</h2>
            <p className="text-gray-300 mb-5">
              Выберите роллы, сеты или пиццу в нашем меню — доставим за 45–60 минут!
            </p>
            <Link
              href="/"
              className="inline-block bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              Смотреть меню →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
