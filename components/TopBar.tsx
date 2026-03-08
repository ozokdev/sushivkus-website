"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TopBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-accent text-white text-xs sm:text-sm py-2 relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
        <span>
          🔥 Скидка <strong>20%</strong> на первый заказ! Используйте промокод{" "}
          <strong className="underline">KELECHEK20</strong>
        </span>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
