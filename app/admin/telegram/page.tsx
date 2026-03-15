"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Bot,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  ShoppingBag,
  Users,
  XCircle,
  Zap,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

interface TelegramSettings {
  bot_token: string;
  chat_id: string;
  enabled: boolean;
  notify_new_order: boolean;
  notify_cancel_order: boolean;
  notify_new_customer: boolean;
  notify_daily_report: boolean;
}

const defaultSettings: TelegramSettings = {
  bot_token: "",
  chat_id: "",
  enabled: false,
  notify_new_order: true,
  notify_cancel_order: true,
  notify_new_customer: false,
  notify_daily_report: true,
};

const API = "https://api.sushivkus.ru/api";
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("admin_token") || "";
  return "";
}

export default function TelegramPage() {
  const [settings, setSettings] = useState<TelegramSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [testError, setTestError] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${API}/telegram-settings`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.bot_token !== undefined) {
          setSettings({
            bot_token: data.bot_token || "",
            chat_id: data.chat_id || "",
            enabled: data.enabled || false,
            notify_new_order: data.notify_new_order !== false,
            notify_cancel_order: data.notify_cancel_order !== false,
            notify_new_customer: data.notify_new_customer || false,
            notify_daily_report: data.notify_daily_report !== false,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/telegram-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleTestMessage = async () => {
    setTestLoading(true);
    setTestError("");
    try {
      const res = await fetch(`${API}/telegram-test`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        setTestSent(true);
        setTimeout(() => setTestSent(false), 3000);
      } else {
        const data = await res.json();
        setTestError(data.error || "Ошибка отправки");
        setTimeout(() => setTestError(""), 3000);
      }
    } catch {
      setTestError("Ошибка сети");
      setTimeout(() => setTestError(""), 3000);
    } finally {
      setTestLoading(false);
    }
  };

  const copyTemplate = () => {
    const template = `🍣 *Новый заказ #1234*\n\n👤 Клиент: Алексей К.\n📱 Тел: +7 925 123-45-67\n📍 Адрес: ул. Ленина 42, кв. 15\n🕐 Время: 14:30\n💳 Оплата: 💵 Наличные\n\n📦 *Состав заказа:*\n1) *Филадельфия* — 2 шт. × 800₽ = *1 600₽*\n2) *Мисо суп* — 1 шт. × 300₽ = *300₽*\n\n💰 *Итого: 1 900₽*`;
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const notifOptions = [
    { key: "notify_new_order" as const, label: "Новый заказ", desc: "Уведомление при каждом новом заказе", icon: ShoppingBag, color: "text-accent" },
    { key: "notify_cancel_order" as const, label: "Отмена заказа", desc: "Когда клиент отменяет заказ", icon: XCircle, color: "text-red-400" },
    { key: "notify_new_customer" as const, label: "Новый клиент", desc: "Когда регистрируется новый клиент", icon: Users, color: "text-blue-400" },
    { key: "notify_daily_report" as const, label: "Ежедневный отчёт", desc: "Итоги дня в 23:00", icon: Zap, color: "text-yellow-400" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Заголовок */}
      <motion.div variants={itemAnim}>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Bot className="w-7 h-7 text-[#29B6F6]" />
          Telegram бот
        </h1>
        <p className="text-gray-500 text-sm mt-1">Настройка уведомлений через Telegram</p>
      </motion.div>

      {/* Статус */}
      <motion.div variants={itemAnim} className={`rounded-2xl p-4 border ${settings.enabled && settings.bot_token ? "bg-green-500/5 border-green-500/20" : "bg-yellow-500/5 border-yellow-500/20"}`}>
        <div className="flex items-center gap-3">
          {settings.enabled && settings.bot_token ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-400">Бот подключён и активен</p>
                <p className="text-xs text-gray-500">Уведомления отправляются в Telegram</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-yellow-400">Бот не настроен</p>
                <p className="text-xs text-gray-500">Заполните настройки ниже для подключения</p>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Настройки бота */}
        <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-lg">Настройки бота</h3>
          </div>

          {/* Включить/выключить */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Включить бота</p>
              <p className="text-xs text-gray-500">Активировать отправку уведомлений</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enabled ? "bg-accent" : "bg-gray-700"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.enabled ? "left-[26px]" : "left-0.5"}`} />
            </button>
          </div>

          {/* Bot Token */}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Bot Token</label>
            <input
              type="password"
              value={settings.bot_token}
              onChange={(e) => setSettings({ ...settings, bot_token: e.target.value })}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
            <p className="text-[11px] text-gray-600 mt-1">@BotFather аркылуу алыңыз</p>
          </div>

          {/* Chat ID */}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Chat ID</label>
            <input
              type="text"
              value={settings.chat_id}
              onChange={(e) => setSettings({ ...settings, chat_id: e.target.value })}
              placeholder="-1001234567890"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
            <p className="text-[11px] text-gray-600 mt-1">Группа же канал ID</p>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                saved ? "bg-green-500 text-white" : "bg-accent hover:bg-accent/90 text-white"
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <><CheckCircle className="w-4 h-4" /> Сохранено</>
              ) : (
                "Сохранить"
              )}
            </button>
            <button
              onClick={handleTestMessage}
              disabled={testLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                testSent ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                testError ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {testSent ? "Отправлено!" : testError ? "Ошибка" : "Тест"}
            </button>
          </div>
        </motion.div>

        {/* Уведомления */}
        <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-lg">Типы уведомлений</h3>
          </div>

          {notifOptions.map((opt) => (
            <div key={opt.key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <opt.icon className={`w-4 h-4 ${opt.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, [opt.key]: !settings[opt.key] })}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings[opt.key] ? "bg-accent" : "bg-gray-700"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings[opt.key] ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Шаблон */}
      <motion.div variants={itemAnim} className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Пример уведомления</h3>
            <p className="text-gray-500 text-xs mt-0.5">Так будет выглядеть сообщение в Telegram</p>
          </div>
          <button onClick={copyTemplate} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-sm text-gray-400 transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
        <div className="bg-[#0e1621] rounded-2xl p-5 font-mono text-sm leading-relaxed border border-[#1a2634]">
          <p className="text-white">🍣 <strong>Новый заказ #1234</strong></p>
          <br />
          <p className="text-gray-300">👤 Клиент: Алексей К.</p>
          <p className="text-gray-300">📱 Тел: +7 925 123-45-67</p>
          <p className="text-gray-300">📍 Адрес: ул. Ленина 42, кв. 15</p>
          <p className="text-gray-300">🕐 Время: 14:30</p>
          <p className="text-gray-300">💳 Оплата: 💵 Наличные</p>
          <br />
          <p className="text-gray-300">📦 <strong>Состав заказа:</strong></p>
          <p className="text-gray-400">1) <strong>Филадельфия</strong> — 2 шт. × 800₽ = <strong>1 600₽</strong></p>
          <p className="text-gray-400">2) <strong>Мисо суп</strong> — 1 шт. × 300₽ = <strong>300₽</strong></p>
          <br />
          <p className="text-white">💰 <strong>Итого: 1 900₽</strong></p>
        </div>
      </motion.div>
    </motion.div>
  );
}
