"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, MapPin, MessageSquare, ShoppingBag, ChevronLeft, Banknote, Building2, DoorOpen, Hash, KeyRound } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import Image from "next/image";

export default function OrderForm() {
  const { items, isOrderFormOpen, closeOrderForm, getTotalPrice, clearCart, openOrderSuccess, openCart, appliedPromo, getDiscount, getDiscountAmount, getFinalPrice } =
    useCartStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    entrance: "",
    floor: "",
    apartment: "",
    doorCode: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("https://api.sushivkus.ru/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          phone: form.phone,
          address: form.address,
          entrance: form.entrance,
          floor: form.floor,
          apartment: form.apartment,
          door_code: form.doorCode,
          comment: form.comment,
          promo_code: appliedPromo || "",
          discount_percent: getDiscount(),
          items: items.map((item) => ({
            name: item.description ? `${item.name} (${item.description})` : item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const orderId = data.order?.ID || data.ID;
        useOrderStore.getState().setLastOrderId(orderId);
        clearCart();
        closeOrderForm();
        openOrderSuccess(orderId);
        setForm({ name: "", phone: "", address: "", entrance: "", floor: "", apartment: "", doorCode: "", comment: "" });
      } else {
        setError(data.error || "Ошибка при отправке заказа");
      }
    } catch {
      setError("Нет связи с сервером. Попробуйте ещё раз.");
    }

    setIsSubmitting(false);
  };

  const handleBackToCart = () => {
    closeOrderForm();
    openCart();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOrderFormOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrderForm}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div role="dialog" aria-modal="true" aria-label="Оформление заказа" className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
              {/* Шапка */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#111] z-10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToCart}
                    aria-label="Назад в корзину"
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <h2 className="text-lg font-bold">Оформление заказа</h2>
                </div>
                <button
                  onClick={closeOrderForm}
                  aria-label="Закрыть"
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Ваш заказ */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-accent" />
                      Ваш заказ
                    </h3>
                    <button
                      type="button"
                      onClick={handleBackToCart}
                      className="text-accent text-sm hover:underline"
                    >
                      Редактировать
                    </button>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl divide-y divide-white/[0.06]">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.name}</p>
                          {item.description && (
                            <p className="text-[10px] text-gray-500 truncate">{item.description}</p>
                          )}
                          <p className="text-accent text-sm font-bold">{item.price} ₽</p>
                        </div>
                        <div className="text-gray-400 text-sm">x {item.quantity}</div>
                        <div className="text-white font-bold text-sm w-20 text-right">
                          {item.price * item.quantity} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Контактные данные */}
                <div className="space-y-4">
                  <h3 className="font-bold text-white">Данные для доставки</h3>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
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

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <Phone className="w-4 h-4" />
                      Телефон
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      pattern="[\d\s\+\-\(\)]{10,18}"
                      title="Введите корректный номер телефона"
                      placeholder="+7 (XXX) XXX-XX-XX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <MapPin className="w-4 h-4" />
                      Улица и дом
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="ул. Ленина, д. 10"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                        <Building2 className="w-4 h-4" />
                        Подъезд
                      </label>
                      <input
                        type="text"
                        name="entrance"
                        value={form.entrance}
                        onChange={handleChange}
                        placeholder="1"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                        <Hash className="w-4 h-4" />
                        Этаж
                      </label>
                      <input
                        type="text"
                        name="floor"
                        value={form.floor}
                        onChange={handleChange}
                        placeholder="5"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                        <DoorOpen className="w-4 h-4" />
                        Квартира
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={form.apartment}
                        onChange={handleChange}
                        placeholder="42"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                        <KeyRound className="w-4 h-4" />
                        Код двери
                      </label>
                      <input
                        type="text"
                        name="doorCode"
                        value={form.doorCode}
                        onChange={handleChange}
                        placeholder="1234"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                      <MessageSquare className="w-4 h-4" />
                      Комментарий (необязательно)
                    </label>
                    <textarea
                      name="comment"
                      value={form.comment}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Пожелания к заказу..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Способ оплаты */}
                <div>
                  <h3 className="font-bold text-white mb-3">Способ оплаты</h3>
                  <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Banknote className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Наличными курьеру</p>
                      <p className="text-gray-400 text-xs">Оплата при получении</p>
                    </div>
                  </div>
                </div>

                {/* Итого */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{totalItems} {totalItems === 1 ? "товар" : totalItems < 5 ? "товара" : "товаров"}</span>
                    <span className="text-gray-300">{getTotalPrice()} ₽</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400">Промокод {appliedPromo} (-{getDiscount()}%)</span>
                      <span className="text-emerald-400 font-medium">-{getDiscountAmount()} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Доставка</span>
                    <span className="text-green-400 font-medium">Бесплатно</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Итого:</span>
                    <span className="text-2xl font-black text-accent">{getFinalPrice()} ₽</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Кнопка */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-accent/20"
                >
                  {isSubmitting ? "Отправка заказа..." : "Подтвердить заказ"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
