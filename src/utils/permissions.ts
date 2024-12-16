import type { Permission, Role } from '../types/auth';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'analytics.view',
    'analytics.export',
    'analytics.view.detailed',
    'analytics.view.financial',
    'analytics.customize',
    'analytics.share',
    'users.manage',
    'surveys.manage',
    'organization.manage',
  ],
  manager: [
    'analytics.view',
    'analytics.export',
    'analytics.view.detailed',
    'analytics.share',
    'surveys.create',
    'surveys.edit',
    'users.view',
  ],
  user: ['analytics.view', 'surveys.respond', 'profile.edit'],
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}
