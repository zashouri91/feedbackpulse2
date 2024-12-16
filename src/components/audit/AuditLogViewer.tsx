import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Activity, Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import type { Database } from '../../types/database';

type AuditLog = Database['public']['Tables']['audit_logs']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'] | null;
};

interface Filters {
  action: string;
  userId: string;
  startDate: string;
  endDate: string;
}

export function AuditLogViewer() {
  const [filters, setFilters] = useState<Filters>({
    action: '',
    userId: '',
    startDate: '',
    endDate: ''
  });

  const { data: logs, isLoading, error, execute } = useSupabaseQuery<'audit_logs'>('audit_logs', {
    showToast: true
  });

  const fetchLogs = useCallback(async () => {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:profiles(
          id,
          email,
          full_name,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.action?.trim()) {
      query = query.eq('action', filters.action.trim());
    }
    if (filters.userId?.trim()) {
      query = query.eq('user_id', filters.userId.trim());
    }
    if (filters.startDate) {
      query = query.gte('created_at', new Date(filters.startDate).toISOString());
    }
    if (filters.endDate) {
      query = query.lte('created_at', new Date(filters.endDate).toISOString());
    }

    return execute(() => query);
  }, [filters, execute]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <Activity className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading audit logs</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
        <div className="mt-6">
          <Button onClick={fetchLogs}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
        <Input
          placeholder="Filter by action..."
          value={filters.action}
          onChange={(e) => handleFilterChange('action', e.target.value)}
          startIcon={<Search className="h-5 w-5 text-gray-400" />}
          className="flex-1"
        />
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="w-auto"
        />
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          className="w-auto"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : logs?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {logs?.map((log) => (
              <li key={log.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {log.action}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {format(new Date(log.created_at), 'PPpp')}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {log.user?.full_name || log.user?.email || 'Unknown User'}
                    </p>
                  </div>
                </div>
                {log.details && (
                  <div className="mt-2 text-sm text-gray-500">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}