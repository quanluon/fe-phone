import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/lib/api/products';
import { queryKeys } from '@/lib/api/queryClient';

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoryApi.getCategories(),
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

