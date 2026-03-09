import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Доставка еды в Люберцах — суши, роллы, пицца | Суши Вкус",
  description:
    "Доставка еды по Люберцам: суши, роллы, пицца, поке, супы. Бесплатная доставка от 1000 ₽. Время доставки от 30 минут. Заказ онлайн на sushivkus.ru",
  keywords:
    "доставка еды Люберцы, доставка Люберцы, еда на дом Люберцы, заказать еду Люберцы",
  alternates: { canonical: "/dostavka-lyubertsy" },
  openGraph: {
    title: "Доставка еды в Люберцах | Суши Вкус",
    description: "Быстрая доставка суши, роллов и пиццы по Люберцам!",
    url: "https://sushivkus.ru/dostavka-lyubertsy",
    siteName: "Суши Вкус",
    locale: "ru_RU",
    type: "website",
  },
};

export default function DostavkaLyubertsy() {
  const zones = [
    { name: "Центр Люберец", time: "30-40 мин", free: "от 1000 ₽" },
    { name: "Красная Горка", time: "35-45 мин", free: "от 1000 ₽" },
    { name: "Наташинские пруды", time: "30-40 мин", free: "от 1000 ₽" },
    { name: "Мотяково", time: "40-50 мин", free: "от 1500 ₽" },
    { name: "Томилино", time: "40-55 мин", free: "от 1500 ₽" },
    { name: "Малаховка", time: "45-60 мин", free: "от 1500 ₽" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">
            Главная
          </Link>{" "}
          / <span className="text-white">Доставка в Люберцах</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black mb-6">
          Зоны доставки в{" "}
          <span className="text-accent">Люберцах</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-10 text-gray-300 leading-relaxed space-y-4">
          <p>
            <strong>Суши Вкус</strong> доставляет суши, роллы и пиццу по всем
            районам Люберец и ближайшим населённым пунктам. Мы работаем
            ежедневно с 10:00 до 23:00.
          </p>
          <p>
            Бесплатная доставка при заказе от 1000 ₽ в центральных районах.
            Для отдалённых районов минимальная сумма заказа — от 1500 ₽.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Зоны и время доставки</h2>
        <div className="space-y-3 mb-10">
          {zones.map((zone) => (
            <div
              key={zone.name}
              className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{zone.name}</p>
                <p className="text-gray-500 text-sm">
                  Бесплатно {zone.free}
                </p>
              </div>
              <span className="text-accent font-bold">{zone.time}</span>
            </div>
          ))}
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-10">
          <h3 className="font-bold text-accent mb-2">Как заказать?</h3>
          <ol className="text-gray-300 space-y-1 list-decimal list-inside text-sm">
            <li>Выберите блюда в меню на сайте</li>
            <li>Оформите заказ онлайн или позвоните +7 (925) 537-28-25</li>
            <li>Ожидайте курьера — доставим горячим!</li>
          </ol>
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
