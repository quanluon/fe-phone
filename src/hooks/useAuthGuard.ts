import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

/**
 * Hook to guard routes that require authentication
 * Prevents premature redirects during hydration
 */
export const useAuthGuard = (redirectTo: string = '/auth?mode=login') => {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Only redirect after hydration is complete
    if (_hasHydrated && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [_hasHydrated, isAuthenticated, router, redirectTo]);

  return {
    isAuthenticated,
    isHydrated: _hasHydrated,
    isLoading: !_hasHydrated,
  };
};
