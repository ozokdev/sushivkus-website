"use client";

import { useEffect } from "react";
import { UtensilsCrossed, ShoppingCart, Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useToast } from "./Toast";

export default function MobileNav() {
  const router = useRouter();
  const { toggleCart } = useCartStore();
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const totalPrice = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
  const lastOrderId = useOrderStore((s) => s.lastOrderId);
  const showToast = useToast((s) => s.show);

  // Баракча жүктөлгөндө delivered/cancelled заказдарды тазалоо
  useEffect(() => {
    if (!lastOrderId) return;
    fetch(`https://api.sushivkus.ru/api/orders/${lastOrderId}/track`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data || data.status === "delivered" || data.status === "cancelled") {
          useOrderStore.getState().clearLastOrder();
        }
      })
      .catch(() => {});
  }, [lastOrderId]);

  const handleOrderClick = async () => {
    if (!lastOrderId) {
      showToast("Нет активных заказов");
      return;
    }
    try {
      const res = await fetch(`https://api.sushivkus.ru/api/orders/${lastOrderId}/track`);
      if (!res.ok) {
        useOrderStore.getState().clearLastOrder();
        showToast("Нет активных заказов");
        return;
      }
      const data = await res.json();
      if (data.status === "delivered" || data.status === "cancelled") {
        useOrderStore.getState().clearLastOrder();
        showToast("Нет активных заказов");
        return;
      }
      router.push(`/order/${lastOrderId}`);
    } catch {
      router.push(`/order/${lastOrderId}`);
    }
  };

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
        <button
          onClick={() => {
            const input = document.getElementById("menu-search") as HTMLInputElement | null;
            if (input) {
              input.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(() => input.focus(), 400);
            }
          }}
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-accent transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Поиск</span>
        </button>

        {/* Мой заказ */}
        <button
          onClick={handleOrderClick}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            lastOrderId ? "text-accent" : "text-gray-400 hover:text-accent"
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {lastOrderId && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-[10px] font-medium">Заказ</span>
        </button>

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
