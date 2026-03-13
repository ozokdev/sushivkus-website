"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, ShoppingBag, ChevronLeft, Banknote, CreditCard, Globe, Minus, Plus, Trash2, CheckCircle, Package, Clock, Tag, X } from "lucide-react";
import { useCartStore, MIN_ORDER } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, updateQuantity, removeItem, clearCart, appliedPromo, applyPromo, removePromo, getDiscount, getDiscountAmount, getFinalPrice } = useCartStore();

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
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<{ id: number; total: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{ key: string; name: string; description: string; enabled: boolean }[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("cash");

  useEffect(() => {
    setMounted(true);
    fetch("https://api.sushivkus.ru/api/payment-methods")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const enabled = data.filter((m: { enabled: boolean }) => m.enabled);
          setPaymentMethods(enabled);
          if (enabled.length > 0) setSelectedPayment(enabled[0].key);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          payment_method: selectedPayment,
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          promo_code: appliedPromo || "",
          discount_percent: getDiscount(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const orderId = data.id || data.ID || data.order?.ID || 0;
        const total = getFinalPrice();
        useOrderStore.getState().setLastOrderId(orderId);

        // Онлайн-оплата — ЮKassa
        if (selectedPayment === "online" && orderId) {
          try {
            const payRes = await fetch("https://api.sushivkus.ru/api/payment/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order_id: orderId, amount: total }),
            });
            const payData = await payRes.json();
            if (payRes.ok && payData.confirmation_url) {
              clearCart();
              window.location.href = payData.confirmation_url;
              return;
            }
          } catch {
            // Если оплата не удалась — показываем успех заказа
          }
        }

        clearCart();
        setOrderSuccess({ id: orderId, total });
      } else {
        setError(data.error || "Ошибка при отправке заказа");
      }
    } catch {
      setError("Нет связи с сервером. Попробуйте ещё раз.");
    }

    setIsSubmitting(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Успешный заказ
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Заказ оформлен!</h1>
            <p className="text-gray-400">Мы свяжемся с вами для подтверждения</p>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl p-5">
            <p className="text-gray-500 text-sm mb-1">Номер заказа</p>
            <p className="text-3xl font-black text-accent">#{orderSuccess.id}</p>
            <p className="text-gray-400 text-sm mt-2">Сумма: {orderSuccess.total.toLocaleString("ru-RU")} ₽</p>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-accent" />
              </div>
              <span className="text-gray-400">Заказ передан на кухню для приготовления</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-gray-400">Среднее время доставки: 45-60 минут</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-gray-400">
                Вопросы?{" "}
                <a href="tel:+79255372825" className="text-accent hover:underline">
                  8 (925) 537-28-25
                </a>
              </span>
            </div>
          </div>

          <Link
            href={`/order/${orderSuccess.id}`}
            className="block w-full py-3.5 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold transition-colors text-center"
          >
            Отслеживать заказ
          </Link>

          <Link
            href="/"
            className="block w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 font-medium transition-colors text-center"
          >
            Вернуться в меню
          </Link>
        </div>
      </div>
    );
  }

  // Пустая корзина
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto" />
          <h1 className="text-xl font-bold text-white">Корзина пуста</h1>
          <p className="text-gray-500">Добавьте что-нибудь из меню</p>
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

  const totalPrice = getTotalPrice();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = getDiscount();
  const discountAmount = getDiscountAmount();
  const finalPrice = getFinalPrice();
  const isBelowMinimum = totalPrice < MIN_ORDER;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Шапка */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-lg font-bold text-white">Оформление заказа</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Товары — компактный список */}
          <section className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-accent" />
                Ваш заказ ({totalItems})
              </h2>
              <button type="button" onClick={() => router.back()} className="text-accent text-xs hover:underline">
                Изменить
              </button>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-2">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.price} ₽</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-white font-bold text-sm w-16 text-right">{item.price * item.quantity} ₽</span>
                  <button type="button" onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-red-500/10 rounded-lg transition-colors text-gray-600 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Данные доставки — компактная форма */}
          <section className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-3">
            <h2 className="font-bold text-white text-sm">Доставка</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Имя</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Введите имя"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефон</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  pattern="[\d\s\+\-\(\)]{10,18}" title="Введите корректный номер телефона"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Улица и дом</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} required
                placeholder="ул. Ленина, д. 10"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Подъезд</label>
                <input type="text" name="entrance" value={form.entrance} onChange={handleChange} placeholder="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Этаж</label>
                <input type="text" name="floor" value={form.floor} onChange={handleChange} placeholder="5"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Квартира</label>
                <input type="text" name="apartment" value={form.apartment} onChange={handleChange} placeholder="42"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Код двери</label>
                <input type="text" name="doorCode" value={form.doorCode} onChange={handleChange} placeholder="1234"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Комментарий</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} rows={2}
                placeholder="Пожелания, кол-во приборов..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 transition-colors resize-none" />
            </div>
          </section>

          {/* Способ оплаты — компактные кнопки */}
          <section className="bg-[#111] border border-white/10 rounded-2xl p-4">
            <h2 className="font-bold text-white text-sm mb-2.5">Способ оплаты</h2>
            {paymentMethods.length > 0 ? (
              <div className="flex gap-2">
                {paymentMethods.map((method) => {
                  const isSelected = selectedPayment === method.key;
                  const Icon = method.key === "cash" ? Banknote : method.key === "card" ? CreditCard : Globe;
                  return (
                    <button key={method.key} type="button" onClick={() => setSelectedPayment(method.key)}
                      className={`flex-1 rounded-xl py-3 px-3 flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? "bg-accent/10 border-2 border-accent/40"
                          : "bg-white/[0.03] border-2 border-transparent hover:border-white/10"
                      }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? "text-accent" : "text-gray-500"}`} />
                      <span className={`text-xs font-medium ${isSelected ? "text-white" : "text-gray-400"}`}>{method.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelectedPayment("cash")}
                  className={`flex-1 rounded-xl py-3 px-3 flex flex-col items-center gap-1.5 transition-all ${
                    selectedPayment === "cash"
                      ? "bg-accent/10 border-2 border-accent/40"
                      : "bg-white/[0.03] border-2 border-transparent hover:border-white/10"
                  }`}>
                  <Banknote className={`w-5 h-5 ${selectedPayment === "cash" ? "text-accent" : "text-gray-500"}`} />
                  <span className={`text-xs font-medium ${selectedPayment === "cash" ? "text-white" : "text-gray-400"}`}>Наличными</span>
                </button>
                <button type="button" onClick={() => setSelectedPayment("card")}
                  className={`flex-1 rounded-xl py-3 px-3 flex flex-col items-center gap-1.5 transition-all ${
                    selectedPayment === "card"
                      ? "bg-accent/10 border-2 border-accent/40"
                      : "bg-white/[0.03] border-2 border-transparent hover:border-white/10"
                  }`}>
                  <CreditCard className={`w-5 h-5 ${selectedPayment === "card" ? "text-accent" : "text-gray-500"}`} />
                  <span className={`text-xs font-medium ${selectedPayment === "card" ? "text-white" : "text-gray-400"}`}>Картой</span>
                </button>
              </div>
            )}
          </section>

          {/* Промокод + Итого */}
          <section className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-3">
            {/* Промокод */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <Tag className="w-4 h-4" />
                    <span>{appliedPromo} (−{discount}%)</span>
                  </div>
                  <button type="button" onClick={() => { removePromo(); setPromoInput(""); }} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                    placeholder="Промокод"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/50" />
                  <button type="button" onClick={() => {
                    const ok = applyPromo(promoInput);
                    if (!ok) setPromoError("Промокод не найден");
                    else setPromoError("");
                  }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-accent/20 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:text-accent transition-all">
                    ОК
                  </button>
                </div>
              )}
              {promoError && <p className="text-red-400 text-xs mt-1.5">{promoError}</p>}
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">
                {totalItems} {totalItems === 1 ? "товар" : totalItems < 5 ? "товара" : "товаров"}
              </span>
              <span className="text-gray-300">{totalPrice.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Доставка</span>
              <span className="text-green-400 font-medium">Бесплатно</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-400">Скидка {discount}%</span>
                <span className="text-emerald-400 font-medium">−{discountAmount.toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white font-bold">К оплате:</span>
              <span className="text-2xl font-black text-accent">{finalPrice.toLocaleString("ru-RU")} ₽</span>
            </div>

            {isBelowMinimum && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-2.5 text-yellow-400 text-xs text-center">
                Минимальная сумма — {MIN_ORDER}₽. Добавьте ещё на {MIN_ORDER - totalPrice}₽
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={isSubmitting || isBelowMinimum}
              className="w-full py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold text-base transition-all shadow-lg shadow-accent/20">
              {isSubmitting ? "Отправка..." : isBelowMinimum ? `Минимум ${MIN_ORDER}₽` : "Подтвердить заказ"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}
