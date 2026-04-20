import { create } from "zustand";
import { useSettingsStore } from "./settingsStore";

// Тип товара в корзине
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string; // WOK конструктор опциялары
}

// Минималдуу заказ — settingsStore'дон алынат
export function getMinOrder(): number {
  return useSettingsStore.getState().settings.minOrderAmount;
}

export const PROMO_CODES: Record<string, number> = {
  VKUS20: 20,
  SUSHI10: 10,
  WELCOME: 15,
};

// Тип состояния корзины
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isOrderFormOpen: boolean;
  isOrderSuccessOpen: boolean;
  lastOrderNumber: number;
  appliedPromo: string | null;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openOrderForm: () => void;
  closeOrderForm: () => void;
  openOrderSuccess: (orderNumber?: number) => void;
  closeOrderSuccess: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  getDiscount: () => number;
  getDiscountAmount: () => number;
  getFinalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isOrderFormOpen: false,
  isOrderSuccessOpen: false,
  lastOrderNumber: 0,
  appliedPromo: null,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  openOrderForm: () => set({ isOrderFormOpen: true, isOpen: false }),
  closeOrderForm: () => set({ isOrderFormOpen: false }),
  openOrderSuccess: (orderNumber?: number) =>
    set({
      isOrderSuccessOpen: true,
      lastOrderNumber: orderNumber || Math.floor(1000 + Math.random() * 9000),
    }),
  closeOrderSuccess: () => set({ isOrderSuccessOpen: false }),

  // Добавить товар в корзину
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  // Удалить товар из корзины
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  // Изменить количество товара
  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== id) };
      }
      return {
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }),

  // Очистить корзину
  clearCart: () => set({ items: [], appliedPromo: null }),

  // Общая сумма
  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  // Общее количество товаров
  getTotalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  // Промокод
  applyPromo: (code: string) => {
    const upper = code.trim().toUpperCase();
    if (PROMO_CODES[upper]) {
      set({ appliedPromo: upper });
      return true;
    }
    return false;
  },

  removePromo: () => set({ appliedPromo: null }),

  getDiscount: () => {
    const promo = get().appliedPromo;
    return promo ? PROMO_CODES[promo] || 0 : 0;
  },

  getDiscountAmount: () => {
    const total = get().getTotalPrice();
    const discount = get().getDiscount();
    return Math.round(total * (discount / 100));
  },

  getFinalPrice: () => {
    return get().getTotalPrice() - get().getDiscountAmount();
  },
}));
