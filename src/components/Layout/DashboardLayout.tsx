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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      <main className={cn(
        "lg:pl-64 transition-all duration-300",
        isCollapsed && "lg:pl-0"
      )}>
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}