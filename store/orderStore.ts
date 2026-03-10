import { create } from "zustand";

interface OrderState {
  lastOrderId: number | null;
  setLastOrderId: (id: number) => void;
  clearLastOrder: () => void;
}

const getInitial = (): number | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("lastOrderId");
    return saved ? Number(saved) : null;
  } catch {
    return null;
  }
};

export const useOrderStore = create<OrderState>((set) => ({
  lastOrderId: getInitial(),

  setLastOrderId: (id) => {
    localStorage.setItem("lastOrderId", String(id));
    set({ lastOrderId: id });
  },

  clearLastOrder: () => {
    localStorage.removeItem("lastOrderId");
    set({ lastOrderId: null });
  },
}));
