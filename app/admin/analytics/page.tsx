"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock,
  ShoppingBag,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Calendar,
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

interface HourStat { hour: string; orders: number }
interface WeekdayStat { day: string; orders: number; revenue: number }
interface PopularItem { name: string; orders: number; revenue: number }
interface CategoryStat { name: string; value: number; revenue: number }

interface Analytics {
  total_orders: number;
  total_revenue: number;
  avg_check: number;
  orders_today: number;
  revenue_today: number;
  hourly: HourStat[];
  weekday: WeekdayStat[];
  popular: PopularItem[];
  categories: CategoryStat[];
  period_days: number;
}

const palette = ["#e63946", "#457b9d", "#2a9d8f", "#e9c46a", "#f4a261", "#9b5de5"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#e63946" }} className="font-medium">
          {p.dataKey === "revenue"
            ? `${Number(p.value).toLocaleString("ru-RU")} ₽`
            : `${p.value} заказов`}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState("");

  const fetchData = async (d: number) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`https://api.sushivkus.ru/api/analytics/summary?days=${d}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError(`Ошибка загрузки (${res.status})`);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(days);
  }, [days]);

  const peakHour = data?.hourly.reduce(
    (max, h) => (h.orders > max.orders ? h : max),
    data.hourly[0] || { hour: "—", orders: 0 }
  );
  const bestDay = data?.weekday.reduce(
    (max, d) => (d.orders > max.orders ? d : max),
    data.weekday[0] || { day: "—", orders: 0, revenue: 0 }
  );

  const totalCatValue = data?.categories.reduce((s, c) => s + c.value, 0) || 1;
  const categoriesPct = data?.categories.map((c, i) => ({
    ...c,
    pct: Math.round((c.value / totalCatValue) * 100),
    color: palette[i % palette.length],
  })) || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Заголовок + выбор периода */}
      <motion.div variants={itemAnim} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data ? `За последние ${data.period_days} дн. · ${data.total_orders} заказов` : "Загрузка..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  days === d ? "bg-accent text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {d} дн.
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchData(days)}
            disabled={loading}
            className="p-2 bg-[#111] border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!data && !error ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-4 h-28 animate-pulse" />
          ))}
        </div>
      ) : data && (
        <>
          {/* Жалпы статистика */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Средний чек",
                value: `${Math.round(data.avg_check).toLocaleString("ru-RU")} ₽`,
                sub: `Выручка: ${Math.round(data.total_revenue).toLocaleString("ru-RU")} ₽`,
                icon: ShoppingBag,
                color: "bg-accent/10 text-accent",
              },
              {
                label: "Пик заказов",
                value: peakHour?.hour || "—",
                sub: `${peakHour?.orders || 0} заказов`,
                icon: Clock,
                color: "bg-yellow-500/10 text-yellow-400",
              },
              {
                label: "Лучший день",
                value: bestDay?.day || "—",
                sub: `${bestDay?.orders || 0} заказов`,
                icon: Star,
                color: "bg-emerald-500/10 text-emerald-400",
              },
              {
                label: "Сегодня",
                value: `${data.orders_today} зак.`,
                sub: `${Math.round(data.revenue_today).toLocaleString("ru-RU")} ₽`,
                icon: Calendar,
                color: "bg-blue-500/10 text-blue-400",
              },
            ].map((stat) => (
              <motion.div key={stat.label} variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                <p className="text-gray-600 text-[11px]">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          {data.total_orders === 0 ? (
            <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Пока нет данных</h3>
              <p className="text-gray-500 text-sm">Аналитика появится после первых заказов</p>
            </motion.div>
          ) : (
            <>
              {/* Саат боюнча */}
              <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6">
                <h3 className="font-semibold text-lg mb-1">Заказы по времени суток</h3>
                <p className="text-gray-500 text-xs mb-6">Когда больше всего заказов</p>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.hourly}>
                      <defs>
                        <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="hour" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="orders" stroke="#e63946" strokeWidth={2} fill="url(#hourGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Категориялар */}
                <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-lg mb-1">Категории</h3>
                  <p className="text-gray-500 text-xs mb-6">Распределение заказов</p>
                  {categoriesPct.length === 0 ? (
                    <p className="text-gray-500 text-sm py-12 text-center">Нет данных</p>
                  ) : (
                    <div className="h-[250px] flex items-center">
                      <ResponsiveContainer width="50%" height="100%">
                        <PieChart>
                          <Pie data={categoriesPct} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                            {categoriesPct.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-3 flex-1">
                        {categoriesPct.map((cat) => (
                          <div key={cat.name} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                            <span className="text-sm text-gray-300 truncate">{cat.name}</span>
                            <span className="text-sm font-semibold ml-auto">{cat.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Жума күндөрү */}
                <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-lg mb-1">По дням недели</h3>
                  <p className="text-gray-500 text-xs mb-6">Сумма заказов за период</p>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.weekday} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                        <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
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
                  <p className="text-gray-500 text-xs mt-0.5">Топ-10 по количеству заказов</p>
                </div>
                {data.popular.length === 0 ? (
                  <p className="text-gray-500 text-sm py-12 text-center">Нет данных</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                          <th className="text-left px-4 lg:px-6 py-3 font-medium w-8">#</th>
                          <th className="text-left px-4 py-3 font-medium">Блюдо</th>
                          <th className="text-left px-4 py-3 font-medium">Заказов</th>
                          <th className="text-left px-4 py-3 font-medium">Выручка</th>
                          <th className="text-left px-4 lg:px-6 py-3 font-medium">Прогресс</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.popular.map((item, idx) => {
                          const maxOrders = data.popular[0].orders || 1;
                          const barWidth = (item.orders / maxOrders) * 100;
                          return (
                            <tr key={item.name} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="px-4 lg:px-6 py-3">
                                <span className={`text-sm font-bold ${idx < 3 ? "text-accent" : "text-gray-500"}`}>{idx + 1}</span>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                              <td className="px-4 py-3 text-sm font-semibold">{item.orders}</td>
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {Math.round(item.revenue).toLocaleString("ru-RU")} ₽
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
                )}
              </motion.div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
