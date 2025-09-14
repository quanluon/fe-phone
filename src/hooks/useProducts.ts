import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api/products';
import { queryKeys } from '@/lib/api/queryClient';
import { ProductQuery } from '@/types';

// Get all products with filters
export const useProducts = (query: ProductQuery = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(query),
    queryFn: () => productApi.getProducts(query),
    select: (data) => data.data.data,
  });
};

// Get single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productApi.getProduct(id),
    select: (data) => data.data.data,
    enabled: !!id,
  });
};

// Get product by slug
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.products.bySlug(slug),
    queryFn: () => productApi.getProductBySlug(slug),
    select: (data) => data.data.data,
    enabled: !!slug,
  });
};

// Get product by ID or slug (smart hook that detects format)
export const useProductByIdOrSlug = (identifier: string) => {
  // Check if identifier looks like an ObjectId (24 hex characters)
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  
  // Use conditional hooks based on identifier format
  const productById = useProduct(isObjectId ? identifier : '');
  const productBySlug = useProductBySlug(!isObjectId ? identifier : '');
  
  // Return the appropriate query based on identifier format
  if (isObjectId) {
    return productById;
  } else {
    return productBySlug;
  }
};

// Get featured products
export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: queryKeys.products.featured(limit),
    queryFn: () => productApi.getFeaturedProducts(limit),
    select: (data) => data.data.data,
  });
};

// Get new products
export const useNewProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: queryKeys.products.new(limit),
    queryFn: () => productApi.getNewProducts(limit),
    select: (data) => data.data.data,
  });
};

// Get best selling products
export const useBestSellingProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: queryKeys.products.bestSelling(limit),
    queryFn: () => productApi.getBestSellingProducts(limit),
    select: (data) => data.data.data,
  });
};

// Search products
export const useSearchProducts = (query: string, filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: queryKeys.products.search(query, filters),
    queryFn: () => productApi.searchProducts(query, filters),
    select: (data) => data.data.data,
    enabled: !!query && query.length > 2,
  });
};

// Get products by category
export const useProductsByCategory = (categoryId: string, query: ProductQuery = {}) => {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId, query),
    queryFn: () => productApi.getProductsByCategory(categoryId, query),
    select: (data) => data.data.data,
    enabled: !!categoryId,
  });
};

// Get products by brand
export const useProductsByBrand = (brandId: string, query: ProductQuery = {}) => {
  return useQuery({
    queryKey: queryKeys.products.byBrand(brandId, query),
    queryFn: () => productApi.getProductsByBrand(brandId, query),
    select: (data) => data.data.data,
    enabled: !!brandId,
  });
};

// Infinite query for products (for pagination)
export const useInfiniteProducts = (query: ProductQuery = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(query),
    queryFn: ({ pageParam = 1 }) => 
      productApi.getProducts({ ...query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination && pagination.page < pagination.pages ? pagination.page + 1 : undefined;
    },
    select: (data) => ({
      pages: data.pages.map((page) => page.data),
      pageParams: data.pageParams,
    }),
  });
};

