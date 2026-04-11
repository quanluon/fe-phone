import { buildApiUrl, safeServerFetch } from '@/lib/utils/server-fetch';
import { ProductStatus, type ApiResponse, type Brand, type Category, type Product, type ProductQuery, type ProductVariant } from '@/types';

export const PUBLIC_REVALIDATE_SECONDS = 300;
export const SITEMAP_REVALIDATE_SECONDS = 900;
export const DEFAULT_PRODUCTS_PAGE_SIZE = 12;

type ProductListResponse = ApiResponse<Product[]>;
type CategoryListResponse = ApiResponse<Category[]>;
type BrandListResponse = ApiResponse<Brand[]>;
type ProductDetailResponse = ApiResponse<Product>;

async function fetchPublicApi<T>(
  endpoint: string,
  revalidate: number = PUBLIC_REVALIDATE_SECONDS
): Promise<T | null> {
  const { data, error } = await safeServerFetch<T>(buildApiUrl(endpoint), {
    timeout: 8000,
    retries: 1,
    next: { revalidate },
  });

  if (error) {
    return null;
  }

  return data;
}

function buildQueryString(query: ProductQuery = {}): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export function getProductPath(product: Pick<Product, '_id' | 'slug'>): string {
  return `/products/${product._id}-${product.slug}`;
}

export function getPrimaryVariant(product: Product): ProductVariant | null {
  if (!product.variants?.length) {
    return null;
  }

  return product.variants.find((variant) => variant.isActive && variant.stock > 0) || product.variants[0] || null;
}

export function isProductIndexable(product: Product): boolean {
  return product.status === ProductStatus.ACTIVE;
}

export async function getProducts(query: ProductQuery = {}, revalidate: number = PUBLIC_REVALIDATE_SECONDS): Promise<ProductListResponse | null> {
  const queryString = buildQueryString(query);
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
  const response = await fetchPublicApi<ProductListResponse>(endpoint, revalidate);

  if (!response) {
    return null;
  }

  return {
    ...response,
    data: Array.isArray(response.data) ? response.data : [],
  };
}

export async function getNewProducts(limit: number = 4, revalidate: number = PUBLIC_REVALIDATE_SECONDS): Promise<Product[]> {
  const response = await getProducts({ isNew: true, limit, sort: 'createdAt', order: 'desc' }, revalidate);
  return response?.data?.filter(isProductIndexable) ?? [];
}

export async function getIndexableProductsForSitemap(): Promise<Product[]> {
  const response = await getProducts({ limit: 1000, sort: 'updatedAt', order: 'desc' }, SITEMAP_REVALIDATE_SECONDS);
  return response?.data?.filter(isProductIndexable) ?? [];
}

export async function getProductByIdentifier(identifier: string, revalidate: number = PUBLIC_REVALIDATE_SECONDS): Promise<Product | null> {
  const productId = identifier.split('-')[0];

  if (!productId) {
    return null;
  }

  const response = await fetchPublicApi<ProductDetailResponse>(`/api/products/${productId}`, revalidate);
  const product = response?.data ?? null;

  if (!product || !isProductIndexable(product)) {
    return null;
  }

  return product;
}

export async function getCategories(revalidate: number = PUBLIC_REVALIDATE_SECONDS): Promise<Category[]> {
  const response = await fetchPublicApi<CategoryListResponse>(`/api/categories`, revalidate);
  return response?.data?.filter((category) => category.isActive) ?? [];
}

export async function getBrands(revalidate: number = PUBLIC_REVALIDATE_SECONDS): Promise<Brand[]> {
  const response = await fetchPublicApi<BrandListResponse>(`/api/brands`, revalidate);
  return response?.data?.filter((brand) => brand.isActive) ?? [];
}

export async function getCategoryBySlug(slug: string, revalidate: number = PUBLIC_REVALIDATE_SECONDS): Promise<Category | null> {
  const categories = await getCategories(revalidate);
  return categories.find((category) => category.slug === slug) || null;
}

export async function getBrandBySlug(slug: string, revalidate: number = PUBLIC_REVALIDATE_SECONDS): Promise<Brand | null> {
  const brands = await getBrands(revalidate);
  return brands.find((brand) => brand.slug === slug) || null;
}
