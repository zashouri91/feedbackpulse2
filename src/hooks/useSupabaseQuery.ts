import { useCallback, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { useUIStore } from '../store/uiStore';
import type { Database } from '../types/database';

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];

interface QueryState<T> {
  data: T | null;
  error: PostgrestError | null;
  isLoading: boolean;
}

interface QueryOptions {
  onError?: (error: PostgrestError) => void;
  showToast?: boolean;
}

export function useSupabaseQuery<T extends TableName>(tableName: T, options: QueryOptions = {}) {
  const [state, setState] = useState<QueryState<Row<T>[]>>({
    data: null,
    error: null,
    isLoading: false
  });

  const showToast = useUIStore((state) => state.showToast);

  const execute = useCallback(async (
    queryFn: () => Promise<{ data: Row<T>[] | null; error: PostgrestError | null }>
  ) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        setState({ data: null, error, isLoading: false });
        if (options.showToast) {
          showToast('error', `Error: ${error.message}`);
        }
        options.onError?.(error);
        return null;
      }

      setState({ data: data || [], error: null, isLoading: false });
      return data;
    } catch (err) {
      const error = err as PostgrestError;
      setState({ data: null, error, isLoading: false });
      if (options.showToast) {
        showToast('error', `Error: ${error.message}`);
      }
      options.onError?.(error);
      return null;
    }
  }, [options, showToast]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, error: null, isLoading: false })
  };
}

// Example usage:
/*
const MyComponent = () => {
  const { data, error, isLoading, execute } = useSupabaseQuery('profiles', {
    showToast: true,
    onError: (error) => console.error('Query failed:', error)
  });

  useEffect(() => {
    execute(() => supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', orgId)
    );
  }, [execute]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{data?.map(profile => ...)}</div>;
};
*/
