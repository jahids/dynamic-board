import { useState, useEffect, useCallback, useRef } from 'react';
import { getOnboardingData, isOnboardingSuccess } from './client';
import { 
  UseOnboardingOptions, 
  UseOnboardingResult, 
  OnboardingData, 
  OnboardingError,
  OnboardingConfig 
} from './types';

// Simple cache implementation
class OnboardingCache {
  private cache = new Map<string, { data: OnboardingData; timestamp: number }>();
  private defaultCacheTime = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: OnboardingData, cacheTime?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (cacheTime || this.defaultCacheTime),
    });
  }

  get(key: string): OnboardingData | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  isStale(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    
    return Date.now() > item.timestamp;
  }
}

// Global cache instance
const onboardingCache = new OnboardingCache();

export function useOnboarding(
  appId: string,
  options: UseOnboardingOptions = {}
): UseOnboardingResult {
  const {
    enabled = true,
    refetchOnMount = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
  } = options;

  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<OnboardingError | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled || !appId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getOnboardingData(appId);
      
      if (!mountedRef.current) return;

      if (isOnboardingSuccess(response)) {
        setData(response.data);
        setError(null);
        onboardingCache.set(appId, response.data, cacheTime);
        setIsStale(false);
      } else {
        setError(response.error || null);
        setData(null);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      
      setError({
        code: 'UNKNOWN',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
      setData(null);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [appId, enabled, cacheTime]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enabled || !appId) return;

    const cachedData = onboardingCache.get(appId);
    if (cachedData && !refetchOnMount) {
      setData(cachedData);
      setIsStale(onboardingCache.isStale(appId));
      return;
    }

    fetchData();
  }, [appId, enabled, refetchOnMount, fetchData]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}
