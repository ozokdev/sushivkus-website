"use client";

import { useState } from "react";
import { X, MapPin } from "lucide-react";

export default function TopBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-accent text-white text-xs sm:text-sm py-2 relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        <a
          href="https://yandex.ru/maps/?text=г.+Люберцы,+ул.+Шоссейная,+42"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-medium underline-offset-2 hover:underline">ул. Шоссейная, 42, г. Люберцы</span>
        </a>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">
            🔥 Промокод <strong className="underline">KELECHEK20</strong> — скидка 20%
          </span>
          <span className="sm:hidden">
            <strong>KELECHEK20</strong> = −20%
          </span>
          <button
            onClick={() => setVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
