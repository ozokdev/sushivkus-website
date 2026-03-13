import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Суши Вкус | Доставка суши в Люберцах — Шоссейная 42",
  description:
    "Суши Вкус — доставка суши, роллов и пиццы в Люберцах. Адрес: Шоссейная 42. Быстрая доставка, свежие ингредиенты, доступные цены. Заказ онлайн!",
  keywords:
    "суши Люберцы, роллы Люберцы, доставка суши Люберцы, пицца Люберцы, Суши Вкус, Шоссейная 42, заказать суши Люберцы, доставка еды Люберцы, японская кухня Люберцы",
  metadataBase: new URL("https://sushivkus.ru"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Суши Вкус | Доставка суши в Люберцах",
    description:
      "Суши Вкус — суши, роллы и пицца с доставкой в Люберцах. Шоссейная 42. Заказ онлайн!",
    type: "website",
    url: "https://sushivkus.ru",
    siteName: "Суши Вкус",
    locale: "ru_RU",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Суши Вкус — доставка суши в Люберцах",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Суши Вкус | Доставка суши в Люберцах",
    description:
      "Суши, роллы и пицца с доставкой в Люберцах. Быстро, вкусно, доступно!",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  verification: {
    google: "Xj0qa5j4mun69DqESTlQcKqVxhSxzRbWcym0j388kVY",
  },
  other: {
    "theme-color": "#e63946",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Суши Вкус",
    image: "https://sushivkus.ru/og-image.jpg",
    url: "https://sushivkus.ru",
    telephone: "+79255372825",
    priceRange: "₽₽",
    servesCuisine: "Японская",
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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "23:00",
    },
    hasDeliveryMethod: {
      "@type": "DeliveryMethod",
      name: "Доставка",
    },
    areaServed: {
      "@type": "City",
      name: "Люберцы",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
      bestRating: "5",
      worstRating: "1",
    },
    hasMenu: {
      "@type": "Menu",
      name: "Меню Суши Вкус",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Роллы",
          url: "https://sushivkus.ru/category/rolls",
          hasMenuItem: [
            { "@type": "MenuItem", name: "Филадельфия Классик", offers: { "@type": "Offer", price: "450", priceCurrency: "RUB" } },
            { "@type": "MenuItem", name: "Калифорния Темпура", offers: { "@type": "Offer", price: "420", priceCurrency: "RUB" } },
            { "@type": "MenuItem", name: "Манчестер", offers: { "@type": "Offer", price: "490", priceCurrency: "RUB" } },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Сеты",
          url: "https://sushivkus.ru/category/sets",
          hasMenuItem: [
            { "@type": "MenuItem", name: "Сет All Inclusive", offers: { "@type": "Offer", price: "2990", priceCurrency: "RUB" } },
            { "@type": "MenuItem", name: "Сет Элита", offers: { "@type": "Offer", price: "2490", priceCurrency: "RUB" } },
            { "@type": "MenuItem", name: "Сет Мечта", offers: { "@type": "Offer", price: "2690", priceCurrency: "RUB" } },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Пицца",
          url: "https://sushivkus.ru/category/pizza",
          hasMenuItem: [
            { "@type": "MenuItem", name: "Пепперони", offers: { "@type": "Offer", price: "520", priceCurrency: "RUB" } },
          ],
        },
      ],
    },
    sameAs: [],
  };

  return (
    <html lang="ru" className="light-mode" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(location.pathname.startsWith("/admin")){document.documentElement.className="dark-mode";return}var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.className="dark-mode"}else{document.documentElement.className="light-mode"}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
