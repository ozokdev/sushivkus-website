"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ShoppingBag } from "lucide-react";

export default function DeliveryChoiceModal() {
  const [show, setShow] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Админкадан өчүрүлгөнбү текшерүү
    fetch("https://api.sushivkus.ru/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.show_delivery_choice === "false") {
          setEnabled(false);
          return;
        }
        // Мурда тандалганбы текшерүү
        const chosen = localStorage.getItem("delivery_type");
        if (!chosen) {
          setShow(true);
        }
      })
      .catch(() => {});
  }, []);

  const choose = (type: "delivery" | "pickup") => {
    localStorage.setItem("delivery_type", type);
    setShow(false);
    // Башка компоненттерге кабарлоо
    window.dispatchEvent(new CustomEvent("deliveryTypeChanged", { detail: type }));
  };

  if (!enabled || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-accent/5 px-6 pt-8 pb-4 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Способ получения заказа
            </h2>
            <p className="text-sm text-gray-500 mt-1">Выберите удобный вариант</p>
          </div>

          {/* Buttons */}
          <div className="px-6 pb-8 pt-4 space-y-3">
            <button
              onClick={() => choose("delivery")}
              className="w-full flex items-center gap-4 px-6 py-4 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-accent/20 cursor-pointer"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="font-bold text-lg block">ДОСТАВКА</span>
                <span className="text-white/70 text-xs">Привезём к вашей двери</span>
              </div>
            </button>

            <button
              onClick={() => choose("pickup")}
              className="w-full flex items-center gap-4 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="font-bold text-lg block">САМОВЫВОЗ</span>
                <span className="text-white/60 text-xs">Шоссейная 42, Люберцы</span>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
