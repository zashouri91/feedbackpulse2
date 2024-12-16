import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermissions } from '../../hooks/usePermissions';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Permission } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
}

export function ProtectedRoute({ children, permissions = [] }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isInitialized } = useAuthStore();
  const { hasAllPermissions } = usePermissions();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permissions.length > 0 && !hasAllPermissions(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}