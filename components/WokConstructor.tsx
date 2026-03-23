"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "./Toast";

// === WOK Конфигурация ===

const DEFAULT_BASE_PRICE = 420;

interface WokApiItem {
  ID: number;
  name: string;
  type: string;
  price: number;
  is_active: boolean;
  sort_order: number;
}

interface WokOption {
  id: string;
  name: string;
  price: number;
}

// Fallback дайындары (API жок болсо)
const FALLBACK_BASES: WokOption[] = [
  { id: "base_1", name: "Лапша пшеничная", price: 0 },
  { id: "base_2", name: "Рис", price: 0 },
  { id: "base_3", name: "Лапша яичная", price: 0 },
  { id: "base_4", name: "Лапша хрустальная", price: 0 },
  { id: "base_5", name: "Лапша гречневая", price: 0 },
];
const FALLBACK_VEGETABLES: WokOption[] = [
  { id: "veg_1", name: "Паприка", price: 0 },
  { id: "veg_2", name: "Лук репчатый", price: 0 },
  { id: "veg_3", name: "Морковь", price: 0 },
];
const FALLBACK_SAUCES: WokOption[] = [
  { id: "sauce_1", name: "Соус острый", price: 0 },
  { id: "sauce_2", name: "Соус сливочно-чесночный", price: 0 },
  { id: "sauce_3", name: "Соус соевый", price: 0 },
  { id: "sauce_4", name: "Соус терияки", price: 0 },
];
const FALLBACK_PROTEINS: WokOption[] = [
  { id: "prot_1", name: "Курица", price: 160 },
  { id: "prot_2", name: "Говядина", price: 185 },
  { id: "prot_3", name: "Куриное яйцо", price: 80 },
  { id: "prot_4", name: "Сыр пармезан", price: 125 },
  { id: "prot_5", name: "Шампиньоны", price: 115 },
  { id: "prot_6", name: "Сыр маасдам", price: 125 },
];
const FALLBACK_EXTRAS: WokOption[] = [
  { id: "extra_1", name: "Доп соус соевый", price: 70 },
  { id: "extra_2", name: "Доп соус терияки", price: 70 },
  { id: "extra_3", name: "Доп соус острый", price: 70 },
  { id: "extra_4", name: "Доп Овощи", price: 70 },
];

function mapApiItems(items: WokApiItem[], type: string): WokOption[] {
  return items
    .filter((i) => i.type === type)
    .map((i) => ({ id: `${type}_${i.ID}`, name: i.name, price: i.price }));
}

interface WokConstructorProps {
  isOpen: boolean;
  onClose: () => void;
  productImage?: string;
}

export default function WokConstructor({ isOpen, onClose, productImage }: WokConstructorProps) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToast((s) => s.show);

  // API data
  const [bases, setBases] = useState<WokOption[]>(FALLBACK_BASES);
  const [vegetables, setVegetables] = useState<WokOption[]>(FALLBACK_VEGETABLES);
  const [sauces, setSauces] = useState<WokOption[]>(FALLBACK_SAUCES);
  const [proteins, setProteins] = useState<WokOption[]>(FALLBACK_PROTEINS);
  const [extras, setExtras] = useState<WokOption[]>(FALLBACK_EXTRAS);
  const [wokBasePrice, setWokBasePrice] = useState(DEFAULT_BASE_PRICE);
  const [dataLoading, setDataLoading] = useState(false);

  // User selections
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedVegetables, setSelectedVegetables] = useState<Set<string>>(new Set());
  const [selectedSauce, setSelectedSauce] = useState<string>("");
  const [proteinCounts, setProteinCounts] = useState<Record<string, number>>({});
  const [extraCounts, setExtraCounts] = useState<Record<string, number>>({});

  // API'ден жүктөө
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function load() {
      setDataLoading(true);
      try {
        const [itemsRes, settingsRes] = await Promise.all([
          fetch("https://api.sushivkus.ru/api/wok-items"),
          fetch("https://api.sushivkus.ru/api/site-settings"),
        ]);

        if (itemsRes.ok && !cancelled) {
          const data: WokApiItem[] = await itemsRes.json();
          if (Array.isArray(data) && data.length > 0) {
            const b = mapApiItems(data, "base");
            const v = mapApiItems(data, "vegetable");
            const s = mapApiItems(data, "sauce");
            const p = mapApiItems(data, "protein");
            const e = mapApiItems(data, "extra");
            if (b.length > 0) setBases(b);
            if (v.length > 0) setVegetables(v);
            if (s.length > 0) setSauces(s);
            if (p.length > 0) setProteins(p);
            if (e.length > 0) setExtras(e);
          }
        }

        if (settingsRes.ok && !cancelled) {
          const settings = await settingsRes.json();
          if (settings.wok_base_price) {
            setWokBasePrice(parseInt(settings.wok_base_price, 10) || DEFAULT_BASE_PRICE);
          }
        }
      } catch {
        // fallback data is already set
      }
      if (!cancelled) setDataLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  // Defaults
  useEffect(() => {
    if (bases.length > 0 && !selectedBase) setSelectedBase(bases[0].id);
  }, [bases, selectedBase]);

  // Овощи — колдонуучу өзү тандайт, баштапкы абалда бош
  // useEffect removed: no default vegetable selection

  useEffect(() => {
    if (sauces.length > 0 && !selectedSauce) setSelectedSauce(sauces[sauces.length - 1].id);
  }, [sauces, selectedSauce]);

  const toggleVegetable = (id: string) => {
    setSelectedVegetables((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateCount = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    id: string,
    delta: number
  ) => {
    setter((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  // Баа
  const proteinTotal = Object.entries(proteinCounts).reduce((sum, [id, count]) => {
    const item = proteins.find((p) => p.id === id);
    return sum + (item?.price || 0) * count;
  }, 0);

  const extraTotal = Object.entries(extraCounts).reduce((sum, [id, count]) => {
    const item = extras.find((e) => e.id === id);
    return sum + (item?.price || 0) * count;
  }, 0);

  const totalPrice = wokBasePrice + proteinTotal + extraTotal;

  // Корзинага кошуу
  const handleAddToCart = () => {
    const baseName = bases.find((b) => b.id === selectedBase)?.name || "";
    const vegNames = Array.from(selectedVegetables)
      .map((id) => vegetables.find((v) => v.id === id)?.name)
      .filter(Boolean);
    const sauceName = sauces.find((s) => s.id === selectedSauce)?.name || "";

    const proteinNames = Object.entries(proteinCounts)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => {
        const p = proteins.find((p) => p.id === id);
        return count > 1 ? `${p?.name} x${count}` : p?.name;
      });

    const extraNames = Object.entries(extraCounts)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => {
        const e = extras.find((e) => e.id === id);
        return count > 1 ? `${e?.name} x${count}` : e?.name;
      });

    const parts = [baseName, sauceName];
    if (vegNames.length > 0) parts.push(vegNames.join(", "));
    if (proteinNames.length > 0) parts.push(proteinNames.join(", "));
    if (extraNames.length > 0) parts.push(extraNames.join(", "));

    const description = parts.join(" · ");

    addItem({
      id: Date.now(),
      name: "WOK",
      price: totalPrice,
      image: productImage || "/photo/california_tempura.jpg",
      description,
    });

    showToast("WOK добавлен в корзину!");
    onClose();

    // Reset extras
    setProteinCounts({});
    setExtraCounts({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          >
            <div
              className="bg-[#111] border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="WOK Конструктор"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 pb-2 border-b border-white/[0.06] flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold">WOK Конструктор</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Собери свой WOK · 300 г</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Закрыть"
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              {dataLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 p-4 space-y-5">
                  {/* ОСНОВА */}
                  <Section title="Основа" subtitle="выберите 1">
                    <div className="grid grid-cols-2 gap-2">
                      {bases.map((item) => (
                        <SelectableChip
                          key={item.id}
                          name={item.name}
                          selected={selectedBase === item.id}
                          onClick={() => setSelectedBase(item.id)}
                        />
                      ))}
                    </div>
                  </Section>

                  {/* ОВОЩИ */}
                  <Section title="Овощи" subtitle="входят в состав">
                    <div className="grid grid-cols-3 gap-2">
                      {vegetables.map((item) => (
                        <SelectableChip
                          key={item.id}
                          name={item.name}
                          selected={selectedVegetables.has(item.id)}
                          onClick={() => toggleVegetable(item.id)}
                          multi
                        />
                      ))}
                    </div>
                  </Section>

                  {/* СОУС */}
                  <Section title="Соус" subtitle="выберите 1">
                    <div className="grid grid-cols-2 gap-2">
                      {sauces.map((item) => (
                        <SelectableChip
                          key={item.id}
                          name={item.name}
                          selected={selectedSauce === item.id}
                          onClick={() => setSelectedSauce(item.id)}
                        />
                      ))}
                    </div>
                  </Section>

                  {/* МЯСО */}
                  <Section title="Мясо и добавки" subtitle="по желанию">
                    <div className="space-y-2">
                      {proteins.map((item) => (
                        <CounterRow
                          key={item.id}
                          name={item.name}
                          price={item.price}
                          count={proteinCounts[item.id] || 0}
                          onPlus={() => updateCount(setProteinCounts, item.id, 1)}
                          onMinus={() => updateCount(setProteinCounts, item.id, -1)}
                        />
                      ))}
                    </div>
                  </Section>

                  {/* ДОП */}
                  <Section title="Доп соуса и овощи" subtitle="по желанию">
                    <div className="space-y-2">
                      {extras.map((item) => (
                        <CounterRow
                          key={item.id}
                          name={item.name}
                          price={item.price}
                          count={extraCounts[item.id] || 0}
                          onPlus={() => updateCount(setExtraCounts, item.id, 1)}
                          onMinus={() => updateCount(setExtraCounts, item.id, -1)}
                        />
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between p-4 pt-3 border-t border-white/[0.06] flex-shrink-0 bg-[#111]">
                <div>
                  <span className="text-2xl font-bold text-accent">{totalPrice} ₽</span>
                  {proteinTotal + extraTotal > 0 && (
                    <span className="text-xs text-gray-500 block">
                      {wokBasePrice} ₽ + {proteinTotal + extraTotal} ₽ доп
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-6 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold transition-all duration-200 glow-red flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Добавить
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-[11px] text-gray-500">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}

function SelectableChip({ name, selected, onClick, multi }: { name: string; selected: boolean; onClick: () => void; multi?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 text-left ${
        selected
          ? "bg-accent/15 border-accent/40 text-white border"
          : "bg-white/[0.04] border-white/[0.08] text-gray-400 border hover:border-white/20"
      }`}
    >
      {selected && <Check className="absolute top-1.5 right-1.5 w-3 h-3 text-accent" />}
      {name}
    </button>
  );
}

function CounterRow({ name, price, count, onPlus, onMinus }: { name: string; price: number; count: number; onPlus: () => void; onMinus: () => void }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
      <div>
        <span className="text-sm font-medium">{name}</span>
        <span className="text-accent text-xs ml-2">{price} ₽</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinus}
          disabled={count === 0}
          aria-label={`Уменьшить ${name}`}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
            count > 0 ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-white/5 text-gray-600"
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-bold">{count}</span>
        <button
          onClick={onPlus}
          aria-label={`Добавить ${name}`}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
