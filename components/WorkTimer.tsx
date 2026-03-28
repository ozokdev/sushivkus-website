"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

export default function WorkTimer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const workStart = useSettingsStore((s) => s.settings.workStart);
  const workEnd = useSettingsStore((s) => s.settings.workEnd);

  useEffect(() => {
    const startH = parseInt(workStart.split(":")[0], 10) || 10;
    const endH = parseInt(workEnd.split(":")[0], 10) || 22;

    const calculate = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours < startH) {
        const h = startH - hours - 1;
        const m = 60 - minutes;
        setTimeLeft(`Откроемся через ${h}ч ${m}мин`);
        setIsOpen(false);
      } else if (hours >= endH) {
        setTimeLeft(`Мы закрыты. Работаем с ${workStart}`);
        setIsOpen(false);
      } else {
        const h = endH - hours - 1;
        const m = 60 - minutes;
        setTimeLeft(`${h}ч ${m}мин`);
        setIsOpen(true);
      }
    };

    calculate();
    const timer = setInterval(calculate, 60000);
    return () => clearInterval(timer);
  }, [workStart, workEnd]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-xl my-2 ${
          isOpen
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}
      >
        <Clock className="w-4 h-4" />
        {isOpen ? (
          <span>
            Принимаем заказы! Осталось <strong>{timeLeft}</strong>
          </span>
        ) : (
          <span>{timeLeft}</span>
        )}
      </div>
    </div>
  );
}
