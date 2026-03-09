import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 */}
        <div className="relative mb-8">
          <span className="text-[120px] md:text-[160px] font-black text-white/[0.03] leading-none select-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl">🍣</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
          Страница не найдена
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Похоже, эта страница уплыла вместе с лососем. Но не переживайте — у нас
          ещё много вкусного!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            На главную
          </Link>
          <Link
            href="/#menu"
            className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Смотреть меню
          </Link>
        </div>
      </div>
    </div>
  );
}
