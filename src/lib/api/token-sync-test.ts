// Test and demonstration of token synchronization between client and SSR

import { getAccessToken, getRefreshToken } from '@/lib/utils';
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from '@/lib/utils/ssr';

/**
 * Test function to verify token synchronization
 * This can be called from the browser console to debug token issues
 */
export const testTokenSync = () => {
  console.log('=== Token Sync Test ===');
  
  // Check localStorage
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
  
  console.log('LocalStorage Access Token:', localAccessToken ? 'Present' : 'Missing');
  console.log('LocalStorage Refresh Token:', localRefreshToken ? 'Present' : 'Missing');
  console.log('Cookie Access Token:', cookieAccessToken ? 'Present' : 'Missing');
  console.log('Cookie Refresh Token:', cookieRefreshToken ? 'Present' : 'Missing');
  console.log('Utility Access Token:', utilAccessToken ? 'Present' : 'Missing');
  console.log('Utility Refresh Token:', utilRefreshToken ? 'Present' : 'Missing');
  
  // Check if tokens match
  const accessTokenMatch = localAccessToken === cookieAccessToken;
  const refreshTokenMatch = localRefreshToken === cookieRefreshToken;
  
  console.log('Access Token Sync:', accessTokenMatch ? '✅ Synced' : '❌ Not Synced');
  console.log('Refresh Token Sync:', refreshTokenMatch ? '✅ Synced' : '❌ Not Synced');
  
  return {
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
 * Manual token sync function
 * This can be called to manually sync tokens from localStorage to cookies
 */
export const manualTokenSync = () => {
  console.log('=== Manual Token Sync ===');
  
  const localAccessToken = localStorage.getItem('accessToken');
  const localRefreshToken = localStorage.getItem('refreshToken');
  
  if (localAccessToken) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `accessToken=${localAccessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    console.log('✅ Access token synced to cookies');
  }
  
  if (localRefreshToken) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `refreshToken=${localRefreshToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    console.log('✅ Refresh token synced to cookies');
  }
  
  if (!localAccessToken && !localRefreshToken) {
    console.log('❌ No tokens found in localStorage');
  }
};

/**
 * Clear all tokens (for testing)
 */
export const clearAllTokens = () => {
  console.log('=== Clearing All Tokens ===');
  
  // Clear localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Clear cookies
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  console.log('✅ All tokens cleared');
};

/**
 * Test SSR token access (simulate server-side)
 */
export const testSSRTokenAccess = async () => {
  console.log('=== Testing SSR Token Access ===');
  
  try {
    // This simulates what happens on the server
    const accessToken = await getAccessTokenFromCookies();
    const refreshToken = await getRefreshTokenFromCookies();
    
    console.log('SSR Access Token:', accessToken ? 'Present' : 'Missing');
    console.log('SSR Refresh Token:', refreshToken ? 'Present' : 'Missing');
    
    return {
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken,
    };
  } catch (error) {
    console.error('SSR Token Access Error:', error);
    return {
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: error,
    };
  }
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testTokenSync = testTokenSync;
  (window as any).manualTokenSync = manualTokenSync;
  (window as any).clearAllTokens = clearAllTokens;
  (window as any).testSSRTokenAccess = testSSRTokenAccess;
}
