"use client";

import { motion } from "framer-motion";
import { Truck, Fish, BadgePercent } from "lucide-react";

const advantages = [
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Доставим ваш заказ за 60 минут или быстрее",
  },
  {
    icon: Fish,
    title: "Свежие ингредиенты",
    description: "Используем только свежую рыбу и продукты высшего качества",
  },
  {
    icon: BadgePercent,
    title: "Лучшие цены",
    description: "Выгодные цены и регулярные акции для наших клиентов",
  },
];

export default function Advantages() {
  return (
    <section className="py-20 relative" id="delivery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {advantages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <item.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
