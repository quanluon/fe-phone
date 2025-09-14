import { useQuery } from '@tanstack/react-query';
import { brandApi } from '@/lib/api/products';
import { queryKeys } from '@/lib/api/queryClient';

// Get all brands
export const useBrands = () => {
  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: () => brandApi.getBrands(),
    select: (data) => data.data.data,
  });
};

// Get single brand by ID
export const useBrand = (id: string) => {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => brandApi.getBrand(id),
    select: (data) => data.data.data,
    enabled: !!id,
  });
};

// Get brand by slug
export const useBrandBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.brands.bySlug(slug),
    queryFn: () => brandApi.getBrandBySlug(slug),
    select: (data) => data.data.data,
    enabled: !!slug,
  });
};

