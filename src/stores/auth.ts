import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, LoginRequest, RegisterRequest } from '@/types';
import { authApi } from '@/lib/api/auth';
import { storage, getErrorMessage } from '@/lib/utils';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          const { user, tokens } = (response.data as unknown as { data: { user: AuthUser; tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number } } }).data;
          const { accessToken, refreshToken } = tokens;

          // Store tokens
          storage.set('accessToken', accessToken);
          storage.set('refreshToken', refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || 'Login failed',
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const { user, tokens } = (response.data as unknown as { data: { user: AuthUser; tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number } } }).data;
          const { accessToken, refreshToken } = tokens;

          // Store tokens
          storage.set('accessToken', accessToken);
          storage.set('refreshToken', refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || 'Registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch {
          // Continue with logout even if API call fails
        } finally {
          // Clear tokens and user data
          storage.remove('accessToken');
          storage.remove('refreshToken');
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshToken: async () => {
        const refreshToken = storage.get<string>('refreshToken');
        if (!refreshToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await authApi.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response.data.data?.data;

          storage.set('accessToken', accessToken);
          storage.set('refreshToken', newRefreshToken);
        } catch {
          // Refresh failed, logout user
          storage.remove('accessToken');
          storage.remove('refreshToken');
          set({ isAuthenticated: false, user: null });
        }
      },

      getProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await authApi.getProfile();
          set({
            user: response.data.data.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || 'Failed to get profile',
          });
        }
      },

      updateProfile: async (data: Partial<AuthUser>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.updateProfile(data);
          set({
            user: response.data.data.data,  
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          set({
            isLoading: false,
            error: getErrorMessage(error) || 'Failed to update profile',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: AuthUser | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

