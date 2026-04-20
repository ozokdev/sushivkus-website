import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Оформление заказа | Аригато Суши",
  description: "Оформите заказ на доставку суши и роллов в Люберцах. Быстрая доставка от Аригато Суши.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
