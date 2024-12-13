import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Activity, Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { AuditLogWithUser } from '../../types/audit';
import { supabase } from '../../lib/supabase';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    userId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('audit_logs')
          .select(`
            *,
            user:profiles(*)
          `)
          .order('created_at', { ascending: false });

        if (filters.action) {
          query = query.eq('action', filters.action);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }

        const { data, error } = await query;
        if (error) throw error;
        setLogs(data || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [filters]);

  const renderActionBadge = (action: string) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      survey: 'bg-green-100 text-green-800',
      feedback: 'bg-purple-100 text-purple-800',
      signature: 'bg-yellow-100 text-yellow-800',
      settings: 'bg-gray-100 text-gray-800'
    };

    const type = action.split('.')[0] as keyof typeof colors;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type]}`}>
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            type="text"
            placeholder="Search logs..."
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          />
          
          <Select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            <option value="">All Actions</option>
            <option value="user">User Actions</option>
            <option value="survey">Survey Actions</option>
            <option value="feedback">Feedback Actions</option>
            <option value="signature">Signature Actions</option>
          </Select>

          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setFilters({
              action: '',
              userId: '',
              startDate: '',
              endDate: ''
            })}
          >
            <Filter className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs</h3>
          <p className="mt-1 text-sm text-gray-500">
            No audit logs found for the selected filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.createdAt), 'PPpp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderActionBadge(log.action)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}