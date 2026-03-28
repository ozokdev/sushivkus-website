"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Store, MapPin, Clock, ChevronRight } from "lucide-react";

export default function DeliveryChoiceModal() {
  const [show, setShow] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetch("https://api.sushivkus.ru/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.show_delivery_choice === "false") {
          setEnabled(false);
          return;
        }
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
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-[400px] rounded-3xl shadow-2xl overflow-hidden"
          style={{ background: "#fff", color: "#111" }}
        >
          {/* Top accent line */}
          <div className="h-1 bg-gradient-to-r from-accent via-red-400 to-accent" />

          {/* Header */}
          <div className="px-8 pt-8 pb-2 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🍣</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "#111" }}>
              Способ получения
            </h2>
            <p className="text-sm mt-1.5" style={{ color: "#999" }}>Как вы хотите получить заказ?</p>
          </div>

          {/* Options */}
          <div className="px-6 pb-8 pt-4 space-y-3">
            {/* Delivery */}
            <button
              onClick={() => choose("delivery")}
              className="w-full group relative flex items-center gap-4 px-5 py-5 bg-gradient-to-r from-accent to-red-500 text-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 active:scale-[0.97] cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
              <div className="relative w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-7 h-7" strokeWidth={1.8} />
              </div>
              <div className="relative text-left flex-1">
                <span className="font-bold text-lg block tracking-wide">ДОСТАВКА</span>
                <span className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  45-60 мин до вашей двери
                </span>
              </div>
              <ChevronRight className="relative w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            {/* Pickup */}
            <button
              onClick={() => choose("pickup")}
              className="w-full group relative flex items-center gap-4 px-5 py-5 bg-gray-900 hover:bg-gray-800 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/30 active:scale-[0.97] cursor-pointer overflow-hidden"
              style={{ color: "#fff" }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
              <div className="relative w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Store className="w-7 h-7" strokeWidth={1.8} />
              </div>
              <div className="relative text-left flex-1">
                <span className="font-bold text-lg block tracking-wide">САМОВЫВОЗ</span>
                <span className="text-white/50 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  Шоссейная 42, Люберцы
                </span>
              </div>
              <ChevronRight className="relative w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Footer hint */}
          <div className="px-6 pb-6">
            <p className="text-[11px] text-center" style={{ color: "#aaa" }}>
              Можно изменить в корзине при оформлении
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
