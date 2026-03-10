"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Package, Clock, Truck, CheckCircle, XCircle, Phone, ChefHat, ShoppingBag } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";

interface TrackItem {
  name: string;
  price: number;
  quantity: number;
}

interface TrackData {
  id: number;
  status: string;
  total: number;
  items: TrackItem[];
  created_at: string;
}

const STATUS_STEPS = [
  { key: "new", label: "Заказ принят", icon: ShoppingBag, color: "blue" },
  { key: "preparing", label: "Готовится", icon: ChefHat, color: "yellow" },
  { key: "delivering", label: "В пути", icon: Truck, color: "purple" },
  { key: "delivered", label: "Доставлен", icon: CheckCircle, color: "green" },
];

function getStatusIndex(status: string) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export default function OrderTrackPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(() => {
    fetch(`https://api.sushivkus.ru/api/orders/${orderId}/track`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
        if (data.status === "delivered" || data.status === "cancelled") {
          useOrderStore.getState().clearLastOrder();
        }
      })
      .catch(() => {
        setError("Заказ не найден");
        setLoading(false);
      });
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-white">Заказ не найден</h1>
          <p className="text-gray-500">Проверьте номер заказа</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold transition-colors"
          >
            Перейти в меню
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const statusIndex = getStatusIndex(order.status);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Отслеживание заказа</h1>
          <Link href="/" className="text-accent text-sm hover:underline">В меню</Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Номер и дата */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">Заказ</p>
          <p className="text-4xl font-black text-accent">#{order.id}</p>
          <p className="text-gray-400 text-sm mt-1">{formatDate(order.created_at)} в {formatTime(order.created_at)}</p>
        </div>

        {/* Статус */}
        {isCancelled ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-400 font-bold text-lg">Заказ отменён</p>
          </div>
        ) : (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
            <div className="relative">
              {STATUS_STEPS.map((step, idx) => {
                const isActive = idx <= statusIndex;
                const isCurrent = idx === statusIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    {/* Линия */}
                    {idx < STATUS_STEPS.length - 1 && (
                      <div
                        className={`absolute left-[19px] top-[40px] w-0.5 h-[calc(100%-16px)] ${
                          idx < statusIndex ? "bg-accent" : "bg-white/10"
                        }`}
                      />
                    )}
                    {/* Иконка */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCurrent
                          ? "bg-accent shadow-lg shadow-accent/30 scale-110"
                          : isActive
                          ? "bg-accent/20 border-2 border-accent"
                          : "bg-white/5 border-2 border-white/10"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`} />
                    </div>
                    {/* Текст */}
                    <div className={`pb-6 ${idx === STATUS_STEPS.length - 1 ? "pb-0" : ""}`}>
                      <p className={`font-semibold ${isActive ? "text-white" : "text-gray-600"}`}>{step.label}</p>
                      {isCurrent && (
                        <p className="text-accent text-sm mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                          Текущий статус
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Состав заказа */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              Ваш заказ
            </h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-black text-sm">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">{item.price}₽ / шт</p>
                </div>
                <span className="text-white font-bold text-sm">{item.price * item.quantity}₽</span>
              </div>
            ))}
          </div>
          <div className="bg-accent/5 border-t border-accent/20 px-5 py-3 flex justify-between items-center">
            <span className="text-white font-bold">Итого</span>
            <span className="text-accent font-black text-xl">{order.total?.toLocaleString("ru-RU")}₽</span>
          </div>
        </div>

        {/* Контакты */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Вопросы по заказу?</p>
              <a href="tel:+79255372825" className="text-accent font-semibold hover:underline">
                8 (925) 537-28-25
              </a>
            </div>
          </div>
        </div>

        {/* Автообновление */}
        <p className="text-center text-gray-600 text-xs flex items-center justify-center gap-1.5">
          <Clock className="w-3 h-3" />
          Статус обновляется автоматически
        </p>
      </div>
    </div>
  );
}
