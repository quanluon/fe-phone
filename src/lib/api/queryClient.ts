import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors except 408, 429
        if (error && typeof error === 'object' && 'response' in error) {
          const errorWithResponse = error as { response?: { status?: number } };
          if (errorWithResponse.response?.status && errorWithResponse.response.status >= 400 && errorWithResponse.response.status < 500) {
            if (errorWithResponse.response.status === 408 || errorWithResponse.response.status === 429) {
              return failureCount < 2;
            }
            return false;
          }
        }
        // Retry on 5xx errors and network errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        // Don't retry mutations on client errors
        if (error && typeof error === 'object' && 'response' in error) {
          const errorWithResponse = error as { response?: { status?: number } };
          if (errorWithResponse.response?.status && errorWithResponse.response.status >= 400 && errorWithResponse.response.status < 500) {
            return false;
          }
        }
        // Retry on server errors
        return failureCount < 2;
      },
    },
  },
});

// Query keys factory
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: unknown) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.products.details(), 'slug', slug] as const,
    featured: (limit?: number) => [...queryKeys.products.all, 'featured', limit] as const,
    new: (limit?: number) => [...queryKeys.products.all, 'new', limit] as const,
    bestSelling: (limit?: number) => [...queryKeys.products.all, 'best-selling', limit] as const,
    byCategory: (categoryId: string, filters?: unknown) => 
      [...queryKeys.products.all, 'category', categoryId, filters] as const,
    byBrand: (brandId: string, filters?: unknown) => 
      [...queryKeys.products.all, 'brand', brandId, filters] as const,
    search: (query: string, filters?: unknown) => 
      [...queryKeys.products.all, 'search', query, filters] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.categories.details(), 'slug', slug] as const,
  },

  // Brands
  brands: {
    all: ['brands'] as const,
    lists: () => [...queryKeys.brands.all, 'list'] as const,
    list: () => [...queryKeys.brands.lists()] as const,
    details: () => [...queryKeys.brands.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.brands.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.brands.details(), 'slug', slug] as const,
  },

  // Auth
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },
};

