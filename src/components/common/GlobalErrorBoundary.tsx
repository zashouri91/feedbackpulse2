import React, { Component, ErrorInfo } from 'react';
import * as Sentry from '@sentry/react';
import { Toast } from './Toast';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Create a functional component for the error UI
function ErrorUI({ error }: { error: Error }) {
  const showToast = useUIStore(state => state.showToast);
  const user = useAuthStore(state => state.user);

  React.useEffect(() => {
    // Log error to Sentry with user context
    Sentry.withScope(scope => {
      scope.setUser({
        id: user?.id,
        email: user?.email,
        organization: user?.organization_id,
      });
      Sentry.captureException(error);
    });

    // Show error toast
    showToast('error', 'An unexpected error occurred. Our team has been notified.');
  }, [error, showToast, user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Oops! Something went wrong</h2>
        <p className="mb-4 text-gray-600">We've been notified and are working to fix the issue.</p>
        <div className="mb-4 rounded bg-gray-50 p-4 text-left">
          <p className="break-all font-mono text-sm text-gray-600">{error.message}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global error:', error);
    
    // Log error to Sentry
    Sentry.withScope(scope => {
      scope.setExtra('errorInfo', errorInfo);
      Sentry.captureException(error);
    });
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError && error) {
      return <ErrorUI error={error} />;
    }

    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }
}

// Separate Toast container component to use hooks
function ToastContainer() {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
