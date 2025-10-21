import { Brand, Category, Product, ProductFilters, ProductQuery } from '@/types';
import { api } from './config';

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

    return api.get<Product[]>(`/api/products?${params.toString()}`);
  },

  // Get single product by ID
  getProduct: async (id: string) => {
    return api.get<Product>(`/api/products/${id}`);
  },

  // Get product by slug
  getProductBySlug: async (slug: string) => {
    return api.get<Product>(`/api/products/slug/${slug}`);
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 8) => {
    return api.get<Product[]>(`/api/products?isFeatured=true&limit=${limit}`);
  },

  // Get new products
  getNewProducts: async (limit: number = 8) => {
    return api.get<Product[]>(`/api/products?isNew=true&limit=${limit}`);
  },

  // Get best selling products (mock implementation)
  getBestSellingProducts: async (limit: number = 8) => {
    return api.get<Product[]>(`/api/products?sort=createdAt&order=desc&limit=${limit}`);
  },

  // Search products
  searchProducts: async (query: string, filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    params.append('search', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<Product[]>(`/api/products?${params.toString()}`);
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string, query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    params.append('category', categoryId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<Product[]>(`/api/products?${params.toString()}`);
  },

  // Get products by brand
  getProductsByBrand: async (brandId: string, query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    params.append('brand', brandId);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return api.get<Product[]>(`/api/products?${params.toString()}`);
  },
};

// Category API endpoints
export const categoryApi = {
  // Get all categories
  getCategories: () => {
    return api.get<Category[]>(`/api/categories`);
  },

  // Get single category
  getCategory: async (id: string) => {
    return api.get<Category>(`/api/categories/${id}`);
  },

  // Get category by slug
  getCategoryBySlug: (slug: string) => {
    return api.get<Category>(`/api/categories/slug/${slug}`);
  },
};

// Brand API endpoints
export const brandApi = {
  // Get all brands
  getBrands: () => {
    return api.get<Brand[]>('/api/brands');
  },

  // Get single brand
  getBrand: (id: string) => {
    return api.get<Brand >(`/api/brands/${id}`);
  },

  // Get brand by slug
  getBrandBySlug: (slug: string) => {
    return api.get<Brand >(`/api/brands/slug/${slug}`);
  },
};

