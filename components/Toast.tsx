"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { create } from "zustand";

// Стор для тостов
interface ToastState {
  message: string;
  visible: boolean;
  show: (msg: string) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: "",
  visible: false,
  show: (msg) => {
    set({ message: msg, visible: true });
    setTimeout(() => set({ visible: false }), 4000);
  },
  hide: () => set({ visible: false }),
}));

export default function Toast() {
  const { message, visible } = useToast();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl shadow-emerald-600/30"
        >
          <Check className="w-5 h-5" />
          <span className="font-medium text-sm whitespace-nowrap">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
