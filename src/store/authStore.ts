import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
  isInitialized: boolean;
  isOffline: boolean;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      error: null,
      loading: true,
      isInitialized: false,
      isOffline: false,
      setUser: (user) => {
        console.log('Setting user in store:', user?.id);
        set({ user, error: null, loading: false });
      },
      setError: (error) => {
        console.error('Auth error:', error);
        set({ error, loading: false });
      },
      setLoading: (loading) => set({ loading }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      clearUser: () => {
        console.log('Clearing user from store');
        set({ user: null, error: null, loading: false });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isInitialized: state.isInitialized,
      }),
      // Add storage event listener to sync across tabs
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Rehydrated auth store:', state.user?.id);
        }
      },
    }
  )
);
