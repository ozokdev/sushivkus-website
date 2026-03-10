"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, AlertCircle } from "lucide-react";
import { useCartStore, MIN_ORDER } from "@/store/cartStore";
import { menuItems } from "@/data/menu";

export default function Cart() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    addItem,
    appliedPromo,
    applyPromo,
    removePromo,
    getDiscount,
    getDiscountAmount,
    getFinalPrice,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");

  const total = getTotalPrice();
  const discount = getDiscount();
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalPrice();
  const remaining = MIN_ORDER - total;

  const handleApplyPromo = () => {
    const success = applyPromo(promoCode);
    if (success) {
      setPromoError("");
    } else {
      setPromoError("Промокод не найден");
    }
  };

  // "С этим заказывают" — рандомные товары, которых нет в корзине
  const suggestions = menuItems
    .filter((item) => !items.find((i) => i.id === item.id) && item.isPopular)
    .slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#111] border-l border-white/10 z-50 flex flex-col"
          >
            {/* Шапка */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">Корзина</h2>
                <span className="text-sm text-gray-500">
                  ({items.length})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Предупреждение о мин. заказе */}
            {items.length > 0 && remaining > 0 && (
              <div className="mx-5 mt-4 flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  До минимального заказа осталось <strong>{remaining} ₽</strong>
                </span>
              </div>
            )}

            {/* Товары */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium">Корзина пуста</p>
                  <p className="text-sm mt-1">Добавьте что-нибудь из меню</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-accent font-bold text-sm mt-0.5">
                          {item.price * item.quantity} ₽
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-1 text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* С этим заказывают */}
                  {suggestions.length > 0 && (
                    <div className="pt-4 border-t border-white/[0.06]">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                        С этим заказывают
                      </p>
                      <div className="space-y-2">
                        {suggestions.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white/[0.02] rounded-lg p-2"
                          >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-accent text-xs font-bold">
                                {item.price} ₽
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                addItem({
                                  id: item.id,
                                  name: item.name,
                                  price: item.price,
                                  image: item.image,
                                })
                              }
                              className="p-1.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-lg transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Итого */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-3">
                {/* Промокод */}
                <div>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <Tag className="w-4 h-4" />
                        <span>
                          {appliedPromo} (−{discount}%)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          removePromo();
                          setPromoCode("");
                        }}
                        className="text-gray-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError("");
                        }}
                        placeholder="Промокод"
                        className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-white/[0.05] hover:bg-accent/20 border border-white/[0.08] rounded-xl text-sm font-medium text-gray-300 hover:text-accent transition-all"
                      >
                        ОК
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-red-400 text-xs mt-1.5">{promoError}</p>
                  )}
                </div>

                {/* Сумма */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Подитог</span>
                    <span>{total} ₽</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Скидка {discount}%</span>
                      <span>−{discountAmount} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                    <span className="font-medium">Итого:</span>
                    <span className="text-xl font-bold text-accent">
                      {finalTotal} ₽
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeCart();
                    router.push("/checkout");
                  }}
                  disabled={remaining > 0}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-200 ${
                    remaining > 0
                      ? "bg-gray-700 cursor-not-allowed opacity-60"
                      : "bg-accent hover:bg-accent-hover glow-red"
                  }`}
                >
                  {remaining > 0
                    ? `Мин. заказ ${MIN_ORDER} ₽`
                    : "Оформить заказ"}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-gray-600 hover:text-red-400 text-xs transition-colors"
                >
                  Очистить корзину
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
