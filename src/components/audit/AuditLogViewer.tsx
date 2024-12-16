import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { useAuditLog } from '../../hooks/useAuditLog';
import { AuditLogTable } from './AuditLogTable';

interface Filters {
  action: string;
  userId: string;
  startDate: string;
  endDate: string;
}

export function AuditLogViewer() {
  const [filters, setFilters] = React.useState<Filters>({
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const { data: logs, isLoading, error, execute } = useAuditLog();

  const fetchLogs = React.useCallback(async () => {
    let query = supabase
      .from('audit_logs')
      .select(
        `
        *,
        user:profiles(
          id,
          email,
          full_name,
          role
        )
      `
      )
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

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="rounded-lg bg-white py-12 text-center">
        <Search className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading audit logs</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
        <div className="mt-6">
          <button onClick={fetchLogs}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow">
        <Input
          placeholder="Filter by action..."
          value={filters.action}
          onChange={e => handleFilterChange('action', e.target.value)}
          startIcon={<Search className="h-5 w-5 text-gray-400" />}
          className="flex-1"
        />
        <Input
          type="date"
          value={filters.startDate}
          onChange={e => handleFilterChange('startDate', e.target.value)}
          className="w-auto"
        />
        <Input
          type="date"
          value={filters.endDate}
          onChange={e => handleFilterChange('endDate', e.target.value)}
          className="w-auto"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : logs?.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <AuditLogTable logs={logs} />
      )}
    </div>
  );
}
