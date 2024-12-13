import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  FolderTree, 
  FileSpreadsheet,
  Mail,
  BarChart
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Locations', href: '/locations', icon: Map },
  { name: 'Groups', href: '/groups', icon: FolderTree },
  { name: 'Surveys', href: '/surveys', icon: FileSpreadsheet },
  { name: 'Signatures', href: '/signatures', icon: Mail },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
];

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}