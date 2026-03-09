"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  GripVertical,
  Eye,
  EyeOff,
  ImageIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface Banner {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  image: string;
  isActive: boolean;
  order: number;
}

const initialBanners: Banner[] = [
  {
    id: 1,
    badge: "АКЦИЯ",
    badgeColor: "bg-accent",
    title: "Скидка 20% на первый заказ",
    subtitle: "Используйте промокод VKUS20 при оформлении",
    image: "/photo/set_elita.jpg",
    isActive: true,
    order: 1,
  },
  {
    id: 2,
    badge: "ХИТ",
    badgeColor: "bg-orange-500",
    title: "Сет Мечта — 40 шт",
    subtitle: "Премиум роллы по специальной цене — 2690 ₽",
    image: "/photo/set_mechta.jpg",
    isActive: true,
    order: 2,
  },
  {
    id: 3,
    badge: "FREE",
    badgeColor: "bg-emerald-500",
    title: "Бесплатная доставка",
    subtitle: "При заказе от 2000 ₽ доставка за наш счёт",
    image: "/photo/set_boni_klaid.jpg",
    isActive: true,
    order: 3,
  },
  {
    id: 4,
    badge: "NEW",
    badgeColor: "bg-blue-500",
    title: "Новинка — Поке боулы",
    subtitle: "Попробуйте гавайское блюдо с лососем и авокадо",
    image: "/photo/poke_salmon.jpg",
    isActive: true,
    order: 4,
  },
  {
    id: 5,
    badge: "ТОП",
    badgeColor: "bg-purple-500",
    title: "Корпоративный Сет — 64 шт",
    subtitle: "Идеально для вечеринок и больших компаний",
    image: "/photo/set_corporativ.jpg",
    isActive: true,
    order: 5,
  },
  {
    id: 6,
    badge: "ГОРЯЧЕЕ",
    badgeColor: "bg-red-500",
    title: "Том Ям — настоящий вкус Тайланда",
    subtitle: "Острый тайский суп с креветками и кокосовым молоком",
    image: "/photo/tom_yam_shrimp.jpg",
    isActive: true,
    order: 6,
  },
  {
    id: 7,
    badge: "ПИЦЦА",
    badgeColor: "bg-amber-500",
    title: "Пицца — новый раздел!",
    subtitle: "Итальянская пицца на тонком тесте, приготовленная с любовью",
    image: "/photo/pepperoni.jpg",
    isActive: true,
    order: 7,
  },
];

const badgeColorOptions = [
  { value: "bg-accent", label: "Красный" },
  { value: "bg-orange-500", label: "Оранжевый" },
  { value: "bg-emerald-500", label: "Зелёный" },
  { value: "bg-blue-500", label: "Синий" },
  { value: "bg-purple-500", label: "Фиолетовый" },
  { value: "bg-red-500", label: "Алый" },
  { value: "bg-amber-500", label: "Жёлтый" },
  { value: "bg-pink-500", label: "Розовый" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const emptyBanner: Banner = {
    id: Date.now(),
    badge: "",
    badgeColor: "bg-accent",
    title: "",
    subtitle: "",
    image: "",
    isActive: true,
    order: banners.length + 1,
  };

  const handleSave = (banner: Banner) => {
    if (isCreating) {
      setBanners([...banners, { ...banner, id: Date.now() }]);
    } else {
      setBanners(banners.map((b) => (b.id === banner.id ? banner : b)));
    }
    setEditingBanner(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    setBanners(banners.filter((b) => b.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id: number) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [
      newBanners[index],
      newBanners[index - 1],
    ];
    setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
  };

  const moveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [
      newBanners[index + 1],
      newBanners[index],
    ];
    setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
  };

  const activeBanners = banners.filter((b) => b.isActive).length;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Заголовок */}
      <motion.div
        variants={itemAnim}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Баннеры
            <span className="text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">
              {banners.length}
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Управление слайдером на главной странице
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBanner({ ...emptyBanner });
            setIsCreating(true);
          }}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить баннер
        </button>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Всего баннеров",
            value: banners.length,
            icon: ImageIcon,
            color: "bg-accent/10 text-accent",
          },
          {
            label: "Активных",
            value: activeBanners,
            icon: Eye,
            color: "bg-green-500/10 text-green-400",
          },
          {
            label: "Скрытых",
            value: banners.length - activeBanners,
            icon: EyeOff,
            color: "bg-gray-500/10 text-gray-400",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemAnim}
            className="bg-[#111] border border-white/10 rounded-2xl p-4"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Список баннеров */}
      <div className="space-y-3">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            variants={itemAnim}
            className={`bg-[#111] border rounded-2xl overflow-hidden transition-all ${
              banner.isActive
                ? "border-white/10"
                : "border-white/5 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Порядок */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-gray-600 font-mono w-5 text-center">
                  {index + 1}
                </span>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === banners.length - 1}
                  className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Превью */}
              <div className="relative w-32 sm:w-48 aspect-[16/9] rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                {banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-8 h-8 text-gray-700" />
                  </div>
                )}
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Инфо */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {banner.badge && (
                    <span
                      className={`${banner.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-md`}
                    >
                      {banner.badge}
                    </span>
                  )}
                  {!banner.isActive && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md">
                      СКРЫТ
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {banner.title || "Без названия"}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm truncate mt-0.5">
                  {banner.subtitle || "Без описания"}
                </p>
              </div>

              {/* Действия */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(banner.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    banner.isActive ? "bg-accent" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      banner.isActive ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    setEditingBanner({ ...banner });
                    setIsCreating(false);
                  }}
                  className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deleteConfirm === banner.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="p-2 rounded-xl hover:bg-white/5 text-gray-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(banner.id)}
                    className="p-2 rounded-xl hover:bg-red-500/5 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Модалка редактирования */}
      <AnimatePresence>
        {editingBanner && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setEditingBanner(null);
                setIsCreating(false);
              }}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-[#111] border border-white/10 rounded-2xl z-50 flex flex-col max-h-[90vh]"
            >
              {/* Заголовок */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="font-semibold text-lg">
                  {isCreating ? "Новый баннер" : "Редактирование"}
                </h3>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setIsCreating(false);
                  }}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Форма */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Превью */}
                {editingBanner.image && (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/5">
                    <Image
                      src={editingBanner.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="500px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      {editingBanner.badge && (
                        <span
                          className={`${editingBanner.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-lg`}
                        >
                          {editingBanner.badge}
                        </span>
                      )}
                      <p className="text-white font-bold text-sm mt-1">
                        {editingBanner.title || "Заголовок"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Путь к изображению */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Путь к изображению
                  </label>
                  <input
                    type="text"
                    value={editingBanner.image}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        image: e.target.value,
                      })
                    }
                    placeholder="/photo/banner1.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* Заголовок */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={editingBanner.title}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        title: e.target.value,
                      })
                    }
                    placeholder="Заголовок баннера"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* Подзаголовок */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Подзаголовок
                  </label>
                  <input
                    type="text"
                    value={editingBanner.subtitle}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        subtitle: e.target.value,
                      })
                    }
                    placeholder="Описание баннера"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* Бейдж */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Бейдж
                    </label>
                    <input
                      type="text"
                      value={editingBanner.badge}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          badge: e.target.value,
                        })
                      }
                      placeholder="АКЦИЯ"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Цвет бейджа
                    </label>
                    <select
                      value={editingBanner.badgeColor}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          badgeColor: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    >
                      {badgeColorOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-[#111]"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="px-6 py-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setIsCreating(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    if (editingBanner.title.trim()) {
                      handleSave(editingBanner);
                    }
                  }}
                  disabled={!editingBanner.title.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Добавить" : "Сохранить"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
