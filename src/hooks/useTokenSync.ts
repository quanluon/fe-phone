import { useEffect } from 'react';
import { storage } from '@/lib/utils';

/**
 * Hook to synchronize tokens from localStorage to cookies on page load
 * This ensures that tokens are available for SSR after page refresh
 */
export const useTokenSync = () => {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check if we have tokens in localStorage but not in cookies
    const localAccessToken = storage.get<string>('accessToken');
    const localRefreshToken = storage.get<string>('refreshToken');

    if (localAccessToken || localRefreshToken) {
      // Check if cookies are missing or different
      const cookieAccessToken = getCookie('accessToken');
      const cookieRefreshToken = getCookie('refreshToken');

      // Sync tokens to cookies if they're missing or different
      if (localAccessToken && localAccessToken !== cookieAccessToken) {
        setCookie('accessToken', localAccessToken, 7); // 7 days
      }

      if (localRefreshToken && localRefreshToken !== cookieRefreshToken) {
        setCookie('refreshToken', localRefreshToken, 7); // 7 days
      }
    }
  }, []);
};

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Set cookie with proper configuration
 */
function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  
  const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
  document.cookie = cookieString;
}
