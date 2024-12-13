import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
}

export function ProtectedRoute({ children, permissions = [] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const { hasAllPermissions } = usePermissions();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permissions.length > 0 && !hasAllPermissions(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}