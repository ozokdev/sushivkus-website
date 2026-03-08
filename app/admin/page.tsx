"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
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

// TODO: Go API менен алмаштыруу
const stats = {
  todayOrders: 12,
  todayRevenue: 48500,
  pendingOrders: 3,
  deliveredOrders: 9,
};

type OrderStatus = "new" | "preparing" | "delivered" | "cancelled";

interface RecentOrder {
  id: number;
  name: string;
  phone: string;
  total: number;
  status: OrderStatus;
  time: string;
}

// TODO: Go API менен алмаштыруу
const recentOrders: RecentOrder[] = [
  { id: 1001, name: "Алексей К.", phone: "+7 925 123-45-67", total: 2990, status: "delivered", time: "12:30" },
  { id: 1002, name: "Мария С.", phone: "+7 916 234-56-78", total: 1590, status: "preparing", time: "13:15" },
  { id: 1003, name: "Дмитрий П.", phone: "+7 903 345-67-89", total: 3990, status: "new", time: "13:45" },
  { id: 1004, name: "Анна В.", phone: "+7 926 456-78-90", total: 890, status: "new", time: "14:00" },
  { id: 1005, name: "Иван М.", phone: "+7 915 567-89-01", total: 2490, status: "cancelled", time: "11:00" },
];

const statusConfig: Record<OrderStatus, { label: string; class: string }> = {
  new: { label: "Новый", class: "bg-blue-500/20 text-blue-400" },
  preparing: { label: "Готовится", class: "bg-yellow-500/20 text-yellow-400" },
  delivered: { label: "Доставлен", class: "bg-green-500/20 text-green-400" },
  cancelled: { label: "Отменён", class: "bg-red-500/20 text-red-400" },
};

const statCards = [
  { label: "Заказов сегодня", value: stats.todayOrders, icon: ShoppingBag, color: "bg-accent/10 text-accent" },
  { label: "Выручка сегодня", value: `${stats.todayRevenue.toLocaleString("ru-RU")} ₽`, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-400" },
  { label: "В ожидании", value: stats.pendingOrders, icon: Clock, color: "bg-yellow-500/10 text-yellow-400" },
  { label: "Доставлено", value: stats.deliveredOrders, icon: CheckCircle, color: "bg-green-500/10 text-green-400" },
];

// TODO: Go API менен алмаштыруу
const weeklyData = [
  { day: "Пн", orders: 18, revenue: 42000 },
  { day: "Вт", orders: 14, revenue: 35000 },
  { day: "Ср", orders: 22, revenue: 58000 },
  { day: "Чт", orders: 16, revenue: 41000 },
  { day: "Пт", orders: 28, revenue: 72000 },
  { day: "Сб", orders: 35, revenue: 95000 },
  { day: "Вс", orders: 12, revenue: 48500 },
];

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

export default function AdminDashboard() {
  const [chartMode, setChartMode] = useState<"orders" | "revenue">("orders");

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Заголовок */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
        <p className="text-gray-500 text-sm mt-1 capitalize">{today}</p>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map((card, i) => (
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
          </motion.div>
        ))}
      </div>

      {/* График */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Статистика за неделю</h3>
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
              Выручка
            </button>
          </div>
        </div>
        <div className="h-[250px] lg:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "orders" ? (
              <BarChart data={weeklyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="orders" name="orders" fill="#e63946" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}к`} />
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                <th className="text-left px-4 lg:px-6 py-3 font-medium">№</th>
                <th className="text-left px-4 py-3 font-medium">Клиент</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Телефон</th>
                <th className="text-left px-4 py-3 font-medium">Сумма</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="text-left px-4 py-3 font-medium">Время</th>
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Связь</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = statusConfig[order.status];
                const phoneClean = order.phone.replace(/\D/g, "");
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
                    <td className="px-4 py-3 text-sm font-semibold">
                      {order.total.toLocaleString("ru-RU")} ₽
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
      </motion.div>
    </motion.div>
  );
}
