import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Toast } from './Toast';
import { useUIStore } from '../../store/uiStore';

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);

  return (
    <ErrorBoundary>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ErrorBoundary>
  );
}