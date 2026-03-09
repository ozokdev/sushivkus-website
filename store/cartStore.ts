import { create } from "zustand";

// Тип товара в корзине
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Тип состояния корзины
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isOrderFormOpen: boolean;
  isOrderSuccessOpen: boolean;
  lastOrderNumber: number;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openOrderForm: () => void;
  closeOrderForm: () => void;
  openOrderSuccess: () => void;
  closeOrderSuccess: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isOrderFormOpen: false,
  isOrderSuccessOpen: false,
  lastOrderNumber: 0,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  openOrderForm: () => set({ isOrderFormOpen: true, isOpen: false }),
  closeOrderForm: () => set({ isOrderFormOpen: false }),
  openOrderSuccess: () =>
    set({
      isOrderSuccessOpen: true,
      lastOrderNumber: Math.floor(1000 + Math.random() * 9000),
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
  clearCart: () => set({ items: [] }),

  // Общая сумма
  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  // Общее количество товаров
  getTotalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
