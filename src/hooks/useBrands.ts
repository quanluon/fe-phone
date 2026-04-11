import { useQuery } from '@tanstack/react-query';
import { brandApi } from '@/lib/api/products';
import { queryKeys } from '@/lib/api/queryClient';
import { ApiResponse, Brand } from '@/types';

// Get all brands
export const useBrands = (initialData?: Brand[]) => {
  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: () => brandApi.getBrands(),
    initialData: initialData
      ? {
          success: true,
          data: initialData,
        } satisfies ApiResponse<Brand[]>
      : undefined,
    select: (data) => data.data,
  });
};

// Get single brand by ID
export const useBrand = (id: string) => {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => brandApi.getBrand(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Get brand by slug
export const useBrandBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.brands.bySlug(slug),
    queryFn: () => brandApi.getBrandBySlug(slug),
    select: (data) => data.data,
    enabled: !!slug,
  });
};
