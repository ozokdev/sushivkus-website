import { create } from "zustand";
import { menuItems as staticItems, type MenuItem } from "@/data/menu";

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

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  fetched: boolean;
  lastFetch: number;
  fetchMenu: () => Promise<void>;
}

const CACHE_TTL = 60_000; // 1 мүнөт кэш

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  loading: false,
  fetched: false,
  lastFetch: 0,

  fetchMenu: async () => {
    const now = Date.now();
    // Кэш 1 мүнөт — андан кийин кайра fetch кылат
    if (get().fetched && now - get().lastFetch < CACHE_TTL) return;
    set({ loading: true });
    try {
      const res = await fetch("https://api.sushivkus.ru/api/menu");
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      const data: ApiMenuItem[] = Array.isArray(json) ? json : json.items || [];
      if (data.length > 0) {
        set({ items: data.map(mapApiItem), fetched: true, loading: false, lastFetch: now });
      } else {
        // API бош кайтса — fallback
        set({ items: staticItems, fetched: true, loading: false, lastFetch: now });
      }
    } catch {
      // API ката болсо — fallback
      if (get().items.length === 0) {
        set({ items: staticItems, loading: false });
      } else {
        set({ loading: false });
      }
    }
  },
}));
