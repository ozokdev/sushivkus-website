"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Pencil, X, Search } from "lucide-react";
import { menuItems as originalMenuItems, categories, type MenuItem, type Category } from "@/data/menu";

const badgeOptions: { value: "" | "new" | "hot" | "spicy"; label: string }[] = [
  { value: "", label: "Нет" },
  { value: "new", label: "NEW" },
  { value: "hot", label: "ХИТ" },
  { value: "spicy", label: "Острое" },
];

interface AdminMenuItem extends MenuItem {
  isActive: boolean;
}

// Категории без "all" и "popular"
const editCategories = categories.filter(
  (c) => c.id !== "all" && c.id !== "popular"
);

interface FormData {
  name: string;
  price: string;
  category: Category;
  weight: string;
  description: string;
  isPopular: boolean;
  badge: "" | "new" | "hot" | "spicy";
  image: string;
}

const emptyForm: FormData = {
  name: "",
  price: "",
  category: "rolls",
  weight: "",
  description: "",
  isPopular: false,
  badge: "",
  image: "/photo/philadelphia_classic.jpg",
};

export default function AdminMenu() {
  // TODO: Go API менен алмаштыруу
  const [items, setItems] = useState<AdminMenuItem[]>(
    originalMenuItems.map((i) => ({ ...i, isActive: true }))
  );
  const [filterCat, setFilterCat] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<AdminMenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = filterCat === "all" || item.category === filterCat;
      const matchSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, filterCat, search]);

  const toggleActive = (id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isActive: !i.isActive } : i))
    );
  };

  const openEdit = (item: AdminMenuItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      weight: item.weight || "",
      description: item.description,
      isPopular: item.isPopular || false,
      badge: item.badge || "",
      image: item.image,
    });
  };

  const openAdd = () => {
    setIsAdding(true);
    setForm(emptyForm);
  };

  const closeModal = () => {
    setEditItem(null);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;

    const newItem: AdminMenuItem = {
      id: editItem ? editItem.id : Date.now(),
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      image: form.image,
      weight: form.weight || undefined,
      isPopular: form.isPopular || undefined,
      badge: form.badge || undefined,
      isActive: editItem ? editItem.isActive : true,
    };

    if (editItem) {
      setItems((prev) => prev.map((i) => (i.id === editItem.id ? newItem : i)));
    } else {
      setItems((prev) => [newItem, ...prev]);
    }

    closeModal();
  };

  const modalOpen = !!editItem || isAdding;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Меню</h1>
          <span className="bg-accent/10 text-accent text-sm font-medium px-2.5 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 transition-colors w-full"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Добавить</span>
          </button>
        </div>
      </div>

      {/* Категория фильтр */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.filter((c) => c.id !== "popular").map((cat) => {
          const active = filterCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                active
                  ? "bg-accent text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Товарлар grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-[#111] border rounded-2xl overflow-hidden group transition-opacity ${
              item.isActive
                ? "border-white/10"
                : "border-white/5 opacity-50"
            }`}
          >
            {/* Сүрөт */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className={`object-cover ${!item.isActive ? "grayscale" : ""}`}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {!item.isActive && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    СКРЫТО
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {item.isPopular && (
                  <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    ХИТ
                  </span>
                )}
                {item.badge === "new" && (
                  <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    NEW
                  </span>
                )}
                {item.badge === "hot" && (
                  <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    HOT
                  </span>
                )}
                {item.badge === "spicy" && (
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    SPICY
                  </span>
                )}
              </div>
            </div>

            {/* Маалымат */}
            <div className="p-3 lg:p-4">
              <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
              <p className="text-gray-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-accent font-bold">{item.price} ₽</span>
                  {item.weight && (
                    <span className="text-gray-500 text-xs ml-2">{item.weight}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm transition-all duration-200"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Редакт.</span>
                </button>
                <button
                  onClick={() => toggleActive(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    item.isActive
                      ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400"
                      : "bg-red-500/10 text-red-400 hover:bg-green-500/10 hover:text-green-400"
                  }`}
                  title={item.isActive ? "Скрыть из меню" : "Показать в меню"}
                >
                  {item.isActive ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Ничего не найдено</p>
        </div>
      )}

      {/* Модал: Редактирование / Добавление */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <h3 className="font-semibold text-lg">
                    {editItem ? `Редактирование: ${editItem.name}` : "Новая позиция"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Форма */}
                <div className="px-6 py-5 space-y-4">
                  {/* Название */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Название</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Филадельфия Классик"
                      required
                      className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full"
                    />
                  </div>

                  {/* Цена + Категория */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Цена (₽)</label>
                      <input
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="450"
                        required
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Категория</label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value as Category })
                        }
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full"
                      >
                        {editCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Вес + Бейдж */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Вес</label>
                      <input
                        type="text"
                        value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        placeholder="280г"
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Бейдж</label>
                      <select
                        value={form.badge}
                        onChange={(e) =>
                          setForm({ ...form, badge: e.target.value as FormData["badge"] })
                        }
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full"
                      >
                        {badgeOptions.map((b) => (
                          <option key={b.value} value={b.value}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Описание */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Описание</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Лосось, сливочный сыр, огурец, рис, нори"
                      rows={3}
                      className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full resize-none"
                    />
                  </div>

                  {/* Популярное toggle */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        form.isPopular ? "bg-accent" : "bg-white/10"
                      }`}
                      onClick={() => setForm({ ...form, isPopular: !form.isPopular })}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          form.isPopular ? "translate-x-[22px]" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-300">Популярное (ХИТ)</span>
                  </label>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 px-6 py-4 border-t border-white/10">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium transition-all duration-200"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!form.name || !form.price}
                    className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
