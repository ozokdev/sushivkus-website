"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { MenuItem } from "@/data/menu";

interface ProductModalProps {
  product: MenuItem | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems = useCartStore((s) => s.items);

  if (!product) return null;

  const cartItem = cartItems.find((i) => i.id === product.id);
  const count = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
              {/* Фото слева */}
              <div className="relative w-full md:w-1/2 h-64 md:h-auto flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {/* Бейджи */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.weight && (
                    <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
                      {product.weight}
                    </span>
                  )}
                  {product.pieces && (
                    <span className="bg-accent/80 text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                      {product.pieces}
                    </span>
                  )}
                </div>
                {product.isPopular && (
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    🔥 HIT
                  </span>
                )}

                {/* Закрыть на мобилке */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 md:hidden p-2 bg-black/50 rounded-full"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Инфо справа */}
              <div className="flex flex-col p-6 md:p-8 flex-1">
                {/* Закрыть десктоп */}
                <button
                  onClick={onClose}
                  className="hidden md:flex self-end p-2 hover:bg-white/5 rounded-xl transition-colors -mt-2 -mr-2"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {product.name}
                </h2>

                {/* Состав */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6">
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Состав
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>
                  {(product.weight || product.pieces) && (
                    <div className="flex gap-4 mt-3 pt-3 border-t border-white/[0.06] text-xs text-gray-500">
                      {product.weight && <span>Вес: {product.weight}</span>}
                      {product.pieces && <span>Кол-во: {product.pieces}</span>}
                    </div>
                  )}
                </div>

                {/* Цена и кнопки */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-accent">
                      {product.price} ₽
                    </span>
                  </div>

                  {count > 0 ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-white/[0.05] rounded-xl">
                        <button
                          onClick={() => updateQuantity(product.id, count - 1)}
                          className="p-3 hover:bg-white/10 rounded-l-xl transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="px-5 font-bold text-lg">{count}</span>
                        <button
                          onClick={handleAdd}
                          className="p-3 hover:bg-white/10 rounded-r-xl transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <span className="text-gray-400 text-sm">
                        = {product.price * count} ₽
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAdd}
                      className="w-full py-4 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold text-lg transition-all duration-200 glow-red flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      В корзину за {product.price} ₽
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
