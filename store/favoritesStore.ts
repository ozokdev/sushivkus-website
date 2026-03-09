import { create } from "zustand";

interface FavoritesState {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clear: () => void;
}

// Загрузка из localStorage
const getInitial = (): number[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: getInitial(),

  toggle: (id) =>
    set((state) => {
      const exists = state.ids.includes(id);
      const newIds = exists
        ? state.ids.filter((i) => i !== id)
        : [...state.ids, id];
      localStorage.setItem("favorites", JSON.stringify(newIds));
      return { ids: newIds };
    }),

  isFavorite: (id) => get().ids.includes(id),

  clear: () => {
    localStorage.removeItem("favorites");
    set({ ids: [] });
  },
}));
