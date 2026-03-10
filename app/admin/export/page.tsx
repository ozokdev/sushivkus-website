"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle,
  ShoppingBag,
  Users,
  TrendingUp,
  Filter,
} from "lucide-react";

type ExportType = "orders" | "customers" | "analytics" | "menu";
type FileFormat = "csv" | "xlsx";

interface ExportOption {
  type: ExportType;
  label: string;
  description: string;
  icon: typeof Download;
  color: string;
  fields: string[];
}

const exportOptions: ExportOption[] = [
  {
    type: "orders", label: "Заказы", description: "Все заказы с деталями, статусами и суммами",
    icon: ShoppingBag, color: "bg-accent/10 text-accent",
    fields: ["Номер заказа", "Дата", "Клиент", "Телефон", "Состав", "Сумма", "Статус", "Адрес", "Способ оплаты"],
  },
  {
    type: "customers", label: "Клиенты", description: "База клиентов с историей заказов",
    icon: Users, color: "bg-blue-500/10 text-blue-400",
    fields: ["Имя", "Телефон", "Email", "Кол-во заказов", "Общая сумма", "Средний чек", "Первый заказ", "Последний заказ", "Статус"],
  },
  {
    type: "analytics", label: "Аналитика", description: "Статистика продаж, популярные блюда, тренды",
    icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-400",
    fields: ["Дата", "Заказов", "Выручка", "Средний чек", "Новых клиентов", "Популярное блюдо"],
  },
  {
    type: "menu", label: "Меню", description: "Все позиции меню с ценами и категориями",
    icon: FileText, color: "bg-purple-500/10 text-purple-400",
    fields: ["Название", "Категория", "Цена", "Вес", "Описание", "Бейдж", "Активно"],
  },
];

const periodOptions = [
  { label: "7 дней", days: 7 },
  { label: "30 дней", days: 30 },
  { label: "90 дней", days: 90 },
  { label: "6 месяцев", days: 180 },
  { label: "1 год", days: 365 },
  { label: "Всё время", days: 0 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

const statusLabels: Record<string, string> = {
  new: "Новый",
  preparing: "Готовится",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

async function generateCSV(type: ExportType): Promise<string> {
  const token = getToken();

  if (type === "orders") {
    try {
      const res = await fetch("https://api.sushivkus.ru/api/orders?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const orders = data.orders || [];
        let csv = "Номер,Дата,Клиент,Телефон,Сумма,Статус\n";
        for (const o of orders) {
          const date = new Date(o.CreatedAt).toLocaleDateString("ru-RU");
          const status = statusLabels[o.status] || o.status;
          csv += `${o.ID},${date},"${o.customer_name}",${o.phone},${o.total},${status}\n`;
        }
        return csv;
      }
    } catch {}
    return "Номер,Дата,Клиент,Телефон,Сумма,Статус\nНет данных\n";
  }

  if (type === "customers") {
    try {
      const res = await fetch("https://api.sushivkus.ru/api/orders?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const orders = data.orders || [];
        const customers: Record<string, { name: string; phone: string; count: number; total: number }> = {};
        for (const o of orders) {
          const key = o.phone;
          if (!customers[key]) {
            customers[key] = { name: o.customer_name, phone: o.phone, count: 0, total: 0 };
          }
          customers[key].count++;
          customers[key].total += o.total;
        }
        let csv = "Имя,Телефон,Заказов,Потрачено,Ср.чек\n";
        for (const c of Object.values(customers)) {
          csv += `"${c.name}",${c.phone},${c.count},${c.total},${Math.round(c.total / c.count)}\n`;
        }
        return csv;
      }
    } catch {}
    return "Имя,Телефон,Заказов,Потрачено,Ср.чек\nНет данных\n";
  }

  if (type === "analytics") {
    try {
      const res = await fetch("https://api.sushivkus.ru/api/orders?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const orders = data.orders || [];
        const days: Record<string, { count: number; revenue: number }> = {};
        for (const o of orders) {
          const date = new Date(o.CreatedAt).toLocaleDateString("ru-RU");
          if (!days[date]) days[date] = { count: 0, revenue: 0 };
          days[date].count++;
          days[date].revenue += o.total;
        }
        let csv = "Дата,Заказов,Выручка,Ср.чек\n";
        for (const [date, d] of Object.entries(days)) {
          csv += `${date},${d.count},${d.revenue},${Math.round(d.revenue / d.count)}\n`;
        }
        return csv;
      }
    } catch {}
    return "Дата,Заказов,Выручка,Ср.чек\nНет данных\n";
  }

  // menu
  try {
    const res = await fetch("https://api.sushivkus.ru/api/menu");
    if (res.ok) {
      const items = await res.json();
      let csv = "Название,Категория,Цена,Вес,Описание\n";
      for (const m of Array.isArray(items) ? items : []) {
        csv += `"${m.name}","${m.category}",${m.price},"${m.weight || ""}","${(m.description || "").replace(/"/g, '""')}"\n`;
      }
      return csv;
    }
  } catch {}
  return "Название,Категория,Цена,Вес,Описание\nНет данных\n";
}

export default function ExportPage() {
  const [selectedType, setSelectedType] = useState<ExportType | null>(null);
  const [format, setFormat] = useState<FileFormat>("csv");
  const [period, setPeriod] = useState(30);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (!selectedType) return;

    setExporting(true);

    try {
      const csv = await generateCSV(selectedType);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedType}_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch {
      // Export error
    }
    setExporting(false);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Заголовок */}
      <motion.div variants={itemAnim}>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Download className="w-7 h-7 text-accent" />
          Экспорт данных
        </h1>
        <p className="text-gray-500 text-sm mt-1">Выгрузка данных в CSV для анализа</p>
      </motion.div>

      {/* Тип маалыматты тандоо */}
      <motion.div variants={itemAnim}>
        <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">Что экспортировать</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exportOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={`text-left bg-[#111] border rounded-2xl p-5 transition-all ${
                selectedType === opt.type
                  ? "border-accent/40 bg-accent/5"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.color}`}>
                  <opt.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold mb-0.5">{opt.label}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{opt.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {opt.fields.slice(0, 4).map((f) => (
                      <span key={f} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                    {opt.fields.length > 4 && (
                      <span className="text-[10px] text-gray-500">+{opt.fields.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {selectedType && (
        <>
          {/* Мөөнөт */}
          {(selectedType === "orders" || selectedType === "analytics") && (
            <motion.div variants={itemAnim}>
              <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">Период</h3>
              <div className="flex flex-wrap gap-2">
                {periodOptions.map((opt) => (
                  <button
                    key={opt.days}
                    onClick={() => setPeriod(opt.days)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      period === opt.days
                        ? "bg-accent text-white"
                        : "bg-[#111] border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Формат */}
          <motion.div variants={itemAnim}>
            <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">Формат файла</h3>
            <div className="flex gap-3">
              {([
                { key: "csv" as const, label: "CSV", desc: "Универсальный формат", icon: FileText },
                { key: "xlsx" as const, label: "Excel (XLSX)", desc: "Microsoft Excel", icon: FileSpreadsheet },
              ]).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFormat(f.key)}
                  className={`flex items-center gap-3 bg-[#111] border rounded-2xl p-4 transition-all ${
                    format === f.key ? "border-accent/40 bg-accent/5" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <f.icon className={`w-8 h-8 ${format === f.key ? "text-accent" : "text-gray-500"}`} />
                  <div className="text-left">
                    <p className="font-medium text-sm">{f.label}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Кнопка экспорт */}
          <motion.div variants={itemAnim}>
            <button
              onClick={handleExport}
              disabled={exporting}
              className={`flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                exported
                  ? "bg-green-500 text-white"
                  : exporting
                  ? "bg-accent/50 text-white cursor-wait"
                  : "bg-accent hover:bg-accent/90 text-white"
              }`}
            >
              {exported ? (
                <><CheckCircle className="w-5 h-5" /> Файл скачан!</>
              ) : exporting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Экспортируем...</>
              ) : (
                <><Download className="w-5 h-5" /> Скачать {format.toUpperCase()}</>
              )}
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
