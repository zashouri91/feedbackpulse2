import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      error: null,
      loading: true,
      setUser: (user) => set({ user, error: null }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),
      clearUser: () => set({ user: null, error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Only persist the user data
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          console.log('Auth store: Getting from storage:', name, str ? 'exists' : 'not found');
          return str;
        },
        setItem: (name, value) => {
          console.log('Auth store: Setting in storage:', name);
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          console.log('Auth store: Removing from storage:', name);
          localStorage.removeItem(name);
        },
      },
    }
  )
);