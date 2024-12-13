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