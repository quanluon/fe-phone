import { api } from './config';
import { LoginRequest, RegisterRequest, User, AuthUser } from '@/types';

// Auth API endpoints
export const authApi = {
  // Login
  login: (data: LoginRequest) => {
    return api.post<{ data: { user: AuthUser; tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number } } }>('/auth/login', data);
  },

  // Register
  register: (data: RegisterRequest) => {
    return api.post<{ data: { user: AuthUser; tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number } } }>('/auth/register', data);
  },

  // Logout
  logout: () => {
    return api.post<{ data: { message: string } }>('/auth/logout');
  },

  // Refresh token
  refreshToken: (refreshToken: string) => {
    return api.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', {
      refreshToken,
    });
  },

  // Forgot password
  forgotPassword: (email: string) => {
    return api.post<{ data: { message: string } }>('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token: string, password: string) => {
    return api.post<{ data: { message: string } }>('/auth/reset-password', {
      token,
      password,
    });
  },

  // Get current user profile
  getProfile: () => {
    return api.get<{ data: AuthUser }>('/auth/profile');
  },

  // Update profile
  updateProfile: (data: Partial<User>) => {
    return api.put<{ data: AuthUser }>('/auth/profile', data);
  },

  // Change password
  changePassword: (currentPassword: string, newPassword: string) => {
    return api.post<{ data: { message: string } }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

