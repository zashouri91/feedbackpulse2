import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearUser: () => void;
  retryAuth: () => Promise<void>;
  isOffline: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      error: null,
      loading: true,
      isInitialized: false,
      isOffline: false,
      setUser: user => set({ user, error: null }),
      setError: error => {
        console.error('Auth error:', error);
        set({ error, loading: false });
      },
      setLoading: loading => set({ loading }),
      setInitialized: initialized => set({ isInitialized: initialized }),
      clearUser: () => set({ user: null, error: null }),
      retryAuth: async () => {
        const state = get();
        if (state.error) {
          set({ loading: true, error: null });
          try {
            // Attempt to restore session from localStorage
            const savedUser = localStorage.getItem('auth-user');
            if (savedUser) {
              const user = JSON.parse(savedUser);
              set({ user, loading: false, error: null });
            } else {
              set({ loading: false });
            }
          } catch (error) {
            set({
              error: 'Failed to restore session',
              loading: false,
            });
          }
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: state => ({
        user: state.user,
      }),
    }
  )
);
