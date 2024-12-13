import { create } from 'zustand';
import type { ToastType } from '../components/common/Toast';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface UIState {
  isLoading: boolean;
  toasts: Toast[];
  setLoading: (isLoading: boolean) => void;
  showToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  toasts: [],
  setLoading: (isLoading) => set({ isLoading }),
  showToast: (type, message) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), type, message }
      ]
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}));