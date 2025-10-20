import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

interface LoadingActions {
  setLoading: (isLoading: boolean, message?: string) => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

type LoadingStore = LoadingState & LoadingActions;

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  message: undefined,
  
  setLoading: (isLoading: boolean, message?: string) => 
    set({ isLoading, message }),
  
  showLoading: (message?: string) => 
    set({ isLoading: true, message }),
  
  hideLoading: () => 
    set({ isLoading: false, message: undefined }),
}));

