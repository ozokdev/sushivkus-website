import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Суши Вкус | Доставка суши в Люберцах — Шоссейная 42",
  description:
    "Суши Вкус — доставка суши, роллов и пиццы в Люберцах. Адрес: Шоссейная 42. Быстрая доставка, свежие ингредиенты, доступные цены. Заказ онлайн!",
  keywords: "суши Люберцы, роллы Люберцы, доставка суши Люберцы, пицца Люберцы, Суши Вкус, Шоссейная 42, заказать суши Люберцы",
  openGraph: {
    title: "Суши Вкус | Доставка суши в Люберцах",
    description: "Суши Вкус — суши, роллы и пицца с доставкой в Люберцах. Шоссейная 42.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
