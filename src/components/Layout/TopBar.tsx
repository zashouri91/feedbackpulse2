import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function TopBar() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Feedback System</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <button className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <User className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}