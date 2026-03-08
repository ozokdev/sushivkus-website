import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KELECHEK SUSHI | Доставка свежих суши",
  description:
    "Заказывайте свежие суши, роллы и сеты с быстрой доставкой. Лучшие ингредиенты и доступные цены.",
  keywords: "суши, роллы, доставка, сеты, японская кухня",
  openGraph: {
    title: "KELECHEK SUSHI | Доставка свежих суши",
    description: "Свежие суши с доставкой до двери",
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
