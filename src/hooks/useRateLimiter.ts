import { useEffect } from 'react';
import { rateLimiter } from '../utils/rateLimiter';
import { useUIStore } from '../store/uiStore';

export function useRateLimiter(key: string) {
  const showToast = useUIStore(state => state.showToast);

  useEffect(() => {
    if (rateLimiter.isRateLimited(key)) {
      showToast('error', 'Too many requests. Please try again later.');
    }
  }, [key, showToast]);

  return rateLimiter.getRemainingRequests(key);
}
