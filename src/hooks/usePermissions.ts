import { useAuthStore } from '../store/authStore';
import { Permission, ROLE_PERMISSIONS } from '../types/auth';

export function usePermissions() {
  const { user } = useAuthStore();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Use custom permissions if defined
    if (user.permissions) {
      return user.permissions.includes(permission);
    }
    
    // Fall back to role-based permissions
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(hasPermission);
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(hasPermission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}