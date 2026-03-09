"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Tag,
  Percent,
  Calendar,
  Copy,
  CheckCircle,
} from "lucide-react";

interface PromoCode {
  id: number;
  code: string;
  discount: number;
  discountType: "percent" | "fixed";
  minOrder: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  description: string;
}

const initialPromos: PromoCode[] = [
  {
    id: 1,
    code: "VKUS20",
    discount: 20,
    discountType: "percent",
    minOrder: 1500,
    maxUses: 0,
    usedCount: 147,
    validFrom: "2024-01-01",
    validTo: "2026-12-31",
    isActive: true,
    description: "Скидка 20% для новых клиентов",
  },
  {
    id: 2,
    code: "SUSHI10",
    discount: 10,
    discountType: "percent",
    minOrder: 1000,
    maxUses: 500,
    usedCount: 89,
    validFrom: "2024-06-01",
    validTo: "2026-06-30",
    isActive: true,
    description: "Скидка 10% на все роллы",
  },
  {
    id: 3,
    code: "FREE300",
    discount: 300,
    discountType: "fixed",
    minOrder: 2000,
    maxUses: 100,
    usedCount: 45,
    validFrom: "2024-03-01",
    validTo: "2026-03-31",
    isActive: false,
    description: "Скидка 300₽ на заказ от 2000₽",
  },
  {
    id: 4,
    code: "HAPPY15",
    discount: 15,
    discountType: "percent",
    minOrder: 800,
    maxUses: 200,
    usedCount: 0,
    validFrom: "2026-03-01",
    validTo: "2026-04-30",
    isActive: true,
    description: "Весенняя акция — скидка 15%",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>(initialPromos);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const emptyPromo: PromoCode = {
    id: Date.now(),
    code: "",
    discount: 10,
    discountType: "percent",
    minOrder: 500,
    maxUses: 0,
    usedCount: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validTo: "",
    isActive: true,
    description: "",
  };

  const handleSave = (promo: PromoCode) => {
    if (isCreating) {
      setPromos([...promos, { ...promo, id: Date.now() }]);
    } else {
      setPromos(promos.map((p) => (p.id === promo.id ? promo : p)));
    }
    setEditingPromo(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    setPromos(promos.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id: number) => {
    setPromos(
      promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activePromos = promos.filter((p) => p.isActive).length;
  const totalUsed = promos.reduce((acc, p) => acc + p.usedCount, 0);

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
            Промокоды
            <span className="text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">
              {promos.length}
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Управление скидками и промокодами
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPromo({ ...emptyPromo });
            setIsCreating(true);
          }}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новый промокод
        </button>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Всего промокодов",
            value: promos.length,
            icon: Tag,
            color: "bg-accent/10 text-accent",
          },
          {
            label: "Активных",
            value: activePromos,
            icon: Check,
            color: "bg-green-500/10 text-green-400",
          },
          {
            label: "Всего использований",
            value: totalUsed,
            icon: Percent,
            color: "bg-blue-500/10 text-blue-400",
          },
          {
            label: "Неактивных",
            value: promos.length - activePromos,
            icon: X,
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

      {/* Список промокодов */}
      <div className="space-y-3">
        {promos.map((promo) => (
          <motion.div
            key={promo.id}
            variants={itemAnim}
            className={`bg-[#111] border rounded-2xl overflow-hidden transition-all ${
              promo.isActive
                ? "border-white/10"
                : "border-white/5 opacity-60"
            }`}
          >
            <div className="p-4 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Код и копировать */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                      <Tag className="w-4 h-4 text-accent" />
                      <span className="font-mono font-bold text-lg tracking-wider">
                        {promo.code}
                      </span>
                    </div>
                    <button
                      onClick={() => copyCode(promo.id, promo.code)}
                      className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                      title="Копировать код"
                    >
                      {copiedId === promo.id ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {!promo.isActive && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Неактивен
                      </span>
                    )}
                  </div>

                  {/* Описание */}
                  <p className="text-gray-400 text-sm mb-3">
                    {promo.description}
                  </p>

                  {/* Параметры */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-500 text-[11px] mb-1">Скидка</p>
                      <p className="font-semibold text-sm text-accent">
                        {promo.discountType === "percent"
                          ? `${promo.discount}%`
                          : `${promo.discount} ₽`}
                      </p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-500 text-[11px] mb-1">
                        Мин. заказ
                      </p>
                      <p className="font-semibold text-sm">
                        {promo.minOrder.toLocaleString("ru-RU")} ₽
                      </p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-500 text-[11px] mb-1">
                        Использовано
                      </p>
                      <p className="font-semibold text-sm">
                        {promo.usedCount}
                        {promo.maxUses > 0 && (
                          <span className="text-gray-500">
                            {" "}
                            / {promo.maxUses}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-500 text-[11px] mb-1">
                        Действует до
                      </p>
                      <p className="font-semibold text-sm">
                        {promo.validTo
                          ? new Date(promo.validTo).toLocaleDateString("ru-RU")
                          : "Бессрочно"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Действия */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(promo.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      promo.isActive ? "bg-accent" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        promo.isActive ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setEditingPromo({ ...promo });
                      setIsCreating(false);
                    }}
                    className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteConfirm === promo.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(promo.id)}
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
                      onClick={() => setDeleteConfirm(promo.id)}
                      className="p-2 rounded-xl hover:bg-red-500/5 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Модалка редактирования */}
      <AnimatePresence>
        {editingPromo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setEditingPromo(null);
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
                  {isCreating ? "Новый промокод" : "Редактирование"}
                </h3>
                <button
                  onClick={() => {
                    setEditingPromo(null);
                    setIsCreating(false);
                  }}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Форма */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Код */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Промокод
                  </label>
                  <input
                    type="text"
                    value={editingPromo.code}
                    onChange={(e) =>
                      setEditingPromo({
                        ...editingPromo,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="VKUS20"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono tracking-wider placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* Описание */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Описание
                  </label>
                  <input
                    type="text"
                    value={editingPromo.description}
                    onChange={(e) =>
                      setEditingPromo({
                        ...editingPromo,
                        description: e.target.value,
                      })
                    }
                    placeholder="Описание промокода"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* Скидка */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Тип скидки
                    </label>
                    <select
                      value={editingPromo.discountType}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          discountType: e.target.value as "percent" | "fixed",
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    >
                      <option value="percent" className="bg-[#111]">
                        Процент (%)
                      </option>
                      <option value="fixed" className="bg-[#111]">
                        Фиксированная (₽)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Размер скидки
                    </label>
                    <input
                      type="number"
                      value={editingPromo.discount}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          discount: Number(e.target.value),
                        })
                      }
                      min={1}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Мин. заказ и макс. использований */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Мин. заказ (₽)
                    </label>
                    <input
                      type="number"
                      value={editingPromo.minOrder}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          minOrder: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Макс. использований
                    </label>
                    <input
                      type="number"
                      value={editingPromo.maxUses}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          maxUses: Number(e.target.value),
                        })
                      }
                      min={0}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                    <p className="text-[11px] text-gray-600 mt-1">
                      0 = безлимитно
                    </p>
                  </div>
                </div>

                {/* Даты */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Действует с
                    </label>
                    <input
                      type="date"
                      value={editingPromo.validFrom}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          validFrom: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Действует до
                    </label>
                    <input
                      type="date"
                      value={editingPromo.validTo}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          validTo: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                    <p className="text-[11px] text-gray-600 mt-1">
                      Оставьте пустым для бессрочного
                    </p>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="px-6 py-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setEditingPromo(null);
                    setIsCreating(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    if (editingPromo.code.trim()) {
                      handleSave(editingPromo);
                    }
                  }}
                  disabled={!editingPromo.code.trim()}
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
