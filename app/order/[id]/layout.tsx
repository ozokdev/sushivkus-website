import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отслеживание заказа | Аригато Суши",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
