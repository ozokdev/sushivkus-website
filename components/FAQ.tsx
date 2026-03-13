"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqData = [
  {
    q: "Какая зона доставки?",
    a: "Мы доставляем по всему Люберцы и ближайшим районам. Точную зону доставки уточняйте у оператора.",
  },
  {
    q: "Какая минимальная сумма заказа?",
    a: "Минимальная сумма заказа для бесплатной доставки — 1000₽. При заказе менее 1000₽ стоимость доставки составляет 200₽.",
  },
  {
    q: "Сколько времени занимает доставка?",
    a: "Среднее время доставки — 45-60 минут. В часы пик (пятница-воскресенье, 18:00-21:00) время может увеличиться до 90 минут.",
  },
  {
    q: "Можно ли оплатить картой?",
    a: "Да! Принимаем наличные и банковские карты при получении. Также доступен перевод на карту Сбербанк.",
  },
  {
    q: "Как отменить или изменить заказ?",
    a: "Свяжитесь с нами по телефону 8 (925) 537-28-25 или в WhatsApp сразу после оформления. Изменения возможны до начала приготовления.",
  },
  {
    q: "Есть ли у вас акции?",
    a: "Да! Следите за актуальными акциями на нашем сайте и в Instagram. Также используйте промокод VKUS20 для скидки 20% на первый заказ.",
  },
  {
    q: "Какой режим работы?",
    a: "Мы работаем ежедневно с 10:00 до 23:00, включая праздничные дни.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-6 md:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Частые вопросы
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Вопросы и ответы
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium text-sm md:text-base pr-4">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
