"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, Search, X } from "lucide-react";
import { menuItems, categories, type Category, type MenuItem } from "@/data/menu";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "./Toast";
import CategoryNav from "./CategoryNav";
import ProductModal from "./ProductModal";

// Бейджи на карточках
const badgeConfig = {
  new: { text: "NEW", class: "bg-blue-500" },
  hot: { text: "🔥 ХИТ", class: "bg-orange-500" },
  spicy: { text: "🌶️ ОСТР.", class: "bg-red-600" },
};

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToast((s) => s.show);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems = useCartStore((s) => s.items);

  const getItemCount = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    return item?.quantity || 0;
  };

  const displayCategories = categories.filter(
    (c) => c.id !== "all" && c.id !== "popular"
  );

  const filterBySearch = (items: typeof menuItems) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  };

  const popularItems = filterBySearch(
    menuItems.filter((item) => item.isPopular)
  );

  // Анимация добавления в корзину
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {/* Поиск */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по меню..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-12 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Популярное */}
        {(activeCategory === "all" || activeCategory === "popular") &&
          popularItems.length > 0 && (
            <div id="cat-popular" className="mb-12 scroll-mt-32">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold">
                  🔥 Популярное
                </h2>
                <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-lg">
                  {popularItems.length}
                </span>
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {popularItems.map((item, index) => (
                  <ProductCard
                    key={`pop-${item.id}`}
                    item={item}
                    index={index}
                    count={getItemCount(item.id)}
                    isAdding={addedId === item.id}
                    onAdd={() => handleAdd(item)}
                    onMinus={() =>
                      updateQuantity(item.id, getItemCount(item.id) - 1)
                    }
                    onClickCard={() => setSelectedProduct(item)}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Остальные категории */}
        {displayCategories.map((category) => {
          const items = filterBySearch(
            menuItems.filter((item) => item.category === category.id)
          );
          if (items.length === 0) return null;
          if (
            activeCategory !== "all" &&
            activeCategory !== "popular" &&
            activeCategory !== category.id
          )
            return null;

          return (
            <div
              key={category.id}
              id={`cat-${category.id}`}
              className="mb-12 scroll-mt-32"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {category.name}
                </h2>
                <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-lg">
                  {items.length}
                </span>
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {items.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    index={index}
                    count={getItemCount(item.id)}
                    isAdding={addedId === item.id}
                    onAdd={() => handleAdd(item)}
                    onMinus={() =>
                      updateQuantity(item.id, getItemCount(item.id) - 1)
                    }
                    onClickCard={() => setSelectedProduct(item)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {searchQuery && filterBySearch(menuItems).length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">
              Ничего не найдено по запросу «{searchQuery}»
            </p>
          </div>
        )}
      </div>

      {/* Модал товара */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}

// Карточка товара
function ProductCard({
  item,
  index,
  count,
  isAdding,
  onAdd,
  onMinus,
  onClickCard,
}: {
  item: MenuItem;
  index: number;
  count: number;
  isAdding: boolean;
  onAdd: () => void;
  onMinus: () => void;
  onClickCard: () => void;
}) {
  const badge = item.badge ? badgeConfig[item.badge] : null;

  return (
    <motion.div
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
        />
        {/* Бейджи слева */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.weight && (
            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] md:text-xs px-2 py-0.5 rounded-md">
              {item.weight}
            </span>
          )}
          {item.pieces && (
            <span className="bg-accent/80 backdrop-blur-sm text-white text-[10px] md:text-xs px-2 py-0.5 rounded-md font-medium">
              {item.pieces}
            </span>
          )}
        </div>
        {/* Бейдж справа: Хит/Новинка/Острый */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
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
          <span className="text-accent font-bold text-base md:text-lg">
            {item.price} ₽
          </span>

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
                  onMinus();
                }}
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
    </motion.div>
  );
}
