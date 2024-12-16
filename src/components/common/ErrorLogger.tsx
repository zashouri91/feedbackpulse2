import { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';

interface ErrorLoggerProps {
  error: Error;
  componentStack?: string;
}

export function ErrorLogger({ error, componentStack }: ErrorLoggerProps) {
  const showToast = useUIStore(state => state.showToast);

  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
      if (componentStack) {
        console.error('Component Stack:', componentStack);
      }
    }

    // Show user-friendly error message
    showToast('error', 'An unexpected error occurred. Please try again.');

    // Here you could add integration with error reporting services
    // like Sentry, LogRocket, etc.
  }, [error, componentStack, showToast]);

  return null;
}
