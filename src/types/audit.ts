import type { User } from './auth';

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'survey.create'
  | 'survey.update'
  | 'survey.delete'
  | 'feedback.submit'
  | 'signature.create'
  | 'signature.update'
  | 'signature.delete'
  | 'settings.update';

export interface AuditLog {
  id: string;
  action: AuditAction;
  userId: string;
  organizationId: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogWithUser extends AuditLog {
  user: User;
}
