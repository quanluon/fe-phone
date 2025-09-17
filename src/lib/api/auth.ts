import { api } from './config';
import { LoginRequest, RegisterRequest, User, AuthUser } from '@/types';

// Auth API endpoints
export const authApi = {
  // Login
  login: (data: LoginRequest) => {
    return api.post<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number } }>('/auth/login', data);
  },

  // Register
  register: (data: RegisterRequest) => {
    return api.post<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number } }>('/auth/register', data);
  },

  // Logout
  logout: () => {
    return api.post<{ message: string }>('/auth/logout');
  },

  // Refresh token
  refreshToken: (refreshToken: string) => {
    return api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
  },

  // Forgot password
  forgotPassword: (email: string) => {
    return api.post<{ message: string }>('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (email: string, confirmationCode: string, newPassword: string) => {
    return api.post<{ message: string }>('/auth/reset-password', {
      email,
      confirmationCode,
      newPassword,
    });
  },

  // Get current user profile
  getProfile: () => {
    return api.get<AuthUser>('/auth/profile');
  },

  // Update profile
  updateProfile: (data: Partial<User>) => {
    return api.put<AuthUser>('/auth/profile', data);
  },

  // Change password
  changePassword: (currentPassword: string, newPassword: string) => {
    return api.put<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Social login
  socialLogin: (provider: 'facebook' | 'google', accessToken: string, idToken?: string) => {
    return api.post<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number } }>('/auth/social-login', {
      provider,
      accessToken,
      idToken,
    });
  },
};

