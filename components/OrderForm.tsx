"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Phone, MapPin, MessageSquare } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function OrderForm() {
  const { items, isOrderFormOpen, closeOrderForm, getTotalPrice, clearCart, openOrderSuccess } =
    useCartStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    comment: "",
  });

  // Обновление полей формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Отправка заказа в WhatsApp
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Формируем текст заказа
    const orderItems = items
      .map((item) => `• ${item.name} x${item.quantity} — ${item.price * item.quantity}₽`)
      .join("\n");

    const message = `🍣 *Новый заказ — Суши Вкус*\n\n` +
      `👤 Имя: ${form.name}\n` +
      `📱 Телефон: ${form.phone}\n` +
      `📍 Адрес: ${form.address}\n` +
      `${form.comment ? `💬 Комментарий: ${form.comment}\n` : ""}` +
      `\n📋 *Заказ:*\n${orderItems}\n\n` +
      `💰 *Итого: ${getTotalPrice()}₽*`;

    // Открываем WhatsApp с текстом заказа
    const whatsappUrl = `https://wa.me/79253206190?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Очищаем корзину и показываем success
    clearCart();
    closeOrderForm();
    openOrderSuccess();
    setForm({ name: "", phone: "", address: "", comment: "" });
  };

  return (
    <AnimatePresence>
      {isOrderFormOpen && (
        <>
          {/* Затемнение */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrderForm}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Шапка */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold">Оформление заказа</h2>
                <button
                  onClick={closeOrderForm}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Форма */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Имя */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <User className="w-4 h-4" />
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Введите имя"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>

                {/* Телефон */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Phone className="w-4 h-4" />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+996 XXX XXX XXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>

                {/* Адрес */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    Адрес доставки
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Улица, дом, квартира"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>

                {/* Комментарий */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Комментарий (необязательно)
                  </label>
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Пожелания к заказу..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                  />
                </div>

                {/* Итого */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      {items.length} {items.length === 1 ? "товар" : "товаров"}
                    </span>
                    <span className="text-2xl font-bold text-accent">
                      {getTotalPrice()} ₽
                    </span>
                  </div>
                </div>

                {/* Кнопка отправки */}
                <button
                  type="submit"
                  className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                >
                  <Send className="w-5 h-5" />
                  Отправить в WhatsApp
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
