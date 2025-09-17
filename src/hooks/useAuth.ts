import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { queryKeys } from '@/lib/api/queryClient';
import { useAuthStore } from '@/stores/auth';
import { LoginRequest, RegisterRequest, AuthUser } from '@/types';

// Get current user profile
export const useProfile = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => authApi.getProfile(),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
};

// Login mutation
export const useLogin = () => {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

// Register mutation
export const useRegister = () => {
  const { register } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const { updateProfile } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AuthUser>) => updateProfile(data),
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ email, confirmationCode, newPassword }: { email: string; confirmationCode: string; newPassword: string }) =>
      authApi.resetPassword(email, confirmationCode, newPassword),
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
  });
};

// Social login mutation
export const useSocialLogin = () => {
  const { socialLogin } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ provider, accessToken, idToken }: { provider: 'facebook' | 'google'; accessToken: string; idToken?: string }) =>
      authApi.socialLogin(provider, accessToken, idToken),
    onSuccess: (response) => {
      // Store tokens and user info
      const { user, tokens } = response.data;
      socialLogin(user, tokens);
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

