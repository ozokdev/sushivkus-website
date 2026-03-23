import { create } from "zustand";
import { menuItems as staticItems, categories as staticCategories, type MenuItem } from "@/data/menu";

interface ApiMenuItem {
  ID: number;
  name: string;
  description: string;
  price: number;
  price4: number;
  old_price: number;
  image: string;
  category: string;
  weight: string;
  pieces: string;
  is_popular: boolean;
  is_active: boolean;
  badge: string;
}

interface ApiCategory {
  ID: number;
  slug: string;
  name: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

function mapApiItem(item: ApiMenuItem): MenuItem {
  return {
    id: item.ID,
    name: item.name,
    description: item.description,
    price: item.price,
    price4: item.price4 || undefined,
    oldPrice: item.old_price || undefined,
    image: item.image,
    category: item.category as MenuItem["category"],
    weight: item.weight || undefined,
    pieces: item.pieces || undefined,
    isPopular: item.is_popular,
    badge: (item.badge || undefined) as MenuItem["badge"],
  };
}

export interface CategoryDisplay {
  id: string;
  name: string;
  icon: string;
}

interface MenuState {
  items: MenuItem[];
  categories: CategoryDisplay[];
  loading: boolean;
  fetched: boolean;
  lastFetch: number;
  fetchMenu: () => Promise<void>;
}

const CACHE_TTL = 300_000; // 5 мүнөт кэш

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  categories: staticCategories,
  loading: false,
  fetched: false,
  lastFetch: 0,

  fetchMenu: async () => {
    const now = Date.now();
    if (get().fetched && now - get().lastFetch < CACHE_TTL) return;
    set({ loading: true });
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch("https://api.sushivkus.ru/api/menu"),
        fetch("https://api.sushivkus.ru/api/categories"),
      ]);

      // Категориялар
      if (catRes.ok) {
        const catData: ApiCategory[] = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          const activeCats = catData.filter((c) => c.is_active);
          const mapped: CategoryDisplay[] = [
            { id: "all", name: "Все", icon: "🍱" },
            ...activeCats.map((c) => ({ id: c.slug, name: c.name, icon: c.icon || "📋" })),
          ];
          set({ categories: mapped });
        }
      }

      // Меню
      if (!menuRes.ok) throw new Error("API error");
      const json = await menuRes.json();
      const data: ApiMenuItem[] = Array.isArray(json) ? json : json.items || [];
      if (data.length > 0) {
        set({ items: data.map(mapApiItem), fetched: true, loading: false, lastFetch: now });
      } else {
        set({ items: staticItems, fetched: true, loading: false, lastFetch: now });
      }
    } catch {
      if (get().items.length === 0) {
        set({ items: staticItems, loading: false });
      } else {
        set({ loading: false });
      }
    }
  },
}));
