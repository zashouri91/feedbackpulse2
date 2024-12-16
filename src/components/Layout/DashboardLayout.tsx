import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { cn } from '../../utils/cn';

export default function DashboardLayout() {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const { isCollapsed } = useSidebarStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Sidebar />
      <main className={cn('transition-all duration-300 lg:pl-64', isCollapsed && 'lg:pl-0')}>
        <div className="mx-auto max-w-7xl p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
