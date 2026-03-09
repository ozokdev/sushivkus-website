"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShoppingBag,
  Star,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Популярдуу тамактар
const popularItems = [
  { name: "Филадельфия", orders: 156, revenue: 124800, trend: 12 },
  { name: "Калифорния", orders: 132, revenue: 92400, trend: 8 },
  { name: "Дракон ролл", orders: 98, revenue: 88200, trend: -3 },
  { name: "Сет Самурай", orders: 87, revenue: 173400, trend: 15 },
  { name: "Мисо суп", orders: 76, revenue: 22800, trend: 5 },
  { name: "Унаги", orders: 65, revenue: 58500, trend: -2 },
  { name: "Спайси лосось", orders: 58, revenue: 40600, trend: 20 },
  { name: "Эби темпура", orders: 52, revenue: 41600, trend: 7 },
  { name: "Том Ям", orders: 45, revenue: 22500, trend: 10 },
  { name: "Эдамамэ", orders: 38, revenue: 11400, trend: -5 },
];

// Саат боюнча заказдар
const hourlyData = [
  { hour: "10:00", orders: 2 },
  { hour: "11:00", orders: 5 },
  { hour: "12:00", orders: 12 },
  { hour: "13:00", orders: 18 },
  { hour: "14:00", orders: 15 },
  { hour: "15:00", orders: 8 },
  { hour: "16:00", orders: 6 },
  { hour: "17:00", orders: 10 },
  { hour: "18:00", orders: 22 },
  { hour: "19:00", orders: 28 },
  { hour: "20:00", orders: 25 },
  { hour: "21:00", orders: 18 },
  { hour: "22:00", orders: 10 },
  { hour: "23:00", orders: 4 },
];

// Категориялар боюнча
const categoryData = [
  { name: "Роллы", value: 45, color: "#e63946" },
  { name: "Сеты", value: 25, color: "#457b9d" },
  { name: "Супы", value: 12, color: "#2a9d8f" },
  { name: "Горячее", value: 10, color: "#e9c46a" },
  { name: "Напитки", value: 8, color: "#f4a261" },
];

// Жума күндөрү боюнча
const weekdayData = [
  { day: "Пн", orders: 45, revenue: 112000 },
  { day: "Вт", orders: 38, revenue: 95000 },
  { day: "Ср", orders: 52, revenue: 130000 },
  { day: "Чт", orders: 48, revenue: 120000 },
  { day: "Пт", orders: 72, revenue: 180000 },
  { day: "Сб", orders: 85, revenue: 245000 },
  { day: "Вс", orders: 65, revenue: 162000 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#e63946" }} className="font-medium">
          {typeof p.value === "number" && p.value > 1000
            ? `${p.value.toLocaleString("ru-RU")} ₽`
            : `${p.value} заказов`}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const peakHour = hourlyData.reduce((max, h) => (h.orders > max.orders ? h : max), hourlyData[0]);
  const totalOrders = popularItems.reduce((s, i) => s + i.orders, 0);
  const totalRevenue = popularItems.reduce((s, i) => s + i.revenue, 0);
  const avgCheck = Math.round(totalRevenue / totalOrders);
  const bestDay = weekdayData.reduce((max, d) => (d.orders > max.orders ? d : max), weekdayData[0]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Заголовок */}
      <motion.div variants={itemAnim}>
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <p className="text-gray-500 text-sm mt-1">Детальная статистика и тренды</p>
      </motion.div>

      {/* Жалпы статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Средний чек", value: `${avgCheck.toLocaleString("ru-RU")} ₽`, icon: ShoppingBag, color: "bg-accent/10 text-accent" },
          { label: "Пик заказов", value: peakHour.hour, sub: `${peakHour.orders} заказов`, icon: Clock, color: "bg-yellow-500/10 text-yellow-400" },
          { label: "Лучший день", value: bestDay.day, sub: `${bestDay.orders} заказов`, icon: Star, color: "bg-emerald-500/10 text-emerald-400" },
          { label: "Конверсия", value: "68%", sub: "из просмотров", icon: TrendingUp, color: "bg-blue-500/10 text-blue-400" },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            {"sub" in stat && <p className="text-gray-600 text-[11px]">{stat.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Саат боюнча заказдар */}
      <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6">
        <h3 className="font-semibold text-lg mb-1">Заказы по времени суток</h3>
        <p className="text-gray-500 text-xs mb-6">Когда больше всего заказов</p>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="hour" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="orders" stroke="#e63946" strokeWidth={2} fill="url(#hourGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Категориялар пирог */}
        <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6">
          <h3 className="font-semibold text-lg mb-1">Категории</h3>
          <p className="text-gray-500 text-xs mb-6">Распределение заказов</p>
          <div className="h-[250px] flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-gray-300">{cat.name}</span>
                  <span className="text-sm font-semibold ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Жума күндөрү боюнча */}
        <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6">
          <h3 className="font-semibold text-lg mb-1">По дням недели</h3>
          <p className="text-gray-500 text-xs mb-6">Средние показатели</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="orders" fill="#e63946" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Популярдуу тамактар */}
      <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-white/10">
          <h3 className="font-semibold text-lg">Популярные блюда</h3>
          <p className="text-gray-500 text-xs mt-0.5">Рейтинг по количеству заказов</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                <th className="text-left px-4 lg:px-6 py-3 font-medium w-8">#</th>
                <th className="text-left px-4 py-3 font-medium">Блюдо</th>
                <th className="text-left px-4 py-3 font-medium">Заказов</th>
                <th className="text-left px-4 py-3 font-medium">Выручка</th>
                <th className="text-left px-4 py-3 font-medium">Тренд</th>
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Прогресс</th>
              </tr>
            </thead>
            <tbody>
              {popularItems.map((item, idx) => {
                const maxOrders = popularItems[0].orders;
                const barWidth = (item.orders / maxOrders) * 100;
                return (
                  <tr key={item.name} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 lg:px-6 py-3">
                      <span className={`text-sm font-bold ${idx < 3 ? "text-accent" : "text-gray-500"}`}>{idx + 1}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{item.orders}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.revenue.toLocaleString("ru-RU")} ₽</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${item.trend >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {item.trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(item.trend)}%
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div className="bg-accent rounded-full h-2 transition-all" style={{ width: `${barWidth}%` }} />
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
