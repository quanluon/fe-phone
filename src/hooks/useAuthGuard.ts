import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

/**
 * Hook to guard routes that require authentication
 * Prevents premature redirects during hydration
 */
export const useAuthGuard = (redirectTo: string = '/auth?mode=login') => {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated, _isInitialized } = useAuthStore();

  useEffect(() => {
    // Only redirect after Firebase auth state has been initialized.
    if (_hasHydrated && _isInitialized && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [_hasHydrated, _isInitialized, isAuthenticated, router, redirectTo]);

  return {
    isAuthenticated,
    isHydrated: _hasHydrated && _isInitialized,
    isLoading: !_hasHydrated || !_isInitialized,
  };
};
