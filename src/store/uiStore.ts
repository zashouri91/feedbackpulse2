import { create } from 'zustand';
import type { ToastType } from '../components/common/Toast';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  createdAt: number;
}

interface UIState {
  isLoading: boolean;
  toasts: Toast[];
  globalError: string | null;
  setLoading: (isLoading: boolean) => void;
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  setGlobalError: (error: string | null) => void;
  clearToasts: () => void;
}

const DEFAULT_TOAST_DURATION = 5000; // 5 seconds

export const useUIStore = create<UIState>((set, get) => ({
  isLoading: false,
  toasts: [],
  globalError: null,
  setLoading: isLoading => set({ isLoading }),
  showToast: (type, message, duration = DEFAULT_TOAST_DURATION) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = {
      id,
      type,
      message,
      duration,
      createdAt: Date.now(),
    };

    set(state => ({
      toasts: [...state.toasts, toast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  removeToast: id =>
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    })),
  setGlobalError: error => set({ globalError: error }),
  clearToasts: () => set({ toasts: [] }),
}));
