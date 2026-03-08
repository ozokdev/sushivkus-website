"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  MessageCircle,
  PackageX,
  X,
  MapPin,
  Clock,
  User,
  ShoppingBag,
  Printer,
} from "lucide-react";

type OrderStatus = "new" | "preparing" | "delivered" | "cancelled";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  items: string;
  itemsList: OrderItem[];
  total: number;
  status: OrderStatus;
  time: string;
  date: string;
  comment?: string;
  delivery: number;
  payment: string;
}

// TODO: Go API менен алмаштыруу
const initialOrders: Order[] = [
  {
    id: 1001, name: "Алексей К.", phone: "+7 925 123-45-67",
    address: "ул. Люберецкая, 15, кв. 23",
    items: "Филадельфия Классик x2, Том Ям x1",
    itemsList: [
      { name: "Филадельфия Классик", qty: 2, price: 450 },
      { name: "Том Ям с креветками", qty: 1, price: 490 },
    ],
    total: 2990, status: "delivered", time: "10:30", date: "09.03.2026",
    comment: "Без васаби, домофон 23", delivery: 150, payment: "Картой онлайн",
  },
  {
    id: 1002, name: "Мария С.", phone: "+7 916 234-56-78",
    address: "ул. Шоссейная, 8, кв. 45",
    items: "Сет Мечта x1, Поке лосось x1",
    itemsList: [
      { name: "Сет Мечта (40 шт.)", qty: 1, price: 2690 },
      { name: "Поке с лососем", qty: 1, price: 450 },
    ],
    total: 3140, status: "preparing", time: "11:15", date: "09.03.2026",
    delivery: 0, payment: "Наличными",
  },
  {
    id: 1003, name: "Дмитрий П.", phone: "+7 903 345-67-89",
    address: "пр. Октября, 22, кв. 5",
    items: "Сет Корпоратив x1",
    itemsList: [{ name: "Сет Корпоратив (64 шт.)", qty: 1, price: 3990 }],
    total: 3990, status: "new", time: "11:45", date: "09.03.2026",
    comment: "Позвонить за 10 мин до доставки", delivery: 0, payment: "Картой курьеру",
  },
  {
    id: 1004, name: "Анна В.", phone: "+7 926 456-78-90",
    address: "ул. Красная, 3, кв. 12",
    items: "Калифорния Темпура x2, Мисо суп x1",
    itemsList: [
      { name: "Калифорния Темпура", qty: 2, price: 420 },
      { name: "Мисо суп", qty: 1, price: 220 },
    ],
    total: 1210, status: "new", time: "12:00", date: "09.03.2026",
    delivery: 150, payment: "Наличными",
  },
  {
    id: 1005, name: "Иван М.", phone: "+7 915 567-89-01",
    address: "ул. Зелёная, 7, кв. 34",
    items: "Манчестер x1, Поке тунец x1",
    itemsList: [
      { name: "Манчестер", qty: 1, price: 490 },
      { name: "Поке с тунцом", qty: 1, price: 450 },
    ],
    total: 2490, status: "cancelled", time: "09:00", date: "09.03.2026",
    delivery: 150, payment: "Картой онлайн",
  },
  {
    id: 1006, name: "Елена Р.", phone: "+7 917 678-90-12",
    address: "ул. Советская, 11, кв. 67",
    items: "Сет Романтика x1",
    itemsList: [{ name: "Сет Романтика (32 шт.)", qty: 1, price: 1890 }],
    total: 1890, status: "delivered", time: "09:30", date: "09.03.2026",
    delivery: 0, payment: "Картой онлайн",
  },
  {
    id: 1007, name: "Сергей Т.", phone: "+7 918 789-01-23",
    address: "пр. Мира, 45, кв. 2",
    items: "Пепперони x2",
    itemsList: [{ name: "Пепперони", qty: 2, price: 520 }],
    total: 1040, status: "preparing", time: "12:30", date: "09.03.2026",
    delivery: 150, payment: "Наличными",
  },
  {
    id: 1008, name: "Ольга Н.", phone: "+7 919 890-12-34",
    address: "ул. Ленина, 19, кв. 88",
    items: "Сет All Inclusive x1",
    itemsList: [{ name: "Сет All Inclusive (48 шт.)", qty: 1, price: 2990 }],
    total: 2990, status: "new", time: "13:00", date: "09.03.2026",
    comment: "2 пары палочек", delivery: 0, payment: "Картой онлайн",
  },
];

const statusConfig: Record<OrderStatus, { label: string; class: string }> = {
  new: { label: "Новый", class: "bg-blue-500/20 text-blue-400" },
  preparing: { label: "Готовится", class: "bg-yellow-500/20 text-yellow-400" },
  delivered: { label: "Доставлен", class: "bg-green-500/20 text-green-400" },
  cancelled: { label: "Отменён", class: "bg-red-500/20 text-red-400" },
};

const filterTabs: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "preparing", label: "Готовится" },
  { value: "delivered", label: "Доставлен" },
  { value: "cancelled", label: "Отменён" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter = filter === "all" || o.status === filter;
      const matchSearch =
        !search ||
        o.id.toString().includes(search) ||
        o.name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [orders, search, filter]);

  const getCounts = (status: OrderStatus | "all") => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const handleStatusChange = (id: number, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handlePrint = () => {
    if (!selectedOrder) return;
    const printWindow = window.open("", "_blank", "width=380,height=600");
    if (!printWindow) return;

    const itemsRows = selectedOrder.itemsList
      .map(
        (it) =>
          `<tr><td style="padding:2px 0">${it.name}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${it.price * it.qty} ₽</td></tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
      <head><title>Чек #${selectedOrder.id}</title>
      <style>
        body { font-family: monospace; font-size: 13px; padding: 10px; max-width: 350px; margin: 0 auto; }
        h2 { text-align: center; margin: 0 0 5px; font-size: 16px; }
        .center { text-align: center; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 3px 0; }
        .total { font-weight: bold; font-size: 15px; }
        .comment { font-style: italic; font-size: 12px; }
        @media print { body { margin: 0; } }
      </style>
      </head>
      <body>
        <h2>СУШИ ВКУС</h2>
        <p class="center" style="margin:0;font-size:11px">ул. Шоссейная, 42, г. Люберцы<br>тел: 8 (925) 320-61-90</p>
        <hr>
        <p><strong>Заказ #${selectedOrder.id}</strong> от ${selectedOrder.date} ${selectedOrder.time}</p>
        <p>${selectedOrder.name}<br>${selectedOrder.phone}</p>
        <p>${selectedOrder.address}</p>
        ${selectedOrder.comment ? `<p class="comment">💬 ${selectedOrder.comment}</p>` : ""}
        <hr>
        <table>
          <tr style="font-weight:bold;border-bottom:1px solid #000"><td>Позиция</td><td style="text-align:center">Кол</td><td style="text-align:right">Сумма</td></tr>
          ${itemsRows}
        </table>
        <hr>
        ${selectedOrder.delivery > 0 ? `<p>Доставка: ${selectedOrder.delivery} ₽</p>` : "<p>Доставка: бесплатно</p>"}
        <p class="total">ИТОГО: ${selectedOrder.total.toLocaleString("ru-RU")} ₽</p>
        <p>Оплата: ${selectedOrder.payment}</p>
        <hr>
        <p class="center" style="font-size:11px">Спасибо за заказ!<br>sushivkus.ru</p>
        <script>window.print();window.close();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Заголовок + поиск */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Заказы</h1>
          <span className="bg-accent/10 text-accent text-sm font-medium px-2.5 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Поиск по номеру или имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 transition-colors w-full"
          />
        </div>
      </div>

      {/* Фильтр */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {filterTabs.map((tab) => {
          const count = getCounts(tab.value);
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                active
                  ? "bg-accent text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {tab.label}
              <span className={`text-xs ${active ? "text-white/70" : "text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Таблица */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
          <PackageX className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-lg font-medium">Заказов нет</p>
          <p className="text-gray-600 text-sm mt-1">Нет заказов по выбранному фильтру</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                  <th className="text-left px-4 lg:px-6 py-3 font-medium">№</th>
                  <th className="text-left px-4 py-3 font-medium">Клиент</th>
                  <th className="text-left px-4 py-3 font-medium">Телефон</th>
                  <th className="text-left px-4 py-3 font-medium">Адрес</th>
                  <th className="text-left px-4 py-3 font-medium">Заказ</th>
                  <th className="text-left px-4 py-3 font-medium">Сумма</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 font-medium">Время</th>
                  <th className="text-left px-4 lg:px-6 py-3 font-medium">Связь</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const phoneClean = order.phone.replace(/\D/g, "");
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="px-4 lg:px-6 py-3 text-sm font-medium text-gray-300">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{order.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{order.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-[160px] truncate">
                        {order.address}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-[200px] truncate">
                        {order.items}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
                        {order.total.toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent/50 ${status.class}`}
                          style={{ backgroundColor: "transparent" }}
                        >
                          <option value="new" className="bg-[#1a1a1a] text-white">Новый</option>
                          <option value="preparing" className="bg-[#1a1a1a] text-white">Готовится</option>
                          <option value="delivered" className="bg-[#1a1a1a] text-white">Доставлен</option>
                          <option value="cancelled" className="bg-[#1a1a1a] text-white">Отменён</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                        {order.time}
                      </td>
                      <td className="px-4 lg:px-6 py-3">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`tel:+${phoneClean}`}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://wa.me/${phoneClean}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-green-500/10 text-gray-400 hover:text-green-400 transition-colors"
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
        </div>
      )}

      {/* Заказ Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div>
                    <h3 className="font-semibold text-lg">Заказ #{selectedOrder.id}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {selectedOrder.date} в {selectedOrder.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                      title="Печать чека"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Контент */}
                <div className="px-6 py-5 space-y-5" ref={printRef}>
                  {/* Статус */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Статус</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                      }
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium border-0 cursor-pointer focus:outline-none ${statusConfig[selectedOrder.status].class}`}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <option value="new" className="bg-[#1a1a1a] text-white">Новый</option>
                      <option value="preparing" className="bg-[#1a1a1a] text-white">Готовится</option>
                      <option value="delivered" className="bg-[#1a1a1a] text-white">Доставлен</option>
                      <option value="cancelled" className="bg-[#1a1a1a] text-white">Отменён</option>
                    </select>
                  </div>

                  {/* Клиент */}
                  <div className="bg-white/[0.03] rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedOrder.name}</p>
                        <a href={`tel:${selectedOrder.phone}`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                          {selectedOrder.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{selectedOrder.address}</span>
                    </div>
                    {selectedOrder.comment && (
                      <div className="flex items-start gap-2 text-sm">
                        <MessageCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-yellow-400/80">{selectedOrder.comment}</span>
                      </div>
                    )}
                  </div>

                  {/* Позиции */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Состав заказа
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.itemsList.map((it, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">
                            {it.name} <span className="text-gray-500">x{it.qty}</span>
                          </span>
                          <span className="font-medium">{(it.price * it.qty).toLocaleString("ru-RU")} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Итого */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Доставка</span>
                      <span>{selectedOrder.delivery > 0 ? `${selectedOrder.delivery} ₽` : "Бесплатно"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Оплата</span>
                      <span>{selectedOrder.payment}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-1">
                      <span>Итого</span>
                      <span className="text-accent">{selectedOrder.total.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>
                </div>

                {/* Действия */}
                <div className="flex gap-3 px-6 py-4 border-t border-white/10">
                  <a
                    href={`tel:+${selectedOrder.phone.replace(/\D/g, "")}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Позвонить
                  </a>
                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600/10 hover:bg-green-600/20 text-green-400 text-sm font-medium transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
