"use client";

import { useState } from "react";
import { Clock, ShoppingBag, Truck, Gift, MapPin } from "lucide-react";

export default function DeliveryInfo() {
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");

  return (
    <div className="bg-white/[0.03] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Адрес + переключатель */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Наш адрес</p>
              <p className="text-sm font-medium">ул. Шоссейная, 42, г. Люберцы</p>
              <p className="text-[11px] text-gray-500">Суши Пицца KELECHEK</p>
            </div>
          </div>

          {/* Доставка / Самовывоз */}
          <div className="flex bg-white/[0.05] rounded-xl p-1">
            <button
              onClick={() => setMode("delivery")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "delivery"
                  ? "bg-accent text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Доставка
            </button>
            <button
              onClick={() => setMode("pickup")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "pickup"
                  ? "bg-accent text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Самовывоз
            </button>
          </div>
        </div>

        {/* Статистика доставки */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">30–60 мин</p>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider">Время доставки</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">500 ₽</p>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider">Мин. сумма заказа</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">150 ₽</p>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider">Стоим. доставки</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">от 2 000 ₽</p>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider">Беспл. доставка</p>
            </div>
          </div>
        </div>

        {/* Зона доставки */}
        {mode === "delivery" && (
          <div className="py-3 border-t border-white/[0.06]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Зона доставки</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Люберцы, Красная Горка, Томилино, Малаховка, Лыткарино, Котельники, Дзержинский и ближайшие районы.
                  При заказе от 2 000 ₽ — доставка бесплатно!
                </p>
              </div>
            </div>
          </div>
        )}

        {mode === "pickup" && (
          <div className="py-3 border-t border-white/[0.06]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Адрес самовывоза</p>
                <p className="text-[11px] text-gray-500">
                  г. Люберцы, ул. Шоссейная, 42 — «Суши Пицца KELECHEK». Скидка 10% при самовывозе!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
