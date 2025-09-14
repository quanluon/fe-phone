import { api } from './config';
import { Product, ProductQuery, ProductFilters, Category, Brand } from '@/types';

// Product API endpoints
export const productApi = {
  // Get all products with filters
  getProducts: (query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<{ data: Product[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/api/products?${params.toString()}`);
  },

  // Get single product by ID
  getProduct: (id: string) => {
    return api.get<{ data: Product }>(`/api/products/${id}`);
  },

  // Get product by slug
  getProductBySlug: (slug: string) => {
    return api.get<{ data: Product }>(`/api/products/slug/${slug}`);
  },

  // Get featured products
  getFeaturedProducts: (limit: number = 8) => {
    return api.get<{ data: Product[] }>(`/api/products?isFeatured=true&limit=${limit}`);
  },

  // Get new products
  getNewProducts: (limit: number = 8) => {
    return api.get<{ data: Product[] }>(`/api/products?isNew=true&limit=${limit}`);
  },

  // Get best selling products (mock implementation)
  getBestSellingProducts: (limit: number = 8) => {
    return api.get<{ data: Product[] }>(`/api/products?sortBy=created_at_desc&limit=${limit}`);
  },

  // Search products
  searchProducts: (query: string, filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    params.append('search', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<{ data: Product[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/api/products?${params.toString()}`);
  },

  // Get products by category
  getProductsByCategory: (categoryId: string, query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    params.append('category', categoryId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<{ data: Product[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/api/products?${params.toString()}`);
  },

  // Get products by brand
  getProductsByBrand: (brandId: string, query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    params.append('brand', brandId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<{ data: Product[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/api/products?${params.toString()}`);
  },
};

// Category API endpoints
export const categoryApi = {
  // Get all categories
  getCategories: () => {
    return api.get<{ data: Category[] }>('/api/categories');
  },

  // Get single category
  getCategory: (id: string) => {
    return api.get<{ data: Category }>(`/api/categories/${id}`);
  },

  // Get category by slug
  getCategoryBySlug: (slug: string) => {
    return api.get<{ data: Category }>(`/api/categories/slug/${slug}`);
  },
};

// Brand API endpoints
export const brandApi = {
  // Get all brands
  getBrands: () => {
    return api.get<{ data: Brand[] }>('/api/brands');
  },

  // Get single brand
  getBrand: (id: string) => {
    return api.get<{ data: Brand }>(`/api/brands/${id}`);
  },

  // Get brand by slug
  getBrandBySlug: (slug: string) => {
    return api.get<{ data: Brand }>(`/api/brands/slug/${slug}`);
  },
};

