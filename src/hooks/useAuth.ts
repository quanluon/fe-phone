import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { LoginRequest, RegisterRequest, AppProfile, ChangePasswordRequest } from '@/types';

// Get current user profile view derived from Firebase identity plus optional backend enrichment
export const useProfile = () => {
  const { user, isAuthenticated, isLoading, _hasHydrated } = useAuthStore();

  return {
    data: user,
    isLoading: !_hasHydrated || (isAuthenticated && isLoading && !user),
    isAuthenticated,
  };
};

// Login mutation
export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
  });
};

// Register mutation
export const useRegister = () => {
  const { register } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
};

// Logout mutation
export const useLogout = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => logout(),
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const { updateProfile } = useAuthStore();

  return useMutation({
    mutationFn: (data: Partial<AppProfile>) => updateProfile(data),
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  const { forgotPassword } = useAuthStore();

  return useMutation({
    mutationFn: (email: string) => forgotPassword({ email }),
  });
};

// Reset password mutation
export const useResetPassword = () => {
  const { resetPassword } = useAuthStore();

  return useMutation({
    mutationFn: ({ actionCode, newPassword }: { actionCode: string; newPassword: string }) =>
      resetPassword(actionCode, newPassword),
  });
};

// Change password mutation
export const useChangePassword = () => {
  const { changePassword } = useAuthStore();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
};

// Social login mutation
export const useSocialLogin = () => {
  const { socialLogin } = useAuthStore();

  return useMutation({
    mutationFn: (provider: 'facebook' | 'google') => socialLogin(provider),
  });
};
