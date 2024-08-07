import { create } from "zustand";

type PaymentStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const usePayment = create<PaymentStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
