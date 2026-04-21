"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, X, ShoppingBag, Phone, MapPin } from "lucide-react";

interface Order {
  ID: number;
  customer_name: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

const POLL_INTERVAL = 15_000; // 15 секунд
const STORAGE_KEY = "admin_last_seen_order_id";

export default function NewOrderNotifier() {
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSeenRef = useRef<number>(0);
  const originalTitleRef = useRef<string>("");

  // Ding-dong тонун ойнотуу (Web Audio API — файлсыз)
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const notes = [
        { freq: 880, start: 0, dur: 0.2 },   // высокая
        { freq: 660, start: 0.22, dur: 0.25 }, // ниже
        { freq: 880, start: 0.5, dur: 0.2 },   // кайра высокая
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime + start;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.start(now);
        osc.stop(now + dur);
      });
    } catch (e) {
      console.warn("Audio failed:", e);
    }
  }, [soundEnabled]);

  // Browser notification
  const showBrowserNotification = useCallback((order: Order) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const n = new Notification(`🔔 Жаңы заказ #${order.ID}`, {
      body: `${order.customer_name} — ${Math.round(order.total).toLocaleString("ru-RU")} ₽\n📞 ${order.phone}`,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: `order-${order.ID}`,
      requireInteraction: true,
    });
    n.onclick = () => {
      window.focus();
      window.location.href = "/admin/orders";
      n.close();
    };
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  // Polling
  const checkNewOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await fetch("https://api.sushivkus.ru/api/orders?limit=20", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = await res.json();
      const orders: Order[] = data.orders || [];

      // Эң акыркы заказ ID'си
      const maxId = Math.max(...orders.map((o) => o.ID), 0);

      // Биринчи жолу — ошол ID'ди эске сактайбыз, notification жок
      if (lastSeenRef.current === 0) {
        const saved = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
        lastSeenRef.current = saved || maxId;
        localStorage.setItem(STORAGE_KEY, String(maxId));
        return;
      }

      // Жаңы заказдарды табуу
      const fresh = orders.filter(
        (o) => o.ID > lastSeenRef.current && !dismissed.has(o.ID)
      );

      if (fresh.length > 0) {
        playBeep();
        fresh.forEach((o) => showBrowserNotification(o));
        setNewOrders((prev) => {
          const existing = new Set(prev.map((p) => p.ID));
          const toAdd = fresh.filter((f) => !existing.has(f.ID));
          return [...toAdd, ...prev].slice(0, 5);
        });

        // Tabдын title'ына badge
        if (typeof document !== "undefined") {
          document.title = `(${fresh.length}) ${originalTitleRef.current}`;
        }

        lastSeenRef.current = maxId;
        localStorage.setItem(STORAGE_KEY, String(maxId));
      }
    } catch {
      // network error — жашыруун
    }
  }, [dismissed, playBeep, showBrowserNotification]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    originalTitleRef.current = document.title.replace(/^\(\d+\)\s*/, "");
    if ("Notification" in window) setPermission(Notification.permission);

    const saved = localStorage.getItem("admin_sound_enabled");
    if (saved !== null) setSoundEnabled(saved === "true");

    // Биринчи polling дароо
    checkNewOrders();
    const interval = setInterval(checkNewOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkNewOrders]);

  const dismiss = (id: number) => {
    setDismissed((prev) => new Set(prev).add(id));
    setNewOrders((prev) => prev.filter((o) => o.ID !== id));
    if (newOrders.length <= 1) {
      document.title = originalTitleRef.current;
    }
  };

  const toggleSound = () => {
    const v = !soundEnabled;
    setSoundEnabled(v);
    localStorage.setItem("admin_sound_enabled", String(v));
    if (v) playBeep(); // тест
  };

  return (
    <>
      {/* Баскычтар: звук + permission */}
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2">
        {permission !== "granted" && permission !== "denied" && (
          <button
            onClick={requestPermission}
            className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-xl shadow-lg text-xs font-medium hover:scale-105 transition-transform"
            title="Включить уведомления браузера"
          >
            <Bell className="w-4 h-4" />
            Разрешить уведомления
          </button>
        )}
        <button
          onClick={toggleSound}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
            soundEnabled ? "bg-accent text-white" : "bg-gray-700 text-gray-400"
          }`}
          title={soundEnabled ? "Звук включён (нажмите для теста)" : "Звук выключен"}
        >
          {soundEnabled ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        </button>
      </div>

      {/* Попап заказдар */}
      <div className="fixed top-20 right-4 z-[95] space-y-3 max-w-sm">
        <AnimatePresence>
          {newOrders.map((order) => (
            <motion.div
              key={order.ID}
              initial={{ opacity: 0, x: 400, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 400, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-accent to-red-600 text-white rounded-2xl p-4 shadow-2xl"
              style={{ boxShadow: "0 20px 60px -10px rgba(230,57,70,0.5)" }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-lg leading-tight">Новый заказ #{order.ID}</p>
                    <p className="text-white/80 text-xs">{order.customer_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => dismiss(order.ID)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 opacity-70" />
                  <a href={`tel:${order.phone}`} className="hover:underline">{order.phone}</a>
                </div>
                {order.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 opacity-70 mt-0.5 flex-shrink-0" />
                    <span className="text-xs leading-relaxed line-clamp-2">{order.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <div>
                  <p className="text-[11px] opacity-70">Итого</p>
                  <p className="text-xl font-black">
                    {Math.round(order.total).toLocaleString("ru-RU")} ₽
                  </p>
                </div>
                <a
                  href="/admin/orders"
                  className="bg-white text-accent font-bold px-4 py-2 rounded-xl text-sm hover:scale-105 transition-transform"
                >
                  Открыть →
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
