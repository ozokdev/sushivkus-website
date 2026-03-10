"use client";

import { UtensilsCrossed, ShoppingCart, Phone, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function MobileNav() {
  const { toggleCart } = useCartStore();
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const totalPrice = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-dark/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {/* Меню */}
        <a
          href="#menu"
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-accent transition-colors"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] font-medium">Меню</span>
        </a>

        {/* Поиск */}
        <a
          href="#menu"
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-accent transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Поиск</span>
        </a>

        {/* Телефон */}
        <a
          href="tel:+79255372825"
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-accent transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-medium">Звонок</span>
        </a>

        {/* Корзина */}
        <button
          onClick={toggleCart}
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-accent transition-colors relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">
            {totalPrice > 0 ? `${totalPrice} ₽` : "Корзина"}
          </span>
        </button>
      </div>
    </div>
  );
}
