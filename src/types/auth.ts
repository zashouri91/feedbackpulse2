export type Role = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  groupId: string | null;
  locationId: string | null;
  organizationId: string;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type Permission =
  // ... existing permissions ...
  // Analytics
  | 'analytics.view'
  | 'analytics.export'
  | 'analytics.view.detailed'    // For advanced metrics
  | 'analytics.view.financial'   // For cost-related metrics
  | 'analytics.customize'        // For customizing dashboards
  | 'analytics.share';          // For sharing reports

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    // ... existing permissions ...
    'analytics.view',
    'analytics.export',
    'analytics.view.detailed',
    'analytics.view.financial',
    'analytics.customize',
    'analytics.share'
  ],
  manager: [
    // ... existing permissions ...
    'analytics.view',
    'analytics.export',
    'analytics.view.detailed',
    'analytics.share'
  ],
  user: [
    // ... existing permissions ...
    'analytics.view'  // Basic analytics only
  ]
};