"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Percent,
  Calendar,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const periodOptions = [
  { label: "7 күн", days: 7 },
  { label: "14 күн", days: 14 },
  { label: "30 күн", days: 30 },
  { label: "60 күн", days: 60 },
  { label: "90 күн", days: 90 },
];

type OrderStatus = "new" | "paid" | "preparing" | "cooking" | "delivering" | "delivered" | "cancelled";

interface ApiOrder {
  ID: number;
  customer_name: string;
  phone: string;
  total: number;
  status: OrderStatus;
  CreatedAt: string;
}

interface RecentOrder {
  id: number;
  name: string;
  phone: string;
  total: number;
  status: OrderStatus;
  time: string;
  date: string;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  new: { label: "Новый", class: "bg-blue-500/20 text-blue-400" },
  paid: { label: "Оплачен", class: "bg-emerald-500/20 text-emerald-400" },
  preparing: { label: "Готовится", class: "bg-yellow-500/20 text-yellow-400" },
  cooking: { label: "Готовится", class: "bg-yellow-500/20 text-yellow-400" },
  delivering: { label: "В пути", class: "bg-purple-500/20 text-purple-400" },
  delivered: { label: "Доставлен", class: "bg-green-500/20 text-green-400" },
  cancelled: { label: "Отменён", class: "bg-red-500/20 text-red-400" },
};

const defaultStatus = { label: "Неизвестно", class: "bg-gray-500/20 text-gray-400" };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name === "revenue"
            ? `${p.value.toLocaleString("ru-RU")} ₽`
            : `${p.value} заказов`}
        </p>
      ))}
    </div>
  );
};

function getToken() {
  return localStorage.getItem("admin_token") || "";
}

function buildChartData(orders: ApiOrder[], days: number) {
  const now = new Date();
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    const dayName = dayNames[date.getDay()];
    const dateStr = date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

    const dayOrders = orders.filter((o) => {
      const orderDate = new Date(o.CreatedAt).toISOString().split("T")[0];
      return orderDate === dateKey && o.status !== "cancelled";
    });

    const revenue = dayOrders.reduce((s, o) => s + o.total, 0);

    data.push({
      day: days <= 14 ? dayName : dateStr,
      fullDate: dateStr,
      orders: dayOrders.length,
      revenue: Math.round(revenue),
    });
  }
  return data;
}

export default function AdminDashboard() {
  const [chartMode, setChartMode] = useState<"orders" | "revenue">("orders");
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [commission, setCommission] = useState(10);
  const [showCommissionEdit, setShowCommissionEdit] = useState(false);
  const [tempCommission, setTempCommission] = useState(10);
  const [allOrders, setAllOrders] = useState<RecentOrder[]>([]);
  const [allApiOrders, setAllApiOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin_commission");
    if (saved) {
      const val = Number(saved);
      setCommission(val);
      setTempCommission(val);
    }
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("https://api.sushivkus.ru/api/orders?limit=100", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) {
          const data = await res.json();
          const orders: ApiOrder[] = data.orders || [];
          setAllApiOrders(orders);
          setAllOrders(
            orders.slice(0, 12).map((o) => {
              const d = new Date(o.CreatedAt);
              return {
                id: o.ID,
                name: o.customer_name,
                phone: o.phone,
                total: o.total,
                status: o.status as OrderStatus,
                time: d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
                date: d.toISOString().split("T")[0],
              };
            })
          );
        }
      } catch {
        // API жок болсо бош калсын
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const chartData = buildChartData(allApiOrders, selectedPeriod);

  const totalOrders = chartData.reduce((s, d) => s + d.orders, 0);
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);
  const myEarnings = Math.round(totalRevenue * (commission / 100));

  const todayData = chartData[chartData.length - 1];
  const todayOrders = todayData?.orders || 0;
  const todayRevenue = todayData?.revenue || 0;
  const todayEarnings = Math.round(todayRevenue * (commission / 100));

  const pendingOrders = allOrders.filter((o) => o.status === "new" || o.status === "preparing").length;
  const deliveredOrders = allOrders.filter((o) => o.status === "delivered").length;

  const saveCommission = () => {
    const val = Math.max(1, Math.min(100, tempCommission));
    setCommission(val);
    setTempCommission(val);
    localStorage.setItem("admin_commission", String(val));
    setShowCommissionEdit(false);
  };

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentPeriodLabel = periodOptions.find((p) => p.days === selectedPeriod)?.label || `${selectedPeriod} күн`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Заголовок + Мөөнөт тандоо */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">{today}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Комиссия */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCommissionEdit(!showCommissionEdit);
                setTempCommission(commission);
              }}
              className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/20 transition-colors"
            >
              <Percent className="w-4 h-4" />
              Моя комиссия: {commission}%
            </button>

            <AnimatePresence>
              {showCommissionEdit && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 z-20 w-64 shadow-2xl"
                >
                  <p className="text-sm text-gray-400 mb-3">Комиссия процент</p>
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setTempCommission(Math.max(1, tempCommission - 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={tempCommission}
                        onChange={(e) => setTempCommission(Number(e.target.value))}
                        min={1}
                        max={100}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center text-2xl font-bold text-accent focus:outline-none focus:border-accent/40"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">%</span>
                    </div>
                    <button
                      onClick={() => setTempCommission(Math.min(100, tempCommission + 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCommissionEdit(false)}
                      className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={saveCommission}
                      className="flex-1 px-3 py-2 rounded-xl text-sm bg-accent text-white hover:bg-accent/90 transition-colors font-medium"
                    >
                      Сактоо
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Мөөнөт тандоо */}
          <div className="relative">
            <button
              onClick={() => setPeriodOpen(!periodOpen)}
              className="flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              {currentPeriodLabel}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${periodOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {periodOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl min-w-[140px]"
                >
                  {periodOptions.map((opt) => (
                    <button
                      key={opt.days}
                      onClick={() => {
                        setSelectedPeriod(opt.days);
                        setPeriodOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                        selectedPeriod === opt.days
                          ? "text-accent bg-accent/5"
                          : "text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Статистика карточкалары */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          {
            label: "Заказов сегодня",
            value: todayOrders,
            icon: ShoppingBag,
            color: "bg-accent/10 text-accent",
          },
          {
            label: `Мой доход (${commission}%)`,
            value: `${todayEarnings.toLocaleString("ru-RU")} ₽`,
            subtitle: `из ${todayRevenue.toLocaleString("ru-RU")} ₽`,
            icon: TrendingUp,
            color: "bg-emerald-500/10 text-emerald-400",
          },
          {
            label: "В ожидании",
            value: pendingOrders,
            icon: Clock,
            color: "bg-yellow-500/10 text-yellow-400",
          },
          {
            label: "Доставлено",
            value: deliveredOrders,
            icon: CheckCircle,
            color: "bg-green-500/10 text-green-400",
          },
        ].map((card) => (
          <motion.div
            key={card.label}
            variants={item}
            className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6"
          >
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold">{card.value}</p>
            <p className="text-gray-400 text-xs lg:text-sm mt-1">{card.label}</p>
            {"subtitle" in card && card.subtitle && (
              <p className="text-gray-600 text-[11px] mt-0.5">{card.subtitle}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Мөөнөт боюнча жалпы */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-5">
          <p className="text-gray-500 text-xs mb-1">{currentPeriodLabel} — Заказы</p>
          <p className="text-xl font-bold">{totalOrders.toLocaleString("ru-RU")}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-5">
          <p className="text-gray-500 text-xs mb-1">{currentPeriodLabel} — Жалпы выручка</p>
          <p className="text-xl font-bold">{totalRevenue.toLocaleString("ru-RU")} ₽</p>
        </div>
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-4 lg:p-5">
          <p className="text-accent/70 text-xs mb-1">{currentPeriodLabel} — Менин кирешем ({commission}%)</p>
          <p className="text-xl font-bold text-accent">{myEarnings.toLocaleString("ru-RU")} ₽</p>
        </div>
      </motion.div>

      {/* График */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">
            Статистика — {currentPeriodLabel}
          </h3>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setChartMode("orders")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartMode === "orders"
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Заказы
            </button>
            <button
              onClick={() => setChartMode("revenue")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartMode === "revenue"
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Мой доход
            </button>
          </div>
        </div>
        <div className="h-[250px] lg:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "orders" ? (
              <BarChart data={chartData} barSize={selectedPeriod <= 14 ? 32 : 12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={11} tickLine={false} axisLine={false} interval={selectedPeriod > 30 ? Math.floor(selectedPeriod / 15) : 0} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="orders" name="orders" fill="#e63946" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData.map((d) => ({ ...d, revenue: Math.round(d.revenue * (commission / 100)) }))}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={11} tickLine={false} axisLine={false} interval={selectedPeriod > 30 ? Math.floor(selectedPeriod / 15) : 0} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}к`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#e63946" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Последние заказы */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-white/10">
          <h3 className="font-semibold text-lg">Последние заказы</h3>
          <a
            href="/admin/orders"
            className="flex items-center gap-1 text-accent text-sm hover:underline"
          >
            Все заказы
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {allOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Заказов пока нет</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                  <th className="text-left px-4 lg:px-6 py-3 font-medium">№</th>
                  <th className="text-left px-4 py-3 font-medium">Клиент</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Телефон</th>
                  <th className="text-left px-4 py-3 font-medium">Сумма</th>
                  <th className="text-left px-4 py-3 font-medium">Мой %</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 font-medium">Время</th>
                  <th className="text-left px-4 lg:px-6 py-3 font-medium">Связь</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 5).map((order) => {
                  const status = statusConfig[order.status] || defaultStatus;
                  const phoneClean = order.phone.replace(/\D/g, "");
                  const myPart = Math.round(order.total * (commission / 100));
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-3 text-sm font-medium text-gray-300">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-sm">{order.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
                        {order.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {order.total.toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-accent">
                        {myPart.toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {order.time}
                      </td>
                      <td className="px-4 lg:px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:+${phoneClean}`}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            title="Позвонить"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://wa.me/${phoneClean}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-green-500/10 text-gray-400 hover:text-green-400 transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
