import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/lib/api/products';
import { queryKeys } from '@/lib/api/queryClient';
import { ApiResponse, Category } from '@/types';

// Get all categories
export const useCategories = (initialData?: Category[]) => {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoryApi.getCategories(),
    initialData: initialData
      ? {
          success: true,
          data: initialData,
        } satisfies ApiResponse<Category[]>
      : undefined,
    select: (data) => data.data,
  });
};

// Get single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Get category by slug
export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => categoryApi.getCategoryBySlug(slug),
    select: (data) => data.data,
    enabled: !!slug,
  });
};
