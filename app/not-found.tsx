import Link from "next/link";
import { Home, UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#0a0a0a" }}
    >
      <div className="text-center max-w-md w-full">
        <div className="relative mb-6">
          <span
            className="text-[140px] md:text-[180px] font-black leading-none select-none block bg-gradient-to-br from-[#e63946]/40 to-[#e63946]/5 bg-clip-text"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{
                background: "rgba(230,57,70,0.1)",
                border: "1px solid rgba(230,57,70,0.2)",
                boxShadow: "0 20px 60px -20px rgba(230,57,70,0.3)",
              }}
            >
              <span className="text-5xl md:text-6xl">🍣</span>
            </div>
          </div>
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "#fff" }}
        >
          Страница не найдена
        </h1>
        <p
          className="mb-8 leading-relaxed text-sm md:text-base"
          style={{ color: "#888" }}
        >
          Похоже, эта страница уплыла вместе с лососем. Но у нас ещё много вкусного!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors"
            style={{ background: "#e63946", color: "#fff" }}
          >
            <Home className="w-4 h-4" />
            На главную
          </Link>
          <Link
            href="/#menu"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Меню
          </Link>
        </div>
      </div>
    </div>
  );
}
