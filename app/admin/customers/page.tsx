"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  Star,
  X,
  ArrowUpDown,
  Crown,
  ChevronDown,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  avgCheck: number;
  lastOrder: string;
  firstOrder: string;
  favoriteItems: string[];
  status: "vip" | "regular" | "new";
}

const customers: Customer[] = [
  {
    id: 1, name: "Алексей Козлов", phone: "+7 925 123-45-67", email: "alexey@mail.ru",
    totalOrders: 47, totalSpent: 142500, avgCheck: 3032, lastOrder: "2026-03-09",
    firstOrder: "2025-06-15", favoriteItems: ["Филадельфия", "Калифорния", "Мисо суп"],
    status: "vip",
  },
  {
    id: 2, name: "Мария Сидорова", phone: "+7 916 234-56-78", email: "maria.s@gmail.com",
    totalOrders: 32, totalSpent: 89600, avgCheck: 2800, lastOrder: "2026-03-09",
    firstOrder: "2025-08-20", favoriteItems: ["Дракон ролл", "Эби темпура"],
    status: "vip",
  },
  {
    id: 3, name: "Дмитрий Петров", phone: "+7 903 345-67-89", email: "dmitry.p@yandex.ru",
    totalOrders: 18, totalSpent: 54200, avgCheck: 3011, lastOrder: "2026-03-09",
    firstOrder: "2025-11-10", favoriteItems: ["Сет Самурай", "Унаги"],
    status: "regular",
  },
  {
    id: 4, name: "Анна Волкова", phone: "+7 926 456-78-90", email: "anna.v@mail.ru",
    totalOrders: 12, totalSpent: 28900, avgCheck: 2408, lastOrder: "2026-03-08",
    firstOrder: "2026-01-05", favoriteItems: ["Филадельфия", "Том Ям"],
    status: "regular",
  },
  {
    id: 5, name: "Иван Морозов", phone: "+7 915 567-89-01", email: "ivan.m@gmail.com",
    totalOrders: 8, totalSpent: 19800, avgCheck: 2475, lastOrder: "2026-03-07",
    firstOrder: "2026-01-20", favoriteItems: ["Спайси лосось"],
    status: "regular",
  },
  {
    id: 6, name: "Елена Романова", phone: "+7 903 111-22-33", email: "elena.r@yandex.ru",
    totalOrders: 3, totalSpent: 7500, avgCheck: 2500, lastOrder: "2026-03-06",
    firstOrder: "2026-02-28", favoriteItems: ["Калифорния"],
    status: "new",
  },
  {
    id: 7, name: "Сергей Тихонов", phone: "+7 916 444-55-66", email: "sergey.t@mail.ru",
    totalOrders: 2, totalSpent: 4200, avgCheck: 2100, lastOrder: "2026-03-05",
    firstOrder: "2026-03-01", favoriteItems: ["Филадельфия"],
    status: "new",
  },
  {
    id: 8, name: "Ольга Кузнецова", phone: "+7 925 777-88-99", email: "olga.k@gmail.com",
    totalOrders: 25, totalSpent: 72000, avgCheck: 2880, lastOrder: "2026-03-04",
    firstOrder: "2025-09-12", favoriteItems: ["Сет Токио", "Гунканы", "Эдамамэ"],
    status: "vip",
  },
  {
    id: 9, name: "Павел Новиков", phone: "+7 903 222-33-44", email: "pavel.n@yandex.ru",
    totalOrders: 6, totalSpent: 15600, avgCheck: 2600, lastOrder: "2026-03-03",
    firstOrder: "2026-02-01", favoriteItems: ["Дракон ролл"],
    status: "regular",
  },
  {
    id: 10, name: "Наталья Белова", phone: "+7 916 555-66-77", email: "natalia.b@mail.ru",
    totalOrders: 1, totalSpent: 3200, avgCheck: 3200, lastOrder: "2026-03-02",
    firstOrder: "2026-03-02", favoriteItems: ["Сет Фудзи"],
    status: "new",
  },
];

const statusConfig = {
  vip: { label: "VIP", class: "bg-amber-500/20 text-amber-400", icon: Crown },
  regular: { label: "Постоянный", class: "bg-blue-500/20 text-blue-400", icon: Star },
  new: { label: "Новый", class: "bg-green-500/20 text-green-400", icon: Users },
};

type SortField = "totalOrders" | "totalSpent" | "lastOrder" | "name";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "vip" | "regular" | "new">("all");
  const [sortBy, setSortBy] = useState<SortField>("totalSpent");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "lastOrder") cmp = a.lastOrder.localeCompare(b.lastOrder);
      else cmp = a[sortBy] - b[sortBy];
      return sortDir === "desc" ? -cmp : cmp;
    });

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(field); setSortDir("desc"); }
  };

  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.status === "vip").length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgCheck = Math.round(totalRevenue / customers.reduce((s, c) => s + c.totalOrders, 0));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Заголовок */}
      <motion.div variants={itemAnim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Клиенты
            <span className="text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">{totalCustomers}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">База клиентов и история заказов</p>
        </div>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Всего клиентов", value: totalCustomers, icon: Users, color: "bg-accent/10 text-accent" },
          { label: "VIP клиенты", value: vipCount, icon: Crown, color: "bg-amber-500/10 text-amber-400" },
          { label: "Общая выручка", value: `${(totalRevenue / 1000).toFixed(0)}к ₽`, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-400" },
          { label: "Средний чек", value: `${avgCheck.toLocaleString("ru-RU")} ₽`, icon: ShoppingBag, color: "bg-blue-500/10 text-blue-400" },
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

      {/* Поиск + фильтр */}
      <motion.div variants={itemAnim} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, телефону, email..."
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-[#111] border border-white/10 rounded-xl p-1">
          {(["all", "vip", "regular", "new"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s ? "bg-accent text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {s === "all" ? "Все" : statusConfig[s].label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Таблица */}
      <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Клиент</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("totalOrders")}>
                  <span className="flex items-center gap-1">Заказы <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("totalSpent")}>
                  <span className="flex items-center gap-1">Потрачено <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-4 py-3 font-medium">Ср. чек</th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("lastOrder")}>
                  <span className="flex items-center gap-1">Последний <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-4 lg:px-6 py-3 font-medium">Связь</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const st = statusConfig[customer.status];
                const phoneClean = customer.phone.replace(/\D/g, "");
                return (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-4 lg:px-6 py-3">
                      <p className="text-sm font-medium">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${st.class}`}>
                        <st.icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">{customer.totalOrders}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{customer.totalSpent.toLocaleString("ru-RU")} ₽</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{customer.avgCheck.toLocaleString("ru-RU")} ₽</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(customer.lastOrder).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a href={`tel:+${phoneClean}`} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                          <Phone className="w-4 h-4" />
                        </a>
                        <a href={`https://wa.me/${phoneClean}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-green-500/10 text-gray-400 hover:text-green-400 transition-colors">
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

      {/* Клиент деталдары модалкасы */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="fixed inset-0 bg-black/60 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-[#111] border border-white/10 rounded-2xl z-50 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="font-semibold text-lg">Карточка клиента</h3>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Имя и статус */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl font-bold">
                    {selectedCustomer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedCustomer.name}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[selectedCustomer.status].class}`}>
                      {statusConfig[selectedCustomer.status].label}
                    </span>
                  </div>
                </div>

                {/* Контакты */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-gray-500 text-[11px] mb-1">Телефон</p>
                    <p className="text-sm font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-gray-500 text-[11px] mb-1">Email</p>
                    <p className="text-sm font-medium truncate">{selectedCustomer.email}</p>
                  </div>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-accent">{selectedCustomer.totalOrders}</p>
                    <p className="text-gray-500 text-[11px]">Заказов</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{(selectedCustomer.totalSpent / 1000).toFixed(1)}к</p>
                    <p className="text-gray-500 text-[11px]">Потрачено ₽</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{selectedCustomer.avgCheck.toLocaleString("ru-RU")}</p>
                    <p className="text-gray-500 text-[11px]">Ср. чек ₽</p>
                  </div>
                </div>

                {/* Даты */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-gray-500 text-[11px] mb-1">Первый заказ</p>
                    <p className="text-sm">{new Date(selectedCustomer.firstOrder).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-gray-500 text-[11px] mb-1">Последний заказ</p>
                    <p className="text-sm">{new Date(selectedCustomer.lastOrder).toLocaleDateString("ru-RU")}</p>
                  </div>
                </div>

                {/* Любимые блюда */}
                <div>
                  <p className="text-gray-500 text-xs mb-2">Любимые блюда</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.favoriteItems.map((item) => (
                      <span key={item} className="bg-white/5 text-sm px-3 py-1 rounded-full">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
