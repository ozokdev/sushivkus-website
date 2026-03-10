import { create } from "zustand";
import { menuItems as staticItems, type MenuItem } from "@/data/menu";

interface ApiMenuItem {
  ID: number;
  name: string;
  description: string;
  price: number;
  price4: number;
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
  fetchMenu: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: staticItems,
  loading: false,
  fetched: false,

  fetchMenu: async () => {
    if (get().fetched) return;
    set({ loading: true });
    try {
      const res = await fetch("https://api.sushivkus.ru/api/menu");
      if (!res.ok) throw new Error("API error");
      const data: ApiMenuItem[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        set({ items: data.map(mapApiItem), fetched: true, loading: false });
      } else {
        set({ fetched: true, loading: false });
      }
    } catch {
      set({ fetched: true, loading: false });
    }
  },
}));
