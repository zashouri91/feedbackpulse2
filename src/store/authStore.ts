import { create } from 'zustand';
import type { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
  error: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  isAuthenticated: false,
  error: null,
  setUser: (user) => set({ 
    user, 
    isLoading: false, 
    error: null,
    isInitialized: true,
    isAuthenticated: !!user
  }),
  clearUser: () => set({ 
    user: null, 
    isLoading: false,
    error: null,
    isInitialized: true,
    isAuthenticated: false
  }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error, isLoading: false }),
  initialize: () => set({ isInitialized: true, isLoading: false })
}));