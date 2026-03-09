"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Check,
  Trash2,
  BellOff,
  Filter,
} from "lucide-react";

type NotifType = "order" | "alert" | "success" | "info";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "order", title: "Новый заказ #1012", message: "Виктор С. — Сет Самурай, Филадельфия x2. Сумма: 5 200 ₽", time: "2 мин назад", date: "2026-03-09", read: false },
  { id: 2, type: "order", title: "Новый заказ #1011", message: "Артём Д. — Калифорния x3, Мисо суп. Сумма: 1 450 ₽", time: "15 мин назад", date: "2026-03-09", read: false },
  { id: 3, type: "alert", title: "Заказ #1005 отменён", message: "Клиент Иван М. отменил заказ на 2 490 ₽. Причина: долгая доставка", time: "1 час назад", date: "2026-03-09", read: false },
  { id: 4, type: "success", title: "Заказ #1001 доставлен", message: "Курьер доставил заказ Алексею К. Время доставки: 35 мин", time: "2 часа назад", date: "2026-03-09", read: true },
  { id: 5, type: "info", title: "Промокод VKUS20 популярен", message: "За последние 24 часа промокод использован 12 раз", time: "3 часа назад", date: "2026-03-09", read: true },
  { id: 6, type: "order", title: "Новый заказ #1010", message: "Наталья Б. — Сет Фудзи. Сумма: 3 700 ₽", time: "5 часов назад", date: "2026-03-09", read: true },
  { id: 7, type: "alert", title: "Мало остатков: Лосось", message: "Осталось менее 2 кг лосося. Рекомендуется заказать у поставщика", time: "6 часов назад", date: "2026-03-09", read: true },
  { id: 8, type: "success", title: "Заказ #1008 доставлен", message: "Курьер доставил заказ Ольге К. Оценка: 5 звёзд", time: "Вчера, 15:30", date: "2026-03-08", read: true },
  { id: 9, type: "info", title: "Новый клиент зарегистрирован", message: "Сергей Тихонов стал новым клиентом. Первый заказ на 2 100 ₽", time: "Вчера, 12:00", date: "2026-03-08", read: true },
  { id: 10, type: "order", title: "Новый заказ #1009", message: "Павел Н. — Дракон ролл x2, Эдамамэ. Сумма: 2 100 ₽", time: "Вчера, 12:15", date: "2026-03-08", read: true },
  { id: 11, type: "alert", title: "Пик нагрузки", message: "Получено 8 заказов за последний час. Рекомендуется добавить курьера", time: "2 дня назад", date: "2026-03-07", read: true },
  { id: 12, type: "success", title: "Цель выполнена!", message: "Достигнут рекорд: 35 заказов за субботу!", time: "3 дня назад", date: "2026-03-06", read: true },
];

const typeConfig: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  order: { icon: ShoppingBag, color: "text-accent", bg: "bg-accent/10" },
  alert: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  success: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filterType, setFilterType] = useState<"all" | NotifType>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = filterType === "all" ? notifications : notifications.filter((n) => n.type === filterType);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Заголовок */}
      <motion.div variants={itemAnim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Уведомления
            {unreadCount > 0 && (
              <span className="text-sm font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">{unreadCount} новых</span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Все события и оповещения</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm transition-colors">
              <Check className="w-4 h-4" /> Прочитать все
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 px-4 py-2.5 rounded-xl text-sm text-gray-400 transition-colors">
              <Trash2 className="w-4 h-4" /> Очистить
            </button>
          )}
        </div>
      </motion.div>

      {/* Фильтр */}
      <motion.div variants={itemAnim} className="flex gap-1 bg-[#111] border border-white/10 rounded-xl p-1 w-fit">
        {([["all", "Все"], ["order", "Заказы"], ["alert", "Важные"], ["success", "Успех"], ["info", "Инфо"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key as any)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filterType === key ? "bg-accent text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Список */}
      {filtered.length === 0 ? (
        <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
          <BellOff className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">Нет уведомлений</p>
          <p className="text-gray-600 text-sm mt-1">Все уведомления будут отображаться здесь</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const config = typeConfig[notif.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={notif.id}
                variants={itemAnim}
                className={`bg-[#111] border rounded-2xl p-4 transition-all ${
                  notif.read ? "border-white/5 opacity-70" : "border-white/10 border-l-2 border-l-accent"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-semibold ${!notif.read ? "text-white" : "text-gray-300"}`}>{notif.title}</p>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-600 mt-2">{notif.time}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notif.read && (
                      <button onClick={() => markRead(notif.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors" title="Прочитано">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotif(notif.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors" title="Удалить">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
