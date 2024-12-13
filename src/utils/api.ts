import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/uiStore';

export async function handleApiError(error: any) {
  const message = error?.message || 'An unexpected error occurred';
  useUIStore.getState().showToast('error', message);
  throw error;
}

export async function handleApiResponse<T>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    if (!data) throw new Error('No data returned');
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export const api = {
  auth: {
    signIn: (email: string, password: string) =>
      handleApiResponse(
        supabase.auth.signInWithPassword({ email, password })
      ),
    signUp: (email: string, password: string) =>
      handleApiResponse(
        supabase.auth.signUp({ email, password })
      ),
    signOut: () =>
      handleApiResponse(
        supabase.auth.signOut()
      )
  },
  // Add other API endpoints here
};