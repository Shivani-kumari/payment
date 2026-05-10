import { create } from 'zustand';
import { Transaction, PaymentStatus } from '@/types/payment';

interface Store {
  status: PaymentStatus;
  transactions: Transaction[];
  setStatus: (s: PaymentStatus) => void;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  load: () => void;
}

export const useStore = create<Store>((set) => ({
  status: 'IDLE',
  transactions: [],

  setStatus: (s) => set({ status: s }),

  addTransaction: (t) =>
    set((state) => {
      const updated = [t, ...state.transactions];
      localStorage.setItem('txns', JSON.stringify(updated));
      return { transactions: updated };
    }),

  updateTransaction: (id, data) =>
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id === id ? { ...t, ...data } : t
      );
      localStorage.setItem('txns', JSON.stringify(updated));
      return { transactions: updated };
    }),

  load: () => {
    const data = localStorage.getItem('txns');
    if (data) set({ transactions: JSON.parse(data) });
  },
}));