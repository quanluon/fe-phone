import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Language, Currency, Country } from '@/types';

interface UIState {
  theme: Theme;
  language: Language;
  currency: Currency;
  country: Country;
  sidebarOpen: boolean;
  searchQuery: string;
  isLoading: boolean;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  setCountry: (country: Country) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // State
      theme: 'light',
      language: 'vi',
      currency: 'VND',
      country: 'VN',
      sidebarOpen: false,
      searchQuery: '',
      isLoading: false,

      // Actions
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      setLanguage: (language: Language) => {
        set({ language });
      },

      setCurrency: (currency: Currency) => {
        set({ currency });
      },

      setCountry: (country: Country) => {
        set({ country });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        currency: state.currency,
        country: state.country,
      }),
    }
  )
);
