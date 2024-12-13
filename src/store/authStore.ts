import { create } from 'zustand';
import type { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user: User) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (isLoading: boolean) => set({ isLoading })
}));