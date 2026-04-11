/**
 * Admin API — all requests go through the Next.js Route Handler proxy at /api/admin/*.
 * The proxy runs server-side and injects the API key from process.env.API_KEY,
 * so the key is never exposed to the browser.
 */
import type {
  ApiResponse,
  Brand,
  Category,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  User,
} from '@/types';
import { getFirebaseIdToken } from '@/lib/firebase/auth';
import { fileApi } from './files';

// ─── Proxy fetch helper ───────────────────────────────────────────────────────

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Forward Firebase token if user is logged in
  try {
    const token = await getFirebaseIdToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {
    // ignore
  }

  // Hardcode x-api-key as requested
  headers['x-api-key'] = process.env.API_KEY || '';


  const res = await fetch(`${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

function get<T>(url: string) {
  return adminFetch<T>(url);
}

function post<T>(url: string, data: unknown) {
  return adminFetch<T>(url, { method: 'POST', body: JSON.stringify(data) });
}

function put<T>(url: string, data: unknown) {
  return adminFetch<T>(url, { method: 'PUT', body: JSON.stringify(data) });
}

function patch<T>(url: string, data: unknown) {
  return adminFetch<T>(url, { method: 'PATCH', body: JSON.stringify(data) });
}

function del<T>(url: string) {
  return adminFetch<T>(url, { method: 'DELETE' });
}

// ─── Brands ──────────────────────────────────────────────────────────────────

export const adminBrandsApi = {
  getAll: (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    return get<Brand[]>(`/api/admin/brands?${params}`);
  },
  getById: (id: string) => get<Brand>(`/api/admin/brands/${id}`),
  create: (data: Partial<Brand>) => post<Brand>('/api/admin/brands', data),
  update: (id: string, data: Partial<Brand>) => put<Brand>(`/api/admin/brands/${id}`, data),
  delete: (id: string) => del(`/api/admin/brands/${id}`),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const adminCategoriesApi = {
  getAll: (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    return get<Category[]>(`/api/admin/categories?${params}`);
  },
  getById: (id: string) => get<Category>(`/api/admin/categories/${id}`),
  create: (data: Partial<Category>) => post<Category>('/api/admin/categories', data),
  update: (id: string, data: Partial<Category>) => put<Category>(`/api/admin/categories/${id}`, data),
  delete: (id: string) => del(`/api/admin/categories/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export interface AdminProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  brand?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface AiExtractedProduct extends Partial<Product> {
  _validationErrors?: string[];
}

export const adminProductsApi = {
  getAll: (filters?: AdminProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);
    return get<Product[]>(`/api/admin/products?${params}`);
  },
  getById: (id: string) => get<Product>(`/api/admin/products/${id}`),
  create: (data: Partial<Product>) => post<Product>('/api/admin/products', data),
  update: (id: string, data: Partial<Product>) => put<Product>(`/api/admin/products/${id}`, data),
  delete: (id: string) => del(`/api/admin/products/${id}`),
  updateStatus: (id: string, status: string) =>
    patch<Product>(`/api/admin/products/${id}/status`, { status }),
  aiExtract: (data: { promptText?: string; imageUrl?: string }) =>
    post<AiExtractedProduct>('/api/admin/products/ai-extract', data),
};

// ─── Files/Uploads ───────────────────────────────────────────────────────────

export const adminFilesApi = {
  getPresignedUrl: async (fileName: string, contentType: string, folder: string = 'products') => {
    // Calling fileApi directly (which calls the BE directly via Axios)
    const data = await fileApi.getPresignedUrl(fileName, contentType, folder);
    // Map 'url' to 'uploadUrl' for component compatibility
    return {
      success: true,
      data: {
        uploadUrl: data.url,
        fileKey: data.key,
        publicUrl: data.publicUrl
      }
    };
  },
  getMultiplePresignedUrls: async (files: { fileName: string; contentType: string }[], folder: string = 'products') => {
    const formattedFiles = files.map(f => ({ fileName: f.fileName, fileType: f.contentType }));
    const data = await fileApi.getMultiplePresignedUrls(formattedFiles, folder);
    return {
      success: true,
      data: data.uploadUrls.map(u => ({
        uploadUrl: u.url,
        fileKey: u.key,
        publicUrl: u.publicUrl
      }))
    };
  },
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface AdminOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const adminOrdersApi = {
  getAll: (filters?: AdminOrderFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    return get<Order[]>(`/api/admin/orders?${params}`);
  },
  getById: (id: string) => get<Order>(`/api/admin/orders/${id}`),
  update: (id: string, data: Partial<Order>) => put<Order>(`/api/admin/orders/${id}`, data),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}

export const adminUsersApi = {
  getAll: (filters?: AdminUserFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    return get<User[]>(`/api/admin/users?${params}`);
  },
  getById: (id: string) => get<User>(`/api/admin/users/${id}`),
  update: (id: string, data: Partial<User>) => put<User>(`/api/admin/users/${id}`, data),
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface AdminProductStats {
  overview: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    draftProducts: number;
    featuredProducts: number;
    newProducts: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
  };
  byType: { _id: string; count: number }[];
  byCategory: { _id: string; count: number }[];
}

export interface AdminOrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  paidOrders: number;
  pendingPaymentOrders: number;
}

export const adminStatsApi = {
  getProductStats: () => get<AdminProductStats>('/api/admin/products/stats'),
  getOrderStats: () => get<AdminOrderStats>('/api/admin/orders/stats'),
};
