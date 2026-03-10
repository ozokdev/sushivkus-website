"use client";

import { useState } from "react";
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
  const [selectedSize, setSelectedSize] = useState<4 | 8>(4);

  if (!product) return null;

  const has4 = !!product.price4;
  const currentPrice = has4 ? (selectedSize === 4 ? product.price4! : product.price) : product.price;
  const cartId = has4 && selectedSize === 4 ? product.id + 1000 : product.id;
  const cartItem = cartItems.find((i) => i.id === cartId);
  const count = cartItem?.quantity || 0;

  const handleAdd = () => {
    const is4 = has4 && selectedSize === 4;
    const name = is4 ? `${product.name} (4шт)` : has4 ? `${product.name} (8шт)` : product.name;
    addItem({
      id: cartId,
      name,
      price: currentPrice,
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
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
              {/* Сүрөт үстүндө чоң */}
              <div className="relative w-full aspect-[4/3] flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-2xl"
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
                  <span className="absolute top-3 right-14 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    HIT
                  </span>
                )}

                {/* Закрыть */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Маалымат ылдыйында */}
              <div className="flex flex-col p-5 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  {product.name}
                </h2>

                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  {product.description}
                </p>

                {(product.weight || product.pieces) && (
                  <div className="flex gap-4 mb-4 text-xs text-gray-500">
                    {product.weight && <span>Вес: {product.weight}</span>}
                    {product.pieces && <span>Кол-во: {product.pieces}</span>}
                  </div>
                )}

                {/* 4шт / 8шт toggle */}
                {has4 && (
                  <div className="flex mb-4 bg-white/[0.04] rounded-xl p-1">
                    <button
                      onClick={() => setSelectedSize(4)}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                        selectedSize === 4
                          ? "bg-accent text-white shadow-sm"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      4 шт. — {product.price4} ₽
                    </button>
                    <button
                      onClick={() => setSelectedSize(8)}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                        selectedSize === 8
                          ? "bg-accent text-white shadow-sm"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      8 шт. — {product.price} ₽
                    </button>
                  </div>
                )}

                {/* Цена и кнопки */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
                  <span className="text-2xl font-bold text-accent">
                    {currentPrice} ₽
                  </span>

                  {count > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white/[0.05] rounded-xl">
                        <button
                          onClick={() => updateQuantity(cartId, count - 1)}
                          className="p-2.5 hover:bg-white/10 rounded-l-xl transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold">{count}</span>
                        <button
                          onClick={handleAdd}
                          className="p-2.5 hover:bg-white/10 rounded-r-xl transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-gray-400 text-sm">
                        = {currentPrice * count} ₽
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAdd}
                      className="py-3 px-6 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold transition-all duration-200 glow-red flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      В корзину
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
