import { authApi } from "@/lib/api/auth";
import { createPersistStorage, getErrorMessage } from "@/lib/utils";
import { AuthToken, AuthUser, LoginRequest, RegisterRequest } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokens?: Partial<AuthToken>;
  _hasHydrated: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  socialLogin: (user: AuthUser, tokens: AuthToken) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthToken) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokens: {
              accessToken,
              refreshToken,
            },
          });
        } catch (error: unknown) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || "Login failed",
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const { user, tokens } = response.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokens,
          });
        } catch (error: unknown) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || "Registration failed",
          });
          throw error;
        }
      },

      socialLogin: async (user: AuthUser, tokens: AuthToken) => {
        set({ isLoading: true, error: null });
        try {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokens,
          });
        } catch (error: unknown) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || "Social login failed",
            tokens: undefined,
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
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            tokens: undefined,
          });
        }
      },
      refreshToken: async () => {
        const refreshToken = get().tokens?.refreshToken;
        if (!refreshToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await authApi.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          set({
            tokens: {
              accessToken,
              refreshToken: newRefreshToken,
            },
          });
        } catch {
          // Refresh failed, logout user
          set({ isAuthenticated: false, user: null, tokens: undefined });
        }
      },

      setTokens: (tokens: AuthToken) => {
        set({ tokens });
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
            error: getErrorMessage(error) || "Failed to get profile",
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
            error: getErrorMessage(error) || "Failed to update profile",
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
      name: "auth-storage",
      storage: createPersistStorage(),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokens:state.tokens,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure loading and error states are reset after rehydration
          state.isLoading = false;
          state.error = null;
          state._hasHydrated = true;
          state.isAuthenticated = Boolean(state?.tokens?.accessToken && state?.user)
        }
      },
    }
  )
);
