"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Clock,
  Truck,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface DeliveryZone {
  id: number;
  name: string;
  minOrder: number;
  deliveryPrice: number;
  freeFrom: number;
  estimatedTime: string;
  isActive: boolean;
  color: string;
  areas: string[];
}

const initialZones: DeliveryZone[] = [
  {
    id: 1,
    name: "Зона 1 — Центр",
    minOrder: 500,
    deliveryPrice: 0,
    freeFrom: 0,
    estimatedTime: "30-45 мин",
    isActive: true,
    color: "#22c55e",
    areas: ["Центр города", "ул. Кирова", "ул. Ленина", "пр-т Победы"],
  },
  {
    id: 2,
    name: "Зона 2 — Ближняя",
    minOrder: 800,
    deliveryPrice: 150,
    freeFrom: 1500,
    estimatedTime: "40-60 мин",
    isActive: true,
    color: "#3b82f6",
    areas: ["мкр. Красная Горка", "мкр. Южный", "ул. Гагарина"],
  },
  {
    id: 3,
    name: "Зона 3 — Дальняя",
    minOrder: 1200,
    deliveryPrice: 300,
    freeFrom: 2500,
    estimatedTime: "50-80 мин",
    isActive: true,
    color: "#f59e0b",
    areas: ["Томилино", "Октябрьский", "Малаховка"],
  },
  {
    id: 4,
    name: "Зона 4 — Пригород",
    minOrder: 2000,
    deliveryPrice: 500,
    freeFrom: 4000,
    estimatedTime: "60-90 мин",
    isActive: false,
    color: "#ef4444",
    areas: ["Жуковский", "Раменское", "Быково"],
  },
];

const colorOptions = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DeliveryPage() {
  const [zones, setZones] = useState<DeliveryZone[]>(initialZones);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const emptyZone: DeliveryZone = {
    id: Date.now(),
    name: "",
    minOrder: 500,
    deliveryPrice: 0,
    freeFrom: 1500,
    estimatedTime: "30-45 мин",
    isActive: true,
    color: "#3b82f6",
    areas: [],
  };

  const [newArea, setNewArea] = useState("");

  const handleSave = (zone: DeliveryZone) => {
    if (isCreating) {
      setZones([...zones, { ...zone, id: Date.now() }]);
    } else {
      setZones(zones.map((z) => (z.id === zone.id ? zone : z)));
    }
    setEditingZone(null);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    setZones(zones.filter((z) => z.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id: number) => {
    setZones(
      zones.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z))
    );
  };

  const activeZones = zones.filter((z) => z.isActive).length;
  const totalAreas = zones.reduce((acc, z) => acc + z.areas.length, 0);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Заголовок */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Доставка
            <span className="text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">
              {zones.length}
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Управление зонами и стоимостью доставки
          </p>
        </div>
        <button
          onClick={() => {
            setEditingZone({ ...emptyZone });
            setIsCreating(true);
          }}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить зону
        </button>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Всего зон",
            value: zones.length,
            icon: MapPin,
            color: "bg-accent/10 text-accent",
          },
          {
            label: "Активных",
            value: activeZones,
            icon: Check,
            color: "bg-green-500/10 text-green-400",
          },
          {
            label: "Районов",
            value: totalAreas,
            icon: Truck,
            color: "bg-blue-500/10 text-blue-400",
          },
          {
            label: "Макс. время",
            value:
              zones.length > 0
                ? zones[zones.length - 1].estimatedTime
                : "—",
            icon: Clock,
            color: "bg-yellow-500/10 text-yellow-400",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
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

      {/* Зоны */}
      <div className="grid gap-4">
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            variants={item}
            className={`bg-[#111] border rounded-2xl overflow-hidden transition-all ${
              zone.isActive
                ? "border-white/10"
                : "border-white/5 opacity-60"
            }`}
          >
            <div className="p-4 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Инфо */}
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="w-4 h-4 rounded-full mt-1 flex-shrink-0 ring-2 ring-offset-2 ring-offset-[#111]"
                    style={{
                      backgroundColor: zone.color,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      "--tw-ring-color": zone.color,
                    } as any}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{zone.name}</h3>
                      {!zone.isActive && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          Отключена
                        </span>
                      )}
                    </div>

                    {/* Параметры */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      <div className="bg-white/[0.03] rounded-xl p-3">
                        <p className="text-gray-500 text-[11px] mb-1">
                          Мин. заказ
                        </p>
                        <p className="font-semibold text-sm">
                          {zone.minOrder.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                      <div className="bg-white/[0.03] rounded-xl p-3">
                        <p className="text-gray-500 text-[11px] mb-1">
                          Доставка
                        </p>
                        <p className="font-semibold text-sm">
                          {zone.deliveryPrice === 0
                            ? "Бесплатно"
                            : `${zone.deliveryPrice} ₽`}
                        </p>
                      </div>
                      <div className="bg-white/[0.03] rounded-xl p-3">
                        <p className="text-gray-500 text-[11px] mb-1">
                          Бесплатно от
                        </p>
                        <p className="font-semibold text-sm">
                          {zone.freeFrom === 0
                            ? "Всегда"
                            : `${zone.freeFrom.toLocaleString("ru-RU")} ₽`}
                        </p>
                      </div>
                      <div className="bg-white/[0.03] rounded-xl p-3">
                        <p className="text-gray-500 text-[11px] mb-1">
                          Время
                        </p>
                        <p className="font-semibold text-sm">
                          {zone.estimatedTime}
                        </p>
                      </div>
                    </div>

                    {/* Районы */}
                    {zone.areas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {zone.areas.map((area) => (
                          <span
                            key={area}
                            className="text-[11px] bg-white/5 text-gray-400 px-2 py-1 rounded-lg"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Действия */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(zone.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      zone.isActive ? "bg-accent" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        zone.isActive ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setEditingZone({ ...zone });
                      setIsCreating(false);
                    }}
                    className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteConfirm === zone.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(zone.id)}
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
                      onClick={() => setDeleteConfirm(zone.id)}
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
        {editingZone && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setEditingZone(null);
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
                  {isCreating ? "Новая зона" : "Редактирование"}
                </h3>
                <button
                  onClick={() => {
                    setEditingZone(null);
                    setIsCreating(false);
                  }}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Форма */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Название */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Название зоны
                  </label>
                  <input
                    type="text"
                    value={editingZone.name}
                    onChange={(e) =>
                      setEditingZone({ ...editingZone, name: e.target.value })
                    }
                    placeholder="Например: Зона 1 — Центр"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>

                {/* Цвет */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Цвет зоны
                  </label>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setEditingZone({ ...editingZone, color })
                        }
                        className={`w-8 h-8 rounded-full transition-transform ${
                          editingZone.color === color
                            ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#111]"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Цены */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Мин. заказ (₽)
                    </label>
                    <input
                      type="number"
                      value={editingZone.minOrder}
                      onChange={(e) =>
                        setEditingZone({
                          ...editingZone,
                          minOrder: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Стоимость доставки (₽)
                    </label>
                    <input
                      type="number"
                      value={editingZone.deliveryPrice}
                      onChange={(e) =>
                        setEditingZone({
                          ...editingZone,
                          deliveryPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Бесплатно от (₽)
                    </label>
                    <input
                      type="number"
                      value={editingZone.freeFrom}
                      onChange={(e) =>
                        setEditingZone({
                          ...editingZone,
                          freeFrom: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">
                      Время доставки
                    </label>
                    <input
                      type="text"
                      value={editingZone.estimatedTime}
                      onChange={(e) =>
                        setEditingZone({
                          ...editingZone,
                          estimatedTime: e.target.value,
                        })
                      }
                      placeholder="30-45 мин"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Районы */}
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">
                    Районы / Улицы
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newArea.trim()) {
                          setEditingZone({
                            ...editingZone,
                            areas: [...editingZone.areas, newArea.trim()],
                          });
                          setNewArea("");
                        }
                      }}
                      placeholder="Добавить район..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (newArea.trim()) {
                          setEditingZone({
                            ...editingZone,
                            areas: [...editingZone.areas, newArea.trim()],
                          });
                          setNewArea("");
                        }
                      }}
                      className="px-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {editingZone.areas.map((area, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 text-xs bg-white/5 text-gray-300 px-2.5 py-1.5 rounded-lg group"
                      >
                        {area}
                        <button
                          onClick={() =>
                            setEditingZone({
                              ...editingZone,
                              areas: editingZone.areas.filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="px-6 py-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setEditingZone(null);
                    setIsCreating(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    if (editingZone.name.trim()) {
                      handleSave(editingZone);
                    }
                  }}
                  disabled={!editingZone.name.trim()}
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
