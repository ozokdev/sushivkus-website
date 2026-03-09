"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Package, Clock, Phone, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function OrderSuccess() {
  const { isOrderSuccessOpen, closeOrderSuccess, lastOrderNumber } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOrderSuccessOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrderSuccess}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-8 text-center relative">
              <button
                onClick={closeOrderSuccess}
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Анимированная галочка */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                  delay: 0.2,
                }}
                className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                    delay: 0.4,
                  }}
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-2">Заказ оформлен!</h2>
                <p className="text-gray-400 mb-6">
                  Ваш заказ успешно отправлен. Мы свяжемся с вами для
                  подтверждения.
                </p>
              </motion.div>

              {/* Номер заказа */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6"
              >
                <p className="text-gray-500 text-sm mb-1">Номер заказа</p>
                <p className="text-2xl font-bold text-accent">
                  #{lastOrderNumber}
                </p>
              </motion.div>

              {/* Инфо */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3 mb-6 text-left"
              >
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-gray-400">
                    Заказ передан на кухню для приготовления
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-gray-400">
                    Среднее время доставки: 45-60 минут
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-400">
                    Вопросы? Звоните:{" "}
                    <a href="tel:+79253206190" className="text-accent hover:underline">
                      8 (925) 320-61-90
                    </a>
                  </span>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={closeOrderSuccess}
                className="w-full py-3 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold transition-colors"
              >
                Отлично!
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
