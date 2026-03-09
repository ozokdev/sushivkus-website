"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Gift,
  Percent,
  Package,
  Zap,
  Calendar,
} from "lucide-react";

type PromoType = "combo" | "bundle" | "happy_hour" | "gift";

interface Promotion {
  id: number;
  name: string;
  type: PromoType;
  description: string;
  items: string[];
  originalPrice: number;
  promoPrice: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  conditions: string;
}

const initialPromotions: Promotion[] = [
  {
    id: 1, name: "Сет для двоих", type: "combo",
    description: "Филадельфия + Калифорния + 2 Мисо супа по специальной цене",
    items: ["Филадельфия", "Калифорния", "Мисо суп x2"],
    originalPrice: 3200, promoPrice: 2490,
    validFrom: "2026-03-01", validTo: "2026-04-30", isActive: true,
    conditions: "Действует при заказе от 1500 ₽",
  },
  {
    id: 2, name: "2+1 на роллы", type: "bundle",
    description: "Закажи 2 любых ролла и получи третий в подарок",
    items: ["Любые роллы"],
    originalPrice: 0, promoPrice: 0,
    validFrom: "2026-03-01", validTo: "2026-03-31", isActive: true,
    conditions: "Бесплатный ролл — самый дешёвый из трёх",
  },
  {
    id: 3, name: "Happy Hour 12:00-14:00", type: "happy_hour",
    description: "Скидка 20% на всё меню в обеденные часы",
    items: ["Всё меню"],
    originalPrice: 0, promoPrice: 0,
    validFrom: "2026-01-01", validTo: "2026-12-31", isActive: true,
    conditions: "Только с 12:00 до 14:00 по будням",
  },
  {
    id: 4, name: "Подарок к первому заказу", type: "gift",
    description: "Бесплатный Мисо суп при первом заказе",
    items: ["Мисо суп"],
    originalPrice: 300, promoPrice: 0,
    validFrom: "2026-01-01", validTo: "2026-12-31", isActive: false,
    conditions: "Только для новых клиентов",
  },
];

const typeConfig: Record<PromoType, { label: string; icon: typeof Gift; color: string; bg: string }> = {
  combo: { label: "Комбо", icon: Package, color: "text-accent", bg: "bg-accent/10" },
  bundle: { label: "2+1 / Бандл", icon: Gift, color: "text-purple-400", bg: "bg-purple-500/10" },
  happy_hour: { label: "Happy Hour", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  gift: { label: "Подарок", icon: Gift, color: "text-green-400", bg: "bg-green-500/10" },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const emptyPromo: Promotion = {
    id: Date.now(), name: "", type: "combo", description: "",
    items: [], originalPrice: 0, promoPrice: 0,
    validFrom: new Date().toISOString().split("T")[0], validTo: "",
    isActive: true, conditions: "",
  };

  const handleSave = (promo: Promotion) => {
    if (isCreating) {
      setPromotions([...promotions, { ...promo, id: Date.now() }]);
    } else {
      setPromotions(promotions.map((p) => (p.id === promo.id ? promo : p)));
    }
    setEditing(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    setPromotions(promotions.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id: number) => {
    setPromotions(promotions.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  };

  const activeCount = promotions.filter((p) => p.isActive).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Заголовок */}
      <motion.div variants={itemAnim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Акции и скидки
            <span className="text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">{promotions.length}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Комбо-сеты, бандлы, Happy Hour и подарки</p>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyPromo }); setIsCreating(true); }}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Новая акция
        </button>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Всего акций", value: promotions.length, icon: Gift, color: "bg-accent/10 text-accent" },
          { label: "Активных", value: activeCount, icon: Check, color: "bg-green-500/10 text-green-400" },
          { label: "Комбо-сеты", value: promotions.filter((p) => p.type === "combo").length, icon: Package, color: "bg-blue-500/10 text-blue-400" },
          { label: "Неактивных", value: promotions.length - activeCount, icon: X, color: "bg-gray-500/10 text-gray-400" },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Акциялар тизмеси */}
      <div className="space-y-3">
        {promotions.map((promo) => {
          const config = typeConfig[promo.type];
          const Icon = config.icon;
          const discount = promo.originalPrice > 0
            ? Math.round((1 - promo.promoPrice / promo.originalPrice) * 100)
            : 0;

          return (
            <motion.div
              key={promo.id}
              variants={itemAnim}
              className={`bg-[#111] border rounded-2xl overflow-hidden transition-all ${
                promo.isActive ? "border-white/10" : "border-white/5 opacity-60"
              }`}
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{promo.name}</h3>
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      {!promo.isActive && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Неактивна</span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{promo.description}</p>

                    {/* Тамактар */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {promo.items.map((item) => (
                        <span key={item} className="bg-white/5 text-sm px-3 py-1 rounded-full text-gray-300">{item}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {promo.originalPrice > 0 && (
                        <div className="bg-white/[0.03] rounded-xl p-3">
                          <p className="text-gray-500 text-[11px] mb-1">Цена</p>
                          <p className="text-sm">
                            <span className="line-through text-gray-600 mr-2">{promo.originalPrice.toLocaleString("ru-RU")} ₽</span>
                            <span className="font-semibold text-accent">{promo.promoPrice.toLocaleString("ru-RU")} ₽</span>
                          </p>
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="bg-white/[0.03] rounded-xl p-3">
                          <p className="text-gray-500 text-[11px] mb-1">Скидка</p>
                          <p className="font-semibold text-sm text-green-400">-{discount}%</p>
                        </div>
                      )}
                      <div className="bg-white/[0.03] rounded-xl p-3">
                        <p className="text-gray-500 text-[11px] mb-1">Период</p>
                        <p className="font-semibold text-sm">
                          {promo.validTo ? new Date(promo.validTo).toLocaleDateString("ru-RU") : "Бессрочно"}
                        </p>
                      </div>
                      {promo.conditions && (
                        <div className="bg-white/[0.03] rounded-xl p-3 col-span-2 sm:col-span-1">
                          <p className="text-gray-500 text-[11px] mb-1">Условия</p>
                          <p className="text-xs text-gray-300">{promo.conditions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(promo.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${promo.isActive ? "bg-accent" : "bg-gray-700"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${promo.isActive ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                    <button onClick={() => { setEditing({ ...promo }); setIsCreating(false); }} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    {deleteConfirm === promo.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(promo.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(promo.id)} className="p-2 rounded-xl hover:bg-red-500/5 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Модалка */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setEditing(null); setIsCreating(false); }} className="fixed inset-0 bg-black/60 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-[#111] border border-white/10 rounded-2xl z-50 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="font-semibold text-lg">{isCreating ? "Новая акция" : "Редактирование"}</h3>
                <button onClick={() => { setEditing(null); setIsCreating(false); }} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Название</label>
                  <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Сет для двоих" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors" />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Тип акции</label>
                  <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as PromoType })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors">
                    {Object.entries(typeConfig).map(([key, cfg]) => (
                      <option key={key} value={key} className="bg-[#111]">{cfg.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Описание</label>
                  <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={2} placeholder="Описание акции..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Старая цена (₽)</label>
                    <input type="number" value={editing.originalPrice} onChange={(e) => setEditing({ ...editing, originalPrice: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Акция цена (₽)</label>
                    <input type="number" value={editing.promoPrice} onChange={(e) => setEditing({ ...editing, promoPrice: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Действует с</label>
                    <input type="date" value={editing.validFrom} onChange={(e) => setEditing({ ...editing, validFrom: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Действует до</label>
                    <input type="date" value={editing.validTo} onChange={(e) => setEditing({ ...editing, validTo: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Условия</label>
                  <input type="text" value={editing.conditions} onChange={(e) => setEditing({ ...editing, conditions: e.target.value })}
                    placeholder="Условия акции" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors" />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/10 flex gap-3">
                <button onClick={() => { setEditing(null); setIsCreating(false); }} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                  Отмена
                </button>
                <button
                  onClick={() => { if (editing.name.trim()) handleSave(editing); }}
                  disabled={!editing.name.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50"
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
