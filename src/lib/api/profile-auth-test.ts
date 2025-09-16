// Test authentication flow for profile page

import { getAccessToken, getRefreshToken } from '@/lib/utils';

/**
 * Test function to check authentication state
 * Can be called from browser console
 */
export const testProfileAuth = () => {
  console.log('=== Profile Authentication Test ===');
  
  // Check localStorage tokens
  const localAccessToken = localStorage.getItem('accessToken');
  const localRefreshToken = localStorage.getItem('refreshToken');
  
  // Check cookies
  const cookieAccessToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];
  const cookieRefreshToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('refreshToken='))
    ?.split('=')[1];
  
  // Check utility functions
  const utilAccessToken = getAccessToken();
  const utilRefreshToken = getRefreshToken();
  
  console.log('LocalStorage Access Token:', localAccessToken ? '✅ Present' : '❌ Missing');
  console.log('LocalStorage Refresh Token:', localRefreshToken ? '✅ Present' : '❌ Missing');
  console.log('Cookie Access Token:', cookieAccessToken ? '✅ Present' : '❌ Missing');
  console.log('Cookie Refresh Token:', cookieRefreshToken ? '✅ Present' : '❌ Missing');
  console.log('Utility Access Token:', utilAccessToken ? '✅ Present' : '❌ Missing');
  console.log('Utility Refresh Token:', utilRefreshToken ? '✅ Present' : '❌ Missing');
  
  // Check if tokens match
  const accessTokenMatch = localAccessToken === cookieAccessToken;
  const refreshTokenMatch = localRefreshToken === cookieRefreshToken;
  
  console.log('Access Token Sync:', accessTokenMatch ? '✅ Synced' : '❌ Not Synced');
  console.log('Refresh Token Sync:', refreshTokenMatch ? '✅ Synced' : '❌ Not Synced');
  
  // Overall authentication status
  const isAuthenticated = !!(utilAccessToken && utilRefreshToken);
  console.log('Overall Auth Status:', isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated');
  
  return {
    isAuthenticated,
    localAccessToken,
    localRefreshToken,
    cookieAccessToken,
    cookieRefreshToken,
    utilAccessToken,
    utilRefreshToken,
    accessTokenMatch,
    refreshTokenMatch,
  };
};

/**
 * Simulate login by setting tokens
 */
export const simulateLogin = (accessToken: string, refreshToken: string) => {
  console.log('=== Simulating Login ===');
  
  // Set localStorage
  localStorage.setItem('accessToken', JSON.stringify(accessToken));
  localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
  
  // Set cookies
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  
  document.cookie = `accessToken=${accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = `refreshToken=${refreshToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  
  console.log('✅ Login simulation complete');
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  
  // Test the authentication
  return testProfileAuth();
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  console.log('=== Clearing Authentication ===');
  
  // Clear localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Clear cookies
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  console.log('✅ Authentication cleared');
  
  return testProfileAuth();
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testProfileAuth = testProfileAuth;
  (window as any).simulateLogin = simulateLogin;
  (window as any).clearAuth = clearAuth;
}
