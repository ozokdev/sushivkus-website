"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus, ShoppingCart, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { MenuItem } from "@/data/menu";

interface ToppingItem {
  ID: number;
  name: string;
  category: string;
  price: number;
}

const TOPPING_CAT_LABELS: Record<string, string> = {
  meat: "Мясо",
  vegetable: "Овощи",
  cheese: "Сыры",
  sauce: "Соусы",
  other: "Другое",
};

interface ProductModalProps {
  product: MenuItem | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems = useCartStore((s) => s.items);

  const [toppings, setToppings] = useState<ToppingItem[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<Set<number>>(new Set());
  const [toppingsOpen, setToppingsOpen] = useState(false);

  const isPizza = product?.category === "pizza";

  // Топпинглерди жүктөө
  useEffect(() => {
    if (!isPizza || !product) return;
    setSelectedToppings(new Set());
    setToppingsOpen(false);

    fetch("https://api.sushivkus.ru/api/pizza-toppings")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setToppings(data);
      })
      .catch(() => {});
  }, [isPizza, product?.id]);

  if (!product) return null;

  const toggleTopping = (id: number) => {
    setSelectedToppings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toppingsTotal = Array.from(selectedToppings).reduce((sum, id) => {
    const t = toppings.find((t) => t.ID === id);
    return sum + (t?.price || 0);
  }, 0);

  const currentPrice = product.price + toppingsTotal;
  const cartId = product.id;
  const cartItem = cartItems.find((i) => i.id === cartId);
  const count = cartItem?.quantity || 0;

  const selectedToppingNames = Array.from(selectedToppings)
    .map((id) => toppings.find((t) => t.ID === id)?.name)
    .filter(Boolean);

  const handleAdd = () => {
    if (isPizza && selectedToppings.size > 0) {
      // Пицца + топпинг — уникальный ID
      addItem({
        id: Date.now(),
        name: product.name,
        price: currentPrice,
        image: product.image,
        description: "+" + selectedToppingNames.join(", "),
      });
    } else {
      addItem({
        id: cartId,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  const groupedToppings = Object.entries(TOPPING_CAT_LABELS)
    .map(([cat, label]) => ({
      cat,
      label,
      items: toppings.filter((t) => t.category === cat),
    }))
    .filter((g) => g.items.length > 0);

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
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              {/* Сүрөт */}
              <div className="relative w-full aspect-[3/2] flex-shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover rounded-t-2xl" />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.weight && (
                    <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">{product.weight}</span>
                  )}
                  {product.pieces && (
                    <span className="bg-accent/80 text-white text-xs px-2.5 py-1 rounded-lg font-medium">{product.pieces}</span>
                  )}
                </div>
                {product.isPopular && (
                  <span className="absolute top-3 right-14 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">HIT</span>
                )}
                <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Маалымат */}
              <div className="flex flex-col p-5 md:p-6 overflow-y-auto">
                <h2 className="text-xl md:text-2xl font-bold mb-3">{product.name}</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{product.description}</p>

                {(product.weight || product.pieces) && (
                  <div className="flex gap-4 mb-4 text-xs text-gray-500">
                    {product.weight && <span>Вес: {product.weight}</span>}
                    {product.pieces && <span>Кол-во: {product.pieces}</span>}
                  </div>
                )}

                {/* Пицца топпинглери */}
                {isPizza && toppings.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setToppingsOpen(!toppingsOpen)}
                      className="w-full flex items-center justify-between py-3 px-4 bg-accent/10 hover:bg-accent/15 border border-accent/20 rounded-xl text-sm font-semibold text-accent transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Добавить топпинги
                        {selectedToppings.size > 0 && (
                          <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-md ml-1">
                            {selectedToppings.size}
                          </span>
                        )}
                      </span>
                      {toppingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {toppingsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-3 max-h-[40vh] overflow-y-auto">
                            {groupedToppings.map((group) => (
                              <div key={group.cat}>
                                <h4 className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold mb-1.5 px-1">
                                  {group.label}
                                </h4>
                                <div className="space-y-1">
                                  {group.items.map((t) => {
                                    const selected = selectedToppings.has(t.ID);
                                    return (
                                      <button
                                        key={t.ID}
                                        onClick={() => toggleTopping(t.ID)}
                                        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm transition-all ${
                                          selected
                                            ? "bg-accent/15 border border-accent/30"
                                            : "bg-white/[0.03] border border-white/[0.06] hover:border-white/15"
                                        }`}
                                      >
                                        <span className={selected ? "text-white font-medium" : "text-gray-300"}>
                                          {t.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-accent text-xs font-semibold">+{t.price} ₽</span>
                                          {selected && <Check className="w-4 h-4 text-accent" />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Тандалган топпинглер */}
                    {selectedToppings.size > 0 && !toppingsOpen && (
                      <p className="text-[11px] text-gray-500 mt-2 px-1">
                        +{selectedToppingNames.join(", ")} (+{toppingsTotal} ₽)
                      </p>
                    )}
                  </div>
                )}

                {/* Цена и кнопки */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-accent">{currentPrice} ₽</span>
                    {product.oldPrice && product.oldPrice > currentPrice && (
                      <span className="text-red-400/70 text-lg line-through">{product.oldPrice} ₽</span>
                    )}
                    {toppingsTotal > 0 && (
                      <span className="text-xs text-gray-500">({product.price} + {toppingsTotal})</span>
                    )}
                  </div>

                  {count > 0 && selectedToppings.size === 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white/[0.05] rounded-xl">
                        <button onClick={() => updateQuantity(cartId, count - 1)} className="p-2.5 hover:bg-white/10 rounded-l-xl transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold">{count}</span>
                        <button onClick={handleAdd} className="p-2.5 hover:bg-white/10 rounded-r-xl transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-gray-400 text-sm">= {product.price * count} ₽</span>
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
