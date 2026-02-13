"use client";

import { create } from "zustand";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (productId, quantity = 1) =>
    set((state) => {
      const found = state.items.find((item) => item.productId === productId);

      if (!found) {
        return { items: [...state.items, { productId, quantity }] };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        ),
      };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  clear: () => set({ items: [] }),
}));
