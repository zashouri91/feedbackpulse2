import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuditLogEntry, FilterOptions } from '../types/common';
import { useAuthStore } from '../store/authStore';

interface AuditLogResponse {
  data: AuditLogEntry[];
  count: number;
}

export function useAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const user = useAuthStore(state => state.user);

  const fetchLogs = async (filters: FilterOptions = {}): Promise<AuditLogResponse> => {
    const {
      startDate,
      endDate,
      userId,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = filters;

    let query = supabase.from('audit_logs').select('*', { count: 'exact' });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }

    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data as AuditLogEntry[],
      count: count || 0,
    };
  };

  const logAction = async (
    action: string,
    metadata: Record<string, unknown> = {}
  ): Promise<void> => {
    if (!user?.id) {
      console.warn('Cannot log action: No user is authenticated');
      return;
    }

    try {
      // First, get the user's organization_id if not already in the user object
      let organizationId = user.organizationId;
      if (!organizationId) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error(`Failed to get user's organization: ${profileError.message}`);
        }
        organizationId = profile.organization_id;
      }

      const { error } = await supabase.from('audit_logs').insert([
        {
          action,
          user_id: user.id,
          organization_id: organizationId,
          metadata,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error logging action:', err);
      // Don't throw the error, just log it - we don't want audit log failures to break the app
      console.error('Failed to log audit action:', err);
    }
  };

  useEffect(() => {
    const fetchInitialLogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetchLogs();
        setLogs(response.data);
        setTotalCount(response.count);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch logs'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialLogs();
  }, []);

  return {
    logs,
    isLoading,
    error,
    totalCount,
    fetchLogs,
    logAction,
  };
}
