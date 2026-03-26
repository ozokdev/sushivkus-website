"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Save,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Send,
  Instagram,
  Globe,
  Store,
  CreditCard,
  CheckCircle,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Layout,
  HelpCircle,
  Truck,
} from "lucide-react";

interface PaymentMethod {
  ID: number;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  sort_order: number;
}

interface SiteSettings {
  siteName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  addressLink: string;
  workStart: string;
  workEnd: string;
  workDays: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  minOrderAmount: number;
  freeDeliveryFrom: number;
  deliveryPrice: number;
}

const initialSettings: SiteSettings = {
  siteName: "Суши Вкус",
  description: "Свежие роллы. Быстрая доставка.",
  phone: "8 (925) 537-28-25",
  email: "admin@sushivkus.ru",
  address: "ул. Шоссейная, 42, г. Люберцы",
  addressLink: "https://yandex.ru/maps/-/CDaZjT",
  workStart: "10:00",
  workEnd: "23:00",
  workDays: "Ежедневно",
  whatsapp: "79255372825",
  telegram: "kelechek_sushi",
  instagram: "sushivkus_lybertsy",
  minOrderAmount: 500,
  freeDeliveryFrom: 2000,
  deliveryPrice: 200,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [sections, setSections] = useState<Record<string, boolean>>({
    show_instagram: true,
    show_faq: true,
    show_delivery_choice: true,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token") || "";
    }
    return "";
  }, []);

  useEffect(() => {
    fetch("https://api.sushivkus.ru/api/payment-methods")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPaymentMethods(data);
      })
      .catch(() => {});

    fetch("https://api.sushivkus.ru/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSections({
            show_instagram: data.show_instagram !== "false",
            show_faq: data.show_faq !== "false",
            show_delivery_choice: data.show_delivery_choice !== "false",
          });
          if (data.min_order_amount) {
            setSettings((prev) => ({ ...prev, minOrderAmount: parseInt(data.min_order_amount, 10) || 500 }));
          }
          if (data.free_delivery_from) {
            setSettings((prev) => ({ ...prev, freeDeliveryFrom: parseInt(data.free_delivery_from, 10) || 2000 }));
          }
          if (data.delivery_price) {
            setSettings((prev) => ({ ...prev, deliveryPrice: parseInt(data.delivery_price, 10) || 200 }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const update = (key: keyof SiteSettings, value: string | number | boolean) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const toggleSection = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const togglePayment = (key: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.key === key ? { ...m, enabled: !m.enabled } : m))
    );
    setSaved(false);
  };

  const movePayment = (index: number, direction: "up" | "down") => {
    const newMethods = [...paymentMethods];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newMethods.length) return;
    [newMethods[index], newMethods[swapIndex]] = [newMethods[swapIndex], newMethods[index]];
    newMethods.forEach((m, i) => (m.sort_order = i));
    setPaymentMethods(newMethods);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch("https://api.sushivkus.ru/api/payment-methods", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(
            paymentMethods.map((m, i) => ({
              key: m.key,
              name: m.name,
              description: m.description,
              enabled: m.enabled,
              sort_order: i,
            }))
          ),
        }),
        fetch("https://api.sushivkus.ru/api/site-settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            show_instagram: sections.show_instagram ? "true" : "false",
            show_faq: sections.show_faq ? "true" : "false",
            show_delivery_choice: sections.show_delivery_choice ? "true" : "false",
            min_order_amount: String(settings.minOrderAmount),
            free_delivery_from: String(settings.freeDeliveryFrom),
            delivery_price: String(settings.deliveryPrice),
          }),
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // error
    }
    setSaving(false);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl"
    >
      {/* Заголовок */}
      <motion.div
        variants={item}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Настройки</h1>
          <p className="text-gray-500 text-sm mt-1">
            Основные параметры сайта
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? "bg-green-500/20 text-green-400"
              : "bg-accent hover:bg-accent/90 text-white"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Сохранено
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Сохранить
            </>
          )}
        </button>
      </motion.div>

      {/* Основная информация */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-accent" />
          </div>
          <h2 className="font-semibold text-lg">Основная информация</h2>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Название сайта
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => update("siteName", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Описание
            </label>
            <input
              type="text"
              value={settings.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Контакты */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="font-semibold text-lg">Контакты</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Телефон
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Адрес
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={settings.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Ссылка на карту
            </label>
            <input
              type="text"
              value={settings.addressLink}
              onChange={(e) => update("addressLink", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Время работы */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <h2 className="font-semibold text-lg">Время работы</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Начало работы
            </label>
            <input
              type="time"
              value={settings.workStart}
              onChange={(e) => update("workStart", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Конец работы
            </label>
            <input
              type="time"
              value={settings.workEnd}
              onChange={(e) => update("workEnd", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Дни работы
            </label>
            <input
              type="text"
              value={settings.workDays}
              onChange={(e) => update("workDays", e.target.value)}
              placeholder="Ежедневно"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Социальные сети */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="font-semibold text-lg">Социальные сети</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp (номер)
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="79251234567"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Telegram (username)
            </label>
            <input
              type="text"
              value={settings.telegram}
              onChange={(e) => update("telegram", e.target.value)}
              placeholder="username"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5" />
              Instagram (username)
            </label>
            <input
              type="text"
              value={settings.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              placeholder="username"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Секции сайта */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Layout className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Секции сайта</h2>
            <p className="text-xs text-gray-500 mt-0.5">Показать или скрыть блоки на главной странице</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-sm font-medium">Instagram галерея</p>
                <p className="text-xs text-gray-500 mt-0.5">Блок с фото блюд и ссылкой на Instagram</p>
              </div>
            </div>
            <button
              onClick={() => toggleSection("show_instagram")}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                sections.show_instagram ? "bg-accent" : "bg-gray-700"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  sections.show_instagram ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Вопросы и ответы (FAQ)</p>
                <p className="text-xs text-gray-500 mt-0.5">Блок с частыми вопросами клиентов</p>
              </div>
            </div>
            <button
              onClick={() => toggleSection("show_faq")}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                sections.show_faq ? "bg-accent" : "bg-gray-700"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  sections.show_faq ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium">Модал Доставка / Самовывоз</p>
                <p className="text-xs text-gray-500 mt-0.5">Модальное окно выбора способа получения при входе на сайт</p>
              </div>
            </div>
            <button
              onClick={() => toggleSection("show_delivery_choice")}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                sections.show_delivery_choice ? "bg-accent" : "bg-gray-700"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  sections.show_delivery_choice ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Доставка и заказы */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-orange-400" />
          </div>
          <h2 className="font-semibold text-lg">Доставка и заказы</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Мин. сумма заказа (₽)
            </label>
            <input
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => update("minOrderAmount", parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Бесплатная доставка от (₽)
            </label>
            <input
              type="number"
              value={settings.freeDeliveryFrom}
              onChange={(e) => update("freeDeliveryFrom", parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Стоимость доставки (₽)
            </label>
            <input
              type="number"
              value={settings.deliveryPrice}
              onChange={(e) => update("deliveryPrice", parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Оплата */}
      <motion.div
        variants={item}
        className="bg-[#111] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="font-semibold text-lg">Способы оплаты</h2>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method, index) => (
            <div
              key={method.key}
              className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => movePayment(index, "up")}
                    disabled={index === 0}
                    className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => movePayment(index, "down")}
                    disabled={index === paymentMethods.length - 1}
                    className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <GripVertical className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">{method.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                </div>
              </div>
              <button
                onClick={() => togglePayment(method.key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  method.enabled ? "bg-accent" : "bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    method.enabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Нижняя кнопка сохранения */}
      <motion.div variants={item} className="pb-6">
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
            saved
              ? "bg-green-500/20 text-green-400"
              : "bg-accent hover:bg-accent/90 text-white"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Изменения сохранены
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Сохранить изменения
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
