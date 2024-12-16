import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermissions } from '../../hooks/usePermissions';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useUIStore } from '../../store/uiStore';
import type { Permission } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
}

export function ProtectedRoute({ children, permissions = [] }: ProtectedRouteProps) {
  const { user, loading, error, retryAuth } = useAuthStore();
  const { hasAllPermissions } = usePermissions();
  const location = useLocation();
  const showToast = useUIStore(state => state.showToast);

  useEffect(() => {
    if (error) {
      showToast('error', `Authentication error: ${error}`);
      console.error('Auth error:', error);
    }
  }, [error, showToast]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading your session...</p>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Session Error</h2>
          <p className="mb-4 text-gray-600">There was a problem loading your session.</p>
          <button
            onClick={() => retryAuth()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions if specified
  if (permissions.length > 0 && !hasAllPermissions(permissions)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
