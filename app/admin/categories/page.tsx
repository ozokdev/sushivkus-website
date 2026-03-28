"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  GripVertical,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Loader2,
  ImageIcon,
  Upload,
} from "lucide-react";

const API_URL = "https://api.sushivkus.ru/api";

const EMOJI_GROUPS = [
  { label: "🍣 Суши и роллы", emojis: ["🍣", "🍱", "🍥", "🥢", "🍙", "🍘", "🥟", "🫕", "🍤", "🦐", "🦑", "🐟", "🐙", "🦞", "🦀", "🦪"] },
  { label: "🍕 Пицца и фастфуд", emojis: ["🍕", "🍔", "🌮", "🌯", "🥙", "🫔", "🌭", "🥪", "🧆"] },
  { label: "🍜 Супы и горячее", emojis: ["🍜", "🍲", "🥘", "🍛", "🫠", "🥣", "🍝"] },
  { label: "🥗 Салаты и овощи", emojis: ["🥗", "🥒", "🥬", "🥦", "🫒", "🥑", "🍅", "🌽", "🥕"] },
  { label: "🍰 Десерты", emojis: ["🍰", "🧁", "🍩", "🍪", "🎂", "🍫", "🍮", "🍦", "🧇", "🥞"] },
  { label: "🥤 Напитки", emojis: ["🥤", "☕", "🍵", "🧃", "🥛", "🍹", "🧋", "🍺", "🍷", "🥂"] },
  { label: "🥩 Мясо", emojis: ["🥩", "🍗", "🍖", "🥓", "🥚", "🧀"] },
  { label: "🍟 Закуски", emojis: ["🍟", "🥨", "🥯", "🧈", "🫓", "🥐"] },
  { label: "🧂 Соусы", emojis: ["🧂", "🫙", "🍶", "🥫", "🫗"] },
  { label: "⭐ Другое", emojis: ["🔥", "⭐", "💎", "🆕", "🎉", "❤️", "✨", "🏆", "👑", "🎯", "💥", "🌟"] },
];

function EmojiPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-12 h-10 bg-white/5 border border-white/10 rounded-lg text-2xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
      >
        {value || "📋"}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-12 left-0 z-50 bg-[#1a1a1e] border border-white/10 rounded-2xl p-4 shadow-2xl w-[380px] max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white font-semibold">Выберите иконку</p>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white text-xs">✕</button>
            </div>
            {EMOJI_GROUPS.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="text-[11px] text-gray-500 font-medium mb-1.5">{group.label}</p>
                <div className="grid grid-cols-8 gap-1">
                  {group.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => { onChange(emoji); setOpen(false); }}
                      className={`w-10 h-10 flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${
                        value === emoji ? "bg-accent/20 ring-2 ring-accent" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 mt-2">
              <p className="text-[11px] text-gray-500 mb-1.5">Или введите свой эмодзи</p>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Вставьте эмодзи..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-2xl text-center focus:outline-none focus:border-accent/40"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ImageUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.path);
      }
    } catch {
      // ignore
    }
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
        }}
      />
      {value ? (
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 group">
          <Image
            src={`https://sushivkus.ru${value}`}
            alt="category"
            fill
            className="object-cover"
            unoptimized
          />
          <div
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-5 h-5 text-white" />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-16 h-16 rounded-xl border-2 border-dashed border-white/20 hover:border-accent/50 flex items-center justify-center transition-colors cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      )}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Удалить
        </button>
      )}
    </div>
  );
}

interface CategoryItem {
  ID: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  min_price: number;
  sort_order: number;
  is_active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "", icon: "", image: "", min_price: 0, description: "" });
  const [addForm, setAddForm] = useState({ name: "", slug: "", icon: "", image: "", min_price: 0, description: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const getToken = () => localStorage.getItem("admin_token") || "";

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch {
      showToast("Жүктөө катасы", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async () => {
    if (!addForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: addForm.name,
          slug: addForm.slug || addForm.name.toLowerCase().replace(/\s+/g, "_"),
          description: addForm.description || "",
          icon: addForm.icon || "📋",
          image: addForm.image || "",
          min_price: addForm.min_price || 0,
          sort_order: categories.length,
          is_active: true,
        }),
      });
      if (res.ok) {
        showToast("Категория кошулду");
        setAddForm({ name: "", slug: "", icon: "", image: "", min_price: 0, description: "" });
        setIsAdding(false);
        fetchCategories();
      } else {
        showToast("Кошуу катасы", "error");
      }
    } catch {
      showToast("Сервер катасы", "error");
    }
    setSaving(false);
  };

  const handleUpdate = async (cat: CategoryItem) => {
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/categories/${cat.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          slug: editForm.slug || cat.slug,
          description: editForm.description || "",
          icon: editForm.icon || cat.icon,
          image: editForm.image,
          min_price: editForm.min_price || 0,
          sort_order: cat.sort_order,
          is_active: cat.is_active,
        }),
      });
      if (res.ok) {
        showToast("Категория сакталды");
        setEditId(null);
        fetchCategories();
      } else {
        showToast("Сактоо катасы", "error");
      }
    } catch {
      showToast("Сервер катасы", "error");
    }
    setSaving(false);
  };

  const handleToggle = async (cat: CategoryItem) => {
    try {
      await fetch(`${API_URL}/categories/${cat.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: cat.name,
          slug: cat.slug,
          sort_order: cat.sort_order,
          is_active: !cat.is_active,
        }),
      });
      setCategories((prev) =>
        prev.map((c) => (c.ID === cat.ID ? { ...c, is_active: !c.is_active } : c))
      );
    } catch {
      showToast("Ката болду", "error");
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (!confirm(`"${cat.name}" категориясын өчүрөсүзбү?`)) return;
    try {
      const res = await fetch(`${API_URL}/categories/${cat.ID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        showToast("Категория өчүрүлдү");
        fetchCategories();
      } else {
        showToast("Өчүрүү катасы", "error");
      }
    } catch {
      showToast("Сервер катасы", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newCats = [...categories];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newCats.length) return;

    [newCats[index], newCats[swapIndex]] = [newCats[swapIndex], newCats[index]];
    newCats.forEach((c, i) => (c.sort_order = i));
    setCategories(newCats);

    try {
      await Promise.all(
        [newCats[index], newCats[swapIndex]].map((c) =>
          fetch(`${API_URL}/categories/${c.ID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              name: c.name,
              slug: c.slug,
              sort_order: c.sort_order,
              is_active: c.is_active,
            }),
          })
        )
      );
    } catch {
      fetchCategories();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Категории</h1>
          <p className="text-gray-500 text-sm mt-1">
            Управление категориями меню
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setAddForm({ name: "", slug: "", icon: "", image: "", min_price: 0, description: "" });
          }}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#111] border border-accent/30 rounded-2xl p-5 overflow-hidden"
          >
            <h3 className="font-semibold mb-4">Новая категория</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Название</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Напитки"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Slug (ID)</label>
                  <input
                    type="text"
                    value={addForm.slug}
                    onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                    placeholder="drinks (авто)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/40"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Иконка</label>
                  <EmojiPicker value={addForm.icon} onChange={(v) => setAddForm({ ...addForm, icon: v })} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Фото категории</label>
                <ImageUploader value={addForm.image} onChange={(v) => setAddForm({ ...addForm, image: v })} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm"
              >
                Отмена
              </button>
              <button
                onClick={handleAdd}
                disabled={!addForm.name.trim() || saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Сохранить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.ID}
              layout
              className={`bg-[#111] border rounded-xl p-4 transition-opacity ${
                cat.is_active ? "border-white/10" : "border-white/5 opacity-50"
              }`}
            >
              {editId === cat.ID ? (
                /* === EDIT MODE === */
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => handleMove(index, "up")} disabled={index === 0} className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleMove(index, "down")} disabled={index === categories.length - 1} className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
                    </div>
                    <EmojiPicker value={editForm.icon} onChange={(v) => setEditForm({ ...editForm, icon: v })} />
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/40"
                    />
                    <input
                      type="text"
                      value={editForm.slug}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                      placeholder="slug"
                      className="w-36 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-accent/40"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">от</span>
                      <input
                        type="number"
                        value={editForm.min_price || ""}
                        onChange={(e) => setEditForm({ ...editForm, min_price: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-accent font-medium focus:outline-none focus:border-accent/40"
                      />
                      <span className="text-xs text-gray-500">₽</span>
                    </div>
                    <button onClick={() => setEditId(null)} className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"><X className="w-4 h-4" /></button>
                    <button onClick={() => handleUpdate(cat)} disabled={saving} className="p-1.5 text-accent hover:text-white rounded-lg hover:bg-accent/10">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="pl-10 space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Описание (SEO текст на странице категории)</label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Выгодные сеты роллов с доставкой..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Фото категории</label>
                      <ImageUploader value={editForm.image} onChange={(v) => setEditForm({ ...editForm, image: v })} />
                    </div>
                  </div>
                </div>
              ) : (
                /* === VIEW MODE === */
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleMove(index, "up")} disabled={index === 0} className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleMove(index, "down")} disabled={index === categories.length - 1} className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
                  </div>

                  <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />

                  {/* Thumbnail */}
                  {cat.image ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      <Image src={`https://sushivkus.ru${cat.image}`} alt={cat.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{cat.icon || "📋"}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon || "📋"}</span>
                      <span className="font-medium text-sm">{cat.name}</span>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{cat.slug}</span>
                      {cat.min_price > 0 && (
                        <span className="text-xs text-accent font-medium">от {cat.min_price} ₽</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditId(cat.ID);
                        setEditForm({ name: cat.name, slug: cat.slug, icon: cat.icon || "📋", image: cat.image || "", min_price: cat.min_price || 0, description: cat.description || "" });
                      }}
                      className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggle(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        cat.is_active
                          ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400"
                          : "bg-red-500/10 text-red-400 hover:bg-green-500/10 hover:text-green-400"
                      }`}
                    >
                      {cat.is_active ? "ON" : "OFF"}
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-red-500/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
