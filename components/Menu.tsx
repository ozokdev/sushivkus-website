"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, Search, X } from "lucide-react";
import { type MenuItem } from "@/data/menu";
import { useCartStore } from "@/store/cartStore";
import { useMenuStore } from "@/store/menuStore";
import { useToast } from "./Toast";
import CategoryNav from "./CategoryNav";
import ProductModal from "./ProductModal";
import WokConstructor from "./WokConstructor";
import FavoriteButton from "./FavoriteButton";

import { badgeConfig } from "@/data/badges";

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [wokOpen, setWokOpen] = useState(false);
  const [wokImage, setWokImage] = useState<string>("");
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToast((s) => s.show);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems = useCartStore((s) => s.items);
  const menuItems = useMenuStore((s) => s.items);
  const categories = useMenuStore((s) => s.categories);
  const fetchMenu = useMenuStore((s) => s.fetchMenu);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getItemCount = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    return item?.quantity || 0;
  };

  const displayCategories = categories.filter(
    (c) => c.id !== "all" && c.id !== "popular"
  );

  const filterBySearch = (items: typeof menuItems) => {
    if (!debouncedQuery.trim()) return items;
    const q = debouncedQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  };

  const popularItems = filterBySearch(
    menuItems.filter((item) => item.isPopular)
  );

  // Добавление в корзину
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
    <section id="menu">
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-24 md:pb-4">
        {/* Категории */}
        {displayCategories.map((category) => {
          if (
            activeCategory !== "all" &&
            activeCategory !== "popular" &&
            activeCategory !== category.id
          )
            return null;

          const items = filterBySearch(
            menuItems.filter((item) => item.category === category.id)
          );

          if (activeCategory === "all" && items.length === 0) return null;

          return (
            <div
              key={category.id}
              id={`cat-${category.id}`}
              className="mb-6 scroll-mt-32"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-3"
              >
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {category.name}
                </h2>
                <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-lg">
                  {items.length}
                </span>
              </motion.div>
              {items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {items.map((item, index) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      index={index}
                      getItemCount={getItemCount}
                      isAdding={addedId === item.id}
                      onAdd={() => {
                        if (item.category === "wok") {
                          setWokImage(item.image);
                          setWokOpen(true);
                        } else {
                          handleAdd(item);
                        }
                      }}
                      onMinus={(cartId) =>
                        updateQuantity(cartId, getItemCount(cartId) - 1)
                      }
                      onClickCard={() => {
                        if (item.category === "wok") {
                          setWokImage(item.image);
                          setWokOpen(true);
                        } else {
                          setSelectedProduct(item);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Скоро здесь появятся товары</p>
                </div>
              )}
            </div>
          );
        })}

        {debouncedQuery && filterBySearch(menuItems).length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">
              Ничего не найдено по запросу «{debouncedQuery}»
            </p>
          </div>
        )}
      </div>

      {/* Модал товара */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* WOK Конструктор */}
      <WokConstructor
        isOpen={wokOpen}
        onClose={() => setWokOpen(false)}
        productImage={wokImage}
      />
    </section>
  );
}

// Карточка товара
function ProductCard({
  item,
  index,
  getItemCount,
  isAdding,
  onAdd,
  onMinus,
  onClickCard,
}: {
  item: MenuItem;
  index: number;
  getItemCount: (id: number) => number;
  isAdding: boolean;
  onAdd: () => void;
  onMinus: (cartId: number) => void;
  onClickCard: () => void;
}) {
  const badge = item.badge ? badgeConfig[item.badge] : null;

  const currentPrice = item.price;
  const cartId = item.id;
  const count = getItemCount(cartId);

  return (
    <div
      className={`group bg-white/[0.03] border rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300 ${
        isAdding
          ? "border-accent/50 shadow-lg shadow-accent/10"
          : "border-white/[0.06] hover:border-accent/20"
      }`}
    >
      {/* Фото — кликабельное */}
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={onClickCard}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          loading="lazy"
        />
        {/* Бейджи слева */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.pieces && (
            <span className="bg-accent/80 backdrop-blur-sm text-white text-[10px] md:text-xs px-2 py-0.5 rounded-md font-medium">
              {item.pieces}
            </span>
          )}
        </div>
        {/* Избранное + Бейдж справа */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <FavoriteButton id={item.id} className="bg-black/30 backdrop-blur-sm rounded-lg" />
          {badge && (
            <span
              className={`${badge.class} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md`}
            >
              {badge.text}
            </span>
          )}
          {item.isPopular && !badge && (
            <span className="bg-orange-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
              HIT
            </span>
          )}
        </div>

        {/* Анимация добавления */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center bg-accent/30 backdrop-blur-[2px]"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                className="text-4xl"
              >
                ✓
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Инфо */}
      <div className="p-3 md:p-4">
        <h3
          className="font-semibold text-sm md:text-base mb-0.5 line-clamp-1 cursor-pointer hover:text-accent transition-colors"
          onClick={onClickCard}
        >
          {item.name}
        </h3>
        <p className="text-gray-500 text-[11px] md:text-xs mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-accent font-bold text-base md:text-lg">
              {currentPrice} ₽
            </span>
            {item.oldPrice && item.oldPrice > currentPrice && (
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
                onClick={(e) => {
                  e.stopPropagation();
                  onMinus(cartId);
                }}
                aria-label="Уменьшить количество"
                className="p-2 text-white hover:bg-white/20 rounded-l-xl transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-white font-bold text-sm w-6 text-center">
                {count}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                aria-label="Увеличить количество"
                className="p-2 text-white hover:bg-white/20 rounded-r-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">В корзину</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
