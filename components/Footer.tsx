"use client";

import { MapPin, Phone, Clock, Instagram, MessageCircle, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contacts" className="bg-[#080808] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Логотип и описание */}
          <div>
            <h3 className="text-2xl font-black mb-4">
              <span className="text-accent">Суши</span> Вкус
            </h3>
            <p className="text-gray-500 leading-relaxed mb-4">
              Свежие роллы. Быстрая доставка. Готовим с любовью из качественных
              ингредиентов.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/79255372825"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600/10 hover:bg-green-600/20 border border-green-600/20 rounded-xl flex items-center justify-center transition-all"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-green-500" />
              </a>
              <a
                href="https://t.me/kelechek_sushi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center transition-all"
                title="Telegram"
              >
                <Send className="w-5 h-5 text-blue-400" />
              </a>
              <a
                href="https://instagram.com/sushivkus_lybertsy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-accent/20 border border-white/10 rounded-xl flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 hover:text-accent" />
              </a>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-bold text-lg mb-6">Контакты</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  ул. Шоссейная, 42, г. Люберцы
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="tel:+79255372825"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  8 (925) 537-28-25
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-400">Ежедневно: 10:00 — 23:00</span>
              </div>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-bold text-lg mb-6">Навигация</h4>
            <div className="space-y-3">
              {[
                { href: "#menu", label: "Меню" },
                { href: "#promo", label: "Акции" },
                { href: "#delivery", label: "Доставка" },
                { href: "#contacts", label: "Контакты" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-gray-500 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-white/5 mt-6 pt-4 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Суши Вкус. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
