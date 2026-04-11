import { ProductsPageClient } from '@/components/product/ProductsPageClient';
import { DEFAULT_PRODUCTS_PAGE_SIZE, getBrands, getCategories, getProducts } from '@/lib/api/server-catalog';
import { CONTACT_INFO } from '@/lib/constants';
import { getDefaultMetaDescription } from '@/lib/seo';
import type { Metadata } from 'next';

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: 'Danh sach san pham Apple gia tot',
  description: 'Xem danh sach iPhone, iPad, MacBook, Apple Watch, AirPods va phu kien Apple tai Nguyen Cong Mobile.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: `Danh sach san pham | ${CONTACT_INFO.name}`,
    description: getDefaultMetaDescription(),
    url: '/products',
    locale: 'vi_VN',
  },
};

function getSingleValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] || '';
  }

  return value || '';
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) || {};
  const initialQueryState = {
    search: getSingleValue(resolvedSearchParams.search),
    category: getSingleValue(resolvedSearchParams.category),
    brand: getSingleValue(resolvedSearchParams.brand),
    productType: getSingleValue(resolvedSearchParams.productType),
    sortBy: getSingleValue(resolvedSearchParams.sortBy) || 'created_at_desc',
    page: Math.max(1, Number(getSingleValue(resolvedSearchParams.page) || '1') || 1),
    minPrice: getSingleValue(resolvedSearchParams.minPrice),
    maxPrice: getSingleValue(resolvedSearchParams.maxPrice),
  };

  const initialProductsQuery = {
    page: initialQueryState.page,
    limit: DEFAULT_PRODUCTS_PAGE_SIZE,
    search: initialQueryState.search || undefined,
    category: initialQueryState.category || undefined,
    brand: initialQueryState.brand || undefined,
    productType: initialQueryState.productType || undefined,
    minPrice: initialQueryState.minPrice ? Number(initialQueryState.minPrice) : undefined,
    maxPrice: initialQueryState.maxPrice ? Number(initialQueryState.maxPrice) : undefined,
    sort: initialQueryState.sortBy.includes('price')
      ? 'basePrice'
      : initialQueryState.sortBy.includes('name')
        ? 'name'
        : 'createdAt',
    order: initialQueryState.sortBy.endsWith('_asc') ? 'asc' : 'desc',
  } as const;

  const [initialProducts, initialCategories, initialBrands] = await Promise.all([
    getProducts(initialProductsQuery),
    getCategories(),
    getBrands(),
  ]);

  return (
    <ProductsPageClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
      initialBrands={initialBrands}
      initialQueryState={initialQueryState}
    />
  );
}
