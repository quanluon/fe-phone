import { getAccessToken, getRefreshToken, storage } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import { ApiResponse } from '@/types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (works in both SSR and client-side)
    const token = getAccessToken();
    
    // If no token found and we're in SSR, try to get from cookies
    // Note: This is a synchronous interceptor, so we can't use async cookie functions here
    // Tokens should be passed explicitly when creating SSR API clients
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Accept-Language header if available
    if (typeof window !== 'undefined') {
      const storeLang = useUIStore.getState().language;
      const browserLang = typeof navigator !== 'undefined' 
        ? (navigator.language || (navigator.languages && navigator.languages[0]))
        : undefined;
      const acceptLanguage = storeLang || browserLang || 'en';

      config.headers['Accept-Language'] = acceptLanguage;
    } else {
      // Server-side default
      config.headers['Accept-Language'] = 'en';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to get refresh token from various sources
        let refreshToken = getRefreshToken();
        if (!refreshToken && typeof window === 'undefined') {
          // In SSR, try to get from cookies
          try {
            const { getRefreshTokenFromCookies } = await import('@/lib/utils/ssr');
            refreshToken = await getRefreshTokenFromCookies();
          } catch {
            // If cookies() fails, continue without refresh token
          }
        }
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          storage.set('accessToken', accessToken);
          storage.set('refreshToken', newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed, redirect to login
        storage.remove('accessToken');
        storage.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth?mode=login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get<ApiResponse<T>>(url, config).then(res=>res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.post<ApiResponse<T>>(url, data, config).then(res=>res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.put<ApiResponse<T>>(url, data, config).then(res=>res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then(res=>res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete<ApiResponse<T>>(url, config).then(res=>res.data),
};

export default apiClient;




