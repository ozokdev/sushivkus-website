"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { type MenuItem } from "@/data/menu";
import { useCartStore } from "@/store/cartStore";
import { useMenuStore } from "@/store/menuStore";
import { useToast } from "./Toast";
import ProductModal from "./ProductModal";
import FavoriteButton from "./FavoriteButton";

const badgeConfig = {
  new: { text: "NEW", class: "bg-blue-500" },
  hot: { text: "🔥 ХИТ", class: "bg-orange-500" },
  spicy: { text: "🌶️ ОСТР.", class: "bg-red-600" },
};

export default function PopularSection() {
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToast((s) => s.show);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems = useCartStore((s) => s.items);
  const menuItems = useMenuStore((s) => s.items);
  const fetchMenu = useMenuStore((s) => s.fetchMenu);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const popularItems = menuItems.filter((item) => item.isPopular).slice(0, 5);

  const getItemCount = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    return item?.quantity || 0;
  };

  const handleAdd = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setAddedId(item.id);
    showToast(`${item.name} добавлен в корзину!`);
    setTimeout(() => setAddedId(null), 600);
  };

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold mb-3"
        >
          🔥 Популярное
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {popularItems.map((item, index) => {
            const badge = item.badge ? badgeConfig[item.badge] : null;
            const count = getItemCount(item.id);
            const isAdding = addedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className={`group bg-white/[0.03] border rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300 ${
                  isAdding
                    ? "border-accent/50 shadow-lg shadow-accent/10"
                    : "border-white/[0.06] hover:border-accent/20"
                }`}
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(item)}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.pieces && (
                      <span className="bg-accent/80 backdrop-blur-sm text-white text-[10px] md:text-xs px-2 py-0.5 rounded-md font-medium">
                        {item.pieces}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    <FavoriteButton id={item.id} className="bg-black/30 backdrop-blur-sm rounded-lg" />
                    {badge ? (
                      <span className={`${badge.class} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md`}>
                        {badge.text}
                      </span>
                    ) : (
                      <span className="bg-orange-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        HIT
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {isAdding && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute inset-0 flex items-center justify-center bg-accent/30 backdrop-blur-[2px]"
                      >
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1.2 }} className="text-4xl">
                          ✓
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-3 md:p-4">
                  <h3
                    className="font-semibold text-sm md:text-base mb-0.5 line-clamp-1 cursor-pointer hover:text-accent transition-colors"
                    onClick={() => setSelectedProduct(item)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] md:text-xs mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-accent font-bold text-base md:text-lg">
                        {item.price} ₽
                      </span>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <span className="text-red-400/70 text-sm md:text-base line-through">
                          {item.oldPrice} ₽
                        </span>
                      )}
                    </div>
                    {count > 0 ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 bg-accent rounded-xl"
                      >
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(item.id, count - 1)}
                          className="p-2 text-white hover:bg-white/20 rounded-l-xl transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </motion.button>
                        <span className="text-white font-bold text-sm w-6 text-center">{count}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleAdd(item)}
                          className="p-2 text-white hover:bg-white/20 rounded-r-xl transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAdd(item)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">В корзину</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
