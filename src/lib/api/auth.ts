import { AppProfile, AuthUser } from '@/types';
import { api } from './config';

export const authApi = {
  getProfile: () => {
    return api.get<AuthUser>('/auth/profile');
  },

  updateProfile: (data: Partial<AppProfile>) => {
    return api.put<AuthUser>('/auth/profile', data);
  },
};
