import { useCallback, useState, useRef } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { useUIStore } from '../store/uiStore';
import type { Database } from '../types/database';

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];

interface QueryState<T> {
  data: T | null;
  error: QueryError | null;
  isLoading: boolean;
  lastUpdated: number | null;
}

// Enhanced error types for better error handling
interface QueryError {
  type: 'network' | 'database' | 'validation' | 'unknown';
  message: string;
  originalError: PostgrestError | Error;
  retryCount: number;
}

interface QueryOptions {
  onError?: (error: QueryError) => void;
  showToast?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  cacheTime?: number; // How long to cache results in ms
  staleTime?: number; // How long before data is considered stale
}

const DEFAULT_OPTIONS: Required<Omit<QueryOptions, 'onError'>> = {
  showToast: true,
  maxRetries: 3,
  retryDelay: 1000,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 30 * 1000, // 30 seconds
};

export function useSupabaseQuery<T extends TableName>(tableName: T, options: QueryOptions = {}) {
  const [state, setState] = useState<QueryState<Row<T>[]>>({
    data: null,
    error: null,
    isLoading: false,
    lastUpdated: null,
  });

  // Cache reference to avoid unnecessary re-renders
  const cache = useRef<{
    data: Row<T>[] | null;
    timestamp: number;
  } | null>(null);

  const showToast = useUIStore(state => state.showToast);
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const categorizeError = (error: PostgrestError | Error): QueryError['type'] => {
    if (error instanceof PostgrestError) {
      if (error.code === 'PGRST301') return 'validation';
      if (error.code?.startsWith('P')) return 'database';
    }
    if (error.name === 'NetworkError' || error.name === 'AbortError') return 'network';
    return 'unknown';
  };

  const createQueryError = (
    error: PostgrestError | Error,
    retryCount: number
  ): QueryError => ({
    type: categorizeError(error),
    message: error.message,
    originalError: error,
    retryCount,
  });

  const shouldUseCache = (): boolean => {
    if (!cache.current) return false;
    const age = Date.now() - cache.current.timestamp;
    return age < mergedOptions.cacheTime;
  };

  const execute = useCallback(
    async (queryFn: () => Promise<{ data: Row<T>[] | null; error: PostgrestError | null }>) => {
      setState(prev => ({ ...prev, isLoading: true }));

      // Check cache first
      if (shouldUseCache()) {
        setState({
          data: cache.current!.data,
          error: null,
          isLoading: false,
          lastUpdated: cache.current!.timestamp,
        });
        return cache.current!.data;
      }

      let attempts = 0;
      while (attempts < mergedOptions.maxRetries) {
        try {
          const { data, error } = await queryFn();

          if (error) {
            // Calculate exponential backoff with jitter
            const backoff =
              mergedOptions.retryDelay *
              Math.pow(2, attempts) *
              (1 + Math.random() * 0.1);

            if (attempts === mergedOptions.maxRetries - 1) {
              const queryError = createQueryError(error, attempts + 1);
              setState({
                data: null,
                error: queryError,
                isLoading: false,
                lastUpdated: null,
              });

              if (mergedOptions.showToast) {
                const errorMessage = 
                  queryError.type === 'network'
                    ? 'Network error. Please check your connection.'
                    : queryError.type === 'database'
                    ? 'Database error. Please try again later.'
                    : `Error: ${queryError.message}`;
                showToast('error', errorMessage);
              }

              mergedOptions.onError?.(queryError);
              return null;
            }

            await new Promise(resolve => setTimeout(resolve, backoff));
            attempts++;
            continue;
          }

          // Update cache
          cache.current = {
            data: data || [],
            timestamp: Date.now(),
          };

          setState({
            data: data || [],
            error: null,
            isLoading: false,
            lastUpdated: Date.now(),
          });

          return data;
        } catch (err) {
          const backoff =
            mergedOptions.retryDelay *
            Math.pow(2, attempts) *
            (1 + Math.random() * 0.1);

          if (attempts === mergedOptions.maxRetries - 1) {
            const queryError = createQueryError(
              err instanceof Error ? err : new Error('Unknown error'),
              attempts + 1
            );
            setState({
              data: null,
              error: queryError,
              isLoading: false,
              lastUpdated: null,
            });

            if (mergedOptions.showToast) {
              showToast('error', `Error: ${queryError.message}`);
            }

            mergedOptions.onError?.(queryError);
            return null;
          }

          await new Promise(resolve => setTimeout(resolve, backoff));
          attempts++;
        }
      }
      return null;
    },
    [mergedOptions, showToast]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      lastUpdated: null,
    });
    cache.current = null;
  }, []);

  const invalidate = useCallback(() => {
    cache.current = null;
  }, []);

  return {
    ...state,
    execute,
    reset,
    invalidate,
    isStale: state.lastUpdated
      ? Date.now() - state.lastUpdated > mergedOptions.staleTime
      : false,
  };
}
