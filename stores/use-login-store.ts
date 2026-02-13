"use client";

import { create } from "zustand";

type LoginStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
