import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { getAccessToken, getRefreshToken } from '@/lib/utils';
import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from '@/lib/utils/ssr';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create SSR-compatible axios instance
export const createSSRApiClient = (accessToken?: string): AxiosInstance => {
  const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  // Request interceptor for SSR
  apiClient.interceptors.request.use(
    (config) => {
      // Add auth token if available
      let token = accessToken;
      
      // If no token provided, try to get it from various sources
      if (!token) {
        if (typeof window === 'undefined') {
          // Server-side: try to get from cookies (async)
          // Note: This won't work in request interceptors, tokens should be passed explicitly
          // This is mainly for client-side fallback
        } else {
          // Client-side: use regular token access
          token = getAccessToken() || undefined;
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add Accept-Language header
      const acceptLanguage = 'en'; // Default language for SSR
      config.headers['Accept-Language'] = acceptLanguage;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for SSR
  apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors (token expired) - only on client-side
      if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
        originalRequest._retry = true;

        try {
          // Try to get refresh token from various sources
          let refreshToken = getRefreshToken();
          if (!refreshToken && typeof window === 'undefined') {
            // In SSR, try to get from cookies (async)
            try {
              refreshToken = await getRefreshTokenFromCookies();
            } catch {
              // If cookies() fails, continue without refresh token
            }
          }
          
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
            
            // Update tokens in storage
            if (typeof window !== 'undefined') {
              const { storage, cookies } = await import('@/lib/utils');
              storage.set('accessToken', newAccessToken);
              storage.set('refreshToken', newRefreshToken);
              
              // Also update cookies
              const expires = new Date();
              expires.setDate(expires.getDate() + 7);
              cookies.set('accessToken', newAccessToken, { expires, path: '/', sameSite: 'lax' });
              cookies.set('refreshToken', newRefreshToken, { expires, path: '/', sameSite: 'lax' });
            }

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch {
          // Refresh failed, clear tokens
          if (typeof window !== 'undefined') {
            const { storage, cookies } = await import('@/lib/utils');
            storage.remove('accessToken');
            storage.remove('refreshToken');
            cookies.remove('accessToken');
            cookies.remove('refreshToken');
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Generic SSR API methods
export const createSSRApi = (accessToken?: string) => {
  const client = createSSRApiClient(accessToken);
  
  return {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
      client.get(url, config),

    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
      client.post(url, data, config),

    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
      client.put(url, data, config),

    patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
      client.patch(url, data, config),

    delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
      client.delete(url, config),
  };
};

// SSR Auth API endpoints
export const createSSRAuthApi = (accessToken?: string) => {
  const api = createSSRApi(accessToken);
  
  return {
    // Get current user profile
    getProfile: () => {
      return api.get('/auth/profile');
    },

    // Update profile
    updateProfile: (data: unknown) => {
      return api.put('/auth/profile', data);
    },

    // Change password
    changePassword: (currentPassword: string, newPassword: string) => {
      return api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    },
  };
};

// Auto-detecting SSR API client that works in both contexts
export const createAutoSSRApiClient = async (): Promise<AxiosInstance> => {
  let token: string | null = null;
  
  // Try to get token based on environment
  if (typeof window === 'undefined') {
    // Server-side: try to get from cookies
    try {
      token = await getAccessTokenFromCookies();
    } catch {
      // If cookies() fails, token remains null
    }
  } else {
    // Client-side: use regular token access
    token = getAccessToken();
  }
  
  return createSSRApiClient(token || undefined);
};

// Auto-detecting SSR API methods
export const autoSSRApi = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    const client = await createAutoSSRApiClient();
    return client.get(url, config);
  },

  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    const client = await createAutoSSRApiClient();
    return client.post(url, data, config);
  },

  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    const client = await createAutoSSRApiClient();
    return client.put(url, data, config);
  },

  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    const client = await createAutoSSRApiClient();
    return client.patch(url, data, config);
  },

  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    const client = await createAutoSSRApiClient();
    return client.delete(url, config);
  },
};
