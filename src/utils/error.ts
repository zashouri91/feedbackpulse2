import { useUIStore } from '../store/uiStore';

export function handleError(error: any, customMessage?: string) {
  const message = customMessage || error?.message || 'An unexpected error occurred';
  useUIStore.getState().showToast('error', message);

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  throw error;
}

export function handleApiError(error: any) {
  if (error?.code === 'PGRST301') {
    return handleError(error, 'Unauthorized. Please sign in.');
  }

  return handleError(error);
}
