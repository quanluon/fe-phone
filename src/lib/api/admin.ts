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

// ─── Proxy fetch helper ───────────────────────────────────────────────────────

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Forward Firebase token if user is logged in (proxy will also add API key)
  try {
    const token = await getFirebaseIdToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {
    // not logged in — proxy will rely solely on API key
    headers['x-api-key'] = process.env.API_KEY || '';
  }

  const res = await fetch(path, { ...options, headers });

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

export const adminStatsApi = {
  getProductStats: () =>
    get<{ total: number; active: number; draft: number; inactive: number }>(
      '/api/admin/products/stats'
    ),
  getOrderStats: () =>
    get<{
      total: number;
      pending: number;
      confirmed: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
      totalRevenue: number;
    }>('/api/admin/orders/stats'),
};
