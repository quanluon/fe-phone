import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, LoginRequest, RegisterRequest } from '@/types';
import { authApi } from '@/lib/api/auth';
import { storage, getErrorMessage, createPersistStorage, cookies } from '@/lib/utils';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  socialLogin: (user: AuthUser, tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

type AuthStore = AuthState & AuthActions;

// Helper function to store tokens in both localStorage and cookies
const storeTokens = (accessToken: string, refreshToken: string) => {
  // Store in localStorage for client-side access
  storage.set('accessToken', accessToken);
  storage.set('refreshToken', refreshToken);
  
  // Store in cookies for SSR access with proper configuration
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days
    
    // Set cookies with proper configuration for SSR
    document.cookie = `accessToken=${accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    document.cookie = `refreshToken=${refreshToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    
    // Also use the cookies helper as backup
    cookies.set('accessToken', accessToken, {
      expires,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    cookies.set('refreshToken', refreshToken, {
      expires,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
};

// Helper function to clear tokens from both localStorage and cookies
const clearTokens = () => {
  storage.remove('accessToken');
  storage.remove('refreshToken');
  
  if (typeof window !== 'undefined') {
    // Clear cookies using document.cookie
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Also use the cookies helper as backup
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          const { user, tokens } = response.data;
          const { accessToken, refreshToken } = tokens;

          // Store tokens
          storeTokens(accessToken, refreshToken);

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
          const { user, tokens } = response.data;
          const { accessToken, refreshToken } = tokens;

          // Store tokens
          storeTokens(accessToken, refreshToken);

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

      socialLogin: async (user: AuthUser, tokens: { accessToken: string; refreshToken: string; idToken: string; expiresIn: number }) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, refreshToken } = tokens;

          // Store tokens
          storeTokens(accessToken, refreshToken);

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
            error: getErrorMessage(error) || 'Social login failed',
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
          clearTokens();
          
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
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          storeTokens(accessToken, newRefreshToken);
        } catch {
          // Refresh failed, logout user
          clearTokens();
          set({ isAuthenticated: false, user: null });
        }
      },

      getProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await authApi.getProfile();
          set({
            user: response.data,
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
            user: response.data,  
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
      storage: createPersistStorage(),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure loading and error states are reset after rehydration
          state.isLoading = false;
          state.error = null;
          state._hasHydrated = true;
        }
      },
    }
  )
);

