import { User } from '@supabase/supabase-js';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  groupId?: string;
  locationId?: string;
  userId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user_id: string;
  organization_id: string;
  metadata: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  dimension?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: string;
  organizationId: string;
  settings?: Record<string, unknown>;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type AuthUser = User;
