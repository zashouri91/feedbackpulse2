import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  FolderTree, 
  FileSpreadsheet,
  Mail,
  BarChart,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Locations', href: '/dashboard/locations', icon: Map },
  { name: 'Groups', href: '/dashboard/groups', icon: FolderTree },
  { name: 'Surveys', href: '/dashboard/surveys', icon: FileSpreadsheet },
  { name: 'Signatures', href: '/dashboard/signatures', icon: Mail },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const { isCollapsed, toggleSidebar, setSidebarCollapsed } = useSidebarStore();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 z-40 flex flex-col transition-all duration-300 bg-white",
        "lg:left-0 lg:z-20 lg:w-64",
        isCollapsed ? "-left-64" : "left-0 w-64"
      )}>
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 pt-5">
          <div className="flex items-center justify-between px-4 pb-2">
            <div className="flex items-center">
              <img
                className="h-8 w-8"
                src="/logo.svg"
                alt="FeedbackPulse"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                Feedback
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <nav className="mt-3 flex-1 space-y-0.5 px-3">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-2.5 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0 mr-3",
                        isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}