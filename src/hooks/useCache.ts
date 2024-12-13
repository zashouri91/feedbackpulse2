import { useState, useEffect } from 'react';
import { cache } from '../utils/cache';

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get from cache first
        const cachedData = cache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return;
        }

        // If not in cache, fetch fresh data
        const freshData = await fetcher();
        cache.set(key, freshData, ttl);
        setData(freshData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, ttl]);

  return { data, isLoading, error };
}