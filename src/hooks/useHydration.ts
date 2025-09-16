import { useEffect, useState } from 'react';

/**
 * Hook to check if the client has hydrated
 * Useful for preventing hydration mismatches with Zustand stores
 */
export const useHydration = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};
