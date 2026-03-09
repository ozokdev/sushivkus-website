"use client";

import { motion } from "framer-motion";
import { Gift, Percent, Clock, Flame } from "lucide-react";

const promotions = [
  {
    title: "2+1 в подарок",
    description: "Закажи 2 ролла — третий в подарок! Акция действует на все классические роллы.",
    icon: Gift,
    gradient: "from-accent/20 to-orange-500/20",
    border: "border-accent/20",
    iconColor: "text-accent",
    badge: "Хит",
  },
  {
    title: "Сеты -15% по пятницам",
    description: "Каждую пятницу скидка 15% на все сеты. Отличный повод собраться с друзьями!",
    icon: Percent,
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    badge: "Пт",
  },
  {
    title: "Счастливые часы",
    description: "С 11:00 до 14:00 скидка 10% на всё меню. Идеально для обеда!",
    icon: Clock,
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    badge: "11-14",
  },
  {
    title: "Промокод VKUS20",
    description: "Скидка 20% на первый заказ по промокоду VKUS20. Попробуйте наши роллы!",
    icon: Flame,
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    badge: "-20%",
  },
];

export default function Promotions() {
  return (
    <section id="promo" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Выгодно
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Акции и спецпредложения
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-br ${promo.gradient} border ${promo.border} rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300 overflow-hidden`}
            >
              {/* Бейдж */}
              <span className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {promo.badge}
              </span>

              <div
                className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${promo.iconColor}`}
              >
                <promo.icon className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {promo.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
