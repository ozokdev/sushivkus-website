"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";

const API_URL = "https://api.sushivkus.ru/api";

function checkAuth(res: Response) {
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    window.location.href = "/admin/login";
    return true;
  }
  return false;
}

interface ToppingItem {
  ID: number;
  name: string;
  category: string;
  price: number;
  is_active: boolean;
  sort_order: number;
}

const CAT_LABELS: Record<string, string> = {
  meat: "Мясо",
  vegetable: "Овощи",
  cheese: "Сыры",
  sauce: "Соусы",
  other: "Другое",
};

const CAT_OPTIONS = Object.entries(CAT_LABELS).map(([value, label]) => ({ value, label }));

export default function PizzaToppingsPage() {
  const [items, setItems] = useState<ToppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", price: 0 });
  const [addForm, setAddForm] = useState({ name: "", category: "meat", price: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const getToken = () => localStorage.getItem("admin_token") || "";

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch(`${API_URL}/pizza-toppings/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        res = await fetch(`${API_URL}/pizza-toppings`);
      }
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
      showToast("Жүктөө катасы", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    if (!addForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/pizza-toppings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: addForm.name, category: addForm.category, price: Number(addForm.price), is_active: true }),
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        showToast("Топпинг кошулду");
        setAddForm({ name: "", category: "meat", price: 0 });
        setIsAdding(false);
        fetchItems();
      } else { showToast("Кошуу катасы", "error"); }
    } catch { showToast("Ката", "error"); }
    setSaving(false);
  };

  const handleEdit = (item: ToppingItem) => {
    setEditId(item.ID);
    setEditForm({ name: item.name, category: item.category, price: item.price });
  };

  const handleSave = async () => {
    if (!editId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/pizza-toppings/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: editForm.name, category: editForm.category, price: Number(editForm.price) }),
      });
      if (checkAuth(res)) return;
      if (res.ok) { showToast("Сакталды"); setEditId(null); fetchItems(); }
      else { const err = await res.json().catch(() => null); showToast(err?.error || `Ката: ${res.status}`, "error"); }
    } catch { showToast("Ката", "error"); }
    setSaving(false);
  };

  const handleToggle = async (item: ToppingItem) => {
    try {
      const res = await fetch(`${API_URL}/pizza-toppings/${item.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (checkAuth(res)) return;
      fetchItems();
    } catch { showToast("Ката", "error"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Чын эле жок кылабызбы?")) return;
    try {
      const res = await fetch(`${API_URL}/pizza-toppings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (checkAuth(res)) return;
      showToast("Жок кылынды");
      fetchItems();
    } catch { showToast("Ката", "error"); }
  };

  const grouped = Object.entries(CAT_LABELS).map(([cat, label]) => ({
    cat, label, items: items.filter((i) => i.category === cat),
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Пицца Топпинги</h1>
          <p className="text-gray-500 text-sm mt-1">Кошумча ингредиенттерди башкаруу</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/80 rounded-xl text-white font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {/* Добавить */}
      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="bg-white/[0.03] border border-accent/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Новый топпинг</h3>
                <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="text" placeholder="Название" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm" />
                <select value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className="bg-[#1a1a1a] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white">
                  {CAT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
                <input type="number" placeholder="Цена (₽)" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })} className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm" />
              </div>
              <button onClick={handleAdd} disabled={saving || !addForm.name.trim()} className="mt-3 flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Добавить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.cat}>
              <h3 className="font-semibold text-sm text-gray-400 mb-2 uppercase tracking-wide">{group.label}</h3>
              <div className="space-y-1">
                {group.items.length === 0 ? (
                  <p className="text-gray-600 text-sm py-2 px-3">Пусто</p>
                ) : (
                  group.items.map((item) => (
                    <div key={item.ID} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${item.is_active ? "bg-white/[0.03] border-white/[0.08]" : "bg-white/[0.01] border-white/[0.04] opacity-50"}`}>
                      {editId === item.ID ? (
                        <>
                          <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm" />
                          <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-20 bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm" />
                          <span className="text-gray-500 text-xs">₽</span>
                          <button onClick={handleSave} disabled={saving} className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setEditId(null)} className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.name}</span>
                          <span className="text-accent text-sm font-semibold">{item.price} ₽</span>
                          <button onClick={() => handleToggle(item)} className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {item.is_active ? "ON" : "OFF"}
                          </button>
                          <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(item.ID)} className="p-1.5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl text-sm font-medium shadow-lg z-50 ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
