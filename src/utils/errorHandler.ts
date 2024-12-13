import { useUIStore } from '../store/uiStore';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: Error | AppError, context?: string) {
  const message = error instanceof AppError 
    ? error.message 
    : 'An unexpected error occurred';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  }

  // Show user-friendly message
  useUIStore.getState().showToast('error', message);

  // Re-throw for component error boundaries
  throw error;
}

export function handleApiError(error: any) {
  if (error?.code === 'PGRST301') {
    throw new AppError('Your session has expired. Please sign in again.', 'AUTH_EXPIRED');
  }

  throw new AppError(
    error?.message || 'An unexpected error occurred',
    error?.code
  );
}