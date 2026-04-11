'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { Input } from '@/components/atoms/Input';
import { AnalyticsItemListTracker } from '@/components/analytics/AnalyticsItemListTracker';
import { ProductCard } from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import { trackFilterChange, trackSearch } from '@/lib/firebase/analytics';
import { SORT_OPTIONS } from '@/lib/constants';
import { type ApiResponse, type Brand, type Category, type Product, type ProductQuery } from '@/types';

const PAGE_SIZE = 12;

type QueryState = {
  search: string;
  category: string;
  brand: string;
  productType: string;
  sortBy: string;
  page: number;
  minPrice: string;
  maxPrice: string;
};

type ProductsPageClientProps = {
  initialProducts: ApiResponse<Product[]> | null;
  initialCategories: Category[];
  initialBrands: Brand[];
  initialQueryState: QueryState;
  basePath?: string;
};

function buildProductsQuery({
  search,
  category,
  brand,
  productType,
  sortBy,
  page,
  minPrice,
  maxPrice,
}: QueryState): ProductQuery {
  const query: ProductQuery = { page, limit: PAGE_SIZE };

  if (sortBy.includes('created_at')) {
    query.sort = 'createdAt';
    query.order = sortBy.endsWith('_asc') ? 'asc' : 'desc';
  } else if (sortBy.includes('price')) {
    query.sort = 'basePrice';
    query.order = sortBy.endsWith('_asc') ? 'asc' : 'desc';
  } else {
    query.sort = 'name';
    query.order = sortBy.endsWith('_asc') ? 'asc' : 'desc';
  }

  if (search) query.search = search;
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (productType) query.productType = productType as ProductQuery['productType'];
  if (minPrice) query.minPrice = Number(minPrice);
  if (maxPrice) query.maxPrice = Number(maxPrice);

  return query;
}

function serializeQuery(query: ProductQuery): string {
  return JSON.stringify(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .sort(([left], [right]) => left.localeCompare(right))
  );
}

export function ProductsPageClient({
  initialProducts,
  initialCategories,
  initialBrands,
  initialQueryState,
  basePath = '/products',
}: ProductsPageClientProps) {
  const t = useTranslations('products');
  const router = useRouter();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQueryState.search);
  const [selectedCategory, setSelectedCategory] = useState(initialQueryState.category);
  const [selectedBrand, setSelectedBrand] = useState(initialQueryState.brand);
  const [selectedProductType, setSelectedProductType] = useState(initialQueryState.productType);
  const [sortBy, setSortBy] = useState(initialQueryState.sortBy);
  const [page, setPage] = useState(initialQueryState.page);
  const [priceRange, setPriceRange] = useState({
    min: initialQueryState.minPrice,
    max: initialQueryState.maxPrice,
  });
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [lastTrackedSearch, setLastTrackedSearch] = useState('');
  const [lastTrackedFiltersKey, setLastTrackedFiltersKey] = useState('');

  useEffect(() => {
    setSearchQuery(initialQueryState.search);
    setSelectedCategory(initialQueryState.category);
    setSelectedBrand(initialQueryState.brand);
    setSelectedProductType(initialQueryState.productType);
    setSortBy(initialQueryState.sortBy);
    setPage(initialQueryState.page);
    setPriceRange({
      min: initialQueryState.minPrice,
      max: initialQueryState.maxPrice,
    });
  }, [initialQueryState]);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const debouncedPriceRange = useDebounce(priceRange, 700);

  useEffect(() => {
    setIsSearchPending(searchQuery !== debouncedSearchQuery);
  }, [searchQuery, debouncedSearchQuery]);

  const query = useMemo(
    () =>
      buildProductsQuery({
        search: debouncedSearchQuery,
        category: selectedCategory,
        brand: selectedBrand,
        productType: selectedProductType,
        sortBy,
        page,
        minPrice: debouncedPriceRange.min,
        maxPrice: debouncedPriceRange.max,
      }),
    [debouncedPriceRange.max, debouncedPriceRange.min, debouncedSearchQuery, page, selectedBrand, selectedCategory, selectedProductType, sortBy]
  );

  const initialQuery = useMemo(() => buildProductsQuery(initialQueryState), [initialQueryState]);
  const shouldUseInitialProducts = serializeQuery(query) === serializeQuery(initialQuery);

  const { data: products, isLoading, error } = useProducts(
    query,
    shouldUseInitialProducts ? initialProducts ?? undefined : undefined
  );
  const { data: categories = initialCategories } = useCategories(initialCategories);
  const { data: brands = initialBrands } = useBrands(initialBrands);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedProductType) params.set('productType', selectedProductType);
    if (sortBy) params.set('sortBy', sortBy);
    if (debouncedPriceRange.min) params.set('minPrice', debouncedPriceRange.min);
    if (debouncedPriceRange.max) params.set('maxPrice', debouncedPriceRange.max);
    if (page > 1) params.set('page', String(page));

    router.replace(`${basePath}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [basePath, debouncedPriceRange.max, debouncedPriceRange.min, debouncedSearchQuery, page, router, selectedBrand, selectedCategory, selectedProductType, sortBy]);

  useEffect(() => {
    if (!debouncedSearchQuery.trim() || lastTrackedSearch === debouncedSearchQuery.trim()) {
      return;
    }

    setLastTrackedSearch(debouncedSearchQuery.trim());
    void trackSearch({
      query: debouncedSearchQuery,
      resultsCount: products?.data?.length,
      source: 'products_page',
      pagePath: `${basePath}?search=${encodeURIComponent(debouncedSearchQuery.trim())}`,
    });
  }, [basePath, debouncedSearchQuery, lastTrackedSearch, products?.data?.length]);

  useEffect(() => {
    const filtersKey = JSON.stringify({
      category: selectedCategory,
      brand: selectedBrand,
      sortBy,
      minPrice: debouncedPriceRange.min,
      maxPrice: debouncedPriceRange.max,
      hasSearch: Boolean(debouncedSearchQuery.trim()),
      resultsCount: products?.data?.length || 0,
    });

    if (filtersKey === lastTrackedFiltersKey) {
      return;
    }

    setLastTrackedFiltersKey(filtersKey);
    void trackFilterChange({
      pagePath: basePath,
      sortBy,
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      productType: selectedProductType || undefined,
      minPrice: debouncedPriceRange.min || undefined,
      maxPrice: debouncedPriceRange.max || undefined,
      hasSearch: Boolean(debouncedSearchQuery.trim()),
      resultsCount: products?.data?.length,
    });
  }, [
    debouncedPriceRange.max,
    debouncedPriceRange.min,
    debouncedSearchQuery,
    basePath,
    lastTrackedFiltersKey,
    products?.data?.length,
    selectedBrand,
    selectedCategory,
    selectedProductType,
    sortBy,
  ]);

  const getSortOptionLabel = (value: string) => {
    const sortKeyMap: Record<string, string> = {
      created_at_desc: 'newestFirst',
      created_at_asc: 'oldestFirst',
      price_asc: 'priceLowToHigh',
      price_desc: 'priceHighToLow',
      name_asc: 'nameAToZ',
      name_desc: 'nameZToA',
    };
    const key = sortKeyMap[value] || value;
    return t(`sortOptions.${key}` as never) || value;
  };

  const activeFilters = [
    debouncedSearchQuery ? { label: `${t('search')}: ${debouncedSearchQuery}`, onRemove: () => setSearchQuery('') } : null,
    selectedCategory
      ? {
          label: categories.find((category) => category._id === selectedCategory)?.name || t('category'),
          onRemove: () => setSelectedCategory(''),
        }
      : null,
    selectedBrand
      ? {
          label: brands.find((brand) => brand._id === selectedBrand)?.name || t('brand'),
          onRemove: () => setSelectedBrand(''),
        }
      : null,
    selectedProductType
      ? {
          label: selectedProductType,
          onRemove: () => setSelectedProductType(''),
        }
      : null,
    debouncedPriceRange.min
      ? {
          label: `${t('minPrice')}: ${debouncedPriceRange.min}`,
          onRemove: () => setPriceRange((prev) => ({ ...prev, min: '' })),
        }
      : null,
    debouncedPriceRange.max
      ? {
          label: `${t('maxPrice')}: ${debouncedPriceRange.max}`,
          onRemove: () => setPriceRange((prev) => ({ ...prev, max: '' })),
        }
      : null,
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  const activeFiltersCount = activeFilters.length;
  const totalPages = products?.pagination?.pages || 1;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedProductType('');
    setSortBy('created_at_desc');
    setPriceRange({ min: '', max: '' });
    setPage(1);
    router.push(basePath);
  };

  const updateFilterAndResetPage = (callback: () => void) => {
    callback();
    setPage(1);
  };

  const renderFilters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('filters')}</h2>
          <p className="text-sm text-slate-500">Lọc kết quả theo danh mục, thương hiệu và giá cả.</p>
        </div>
        <button
          onClick={() => setShowFilters(false)}
          className="rounded-full border border-slate-200 p-2 text-slate-500 lg:hidden"
          aria-label="Close filters"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">{t('search')}</label>
        <div className="relative">
          <Input
            type="search"
            placeholder={`${t('search')}...`}
            value={searchQuery}
            onChange={(event) => updateFilterAndResetPage(() => setSearchQuery(event.target.value))}
            leftIcon={<MagnifyingGlassIcon className={`h-4 w-4 ${isSearchPending ? 'text-sky-500' : 'text-slate-400'}`} />}
            className="border-slate-200 bg-slate-50"
          />
          {isSearchPending && (
            <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">{t('category')}</label>
        <select
          value={selectedCategory}
          onChange={(event) => updateFilterAndResetPage(() => setSelectedCategory(event.target.value))}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600"
        >
          <option value="">{t('allCategories')}</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">{t('brand')}</label>
        <select
          value={selectedBrand}
          onChange={(event) => updateFilterAndResetPage(() => setSelectedBrand(event.target.value))}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600"
        >
          <option value="">{t('allBrands')}</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">{t('priceRange')}</label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder={t('minPrice')}
            value={priceRange.min}
            onChange={(event) => updateFilterAndResetPage(() => setPriceRange((prev) => ({ ...prev, min: event.target.value })))}
            className="border-slate-200 bg-slate-50"
          />
          <Input
            type="number"
            placeholder={t('maxPrice')}
            value={priceRange.max}
            onChange={(event) => updateFilterAndResetPage(() => setPriceRange((prev) => ({ ...prev, max: event.target.value })))}
            className="border-slate-200 bg-slate-50"
          />
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          {t('clearAllFilters')} ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_36%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] pb-24">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Mua sắm tất cả sản phẩm</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {t('title')}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {products?.pagination?.total
                  ? t('productsCount', { count: products.pagination.total })
                  : t('discoverProducts')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 lg:hidden"
              >
                <FunnelIcon className="h-4 w-4" />
                {t('filters')}
                {activeFiltersCount > 0 && <Badge variant="secondary" size="sm">{activeFiltersCount}</Badge>}
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <ArrowsUpDownIcon className="h-4 w-4 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(event) => updateFilterAndResetPage(() => setSortBy(event.target.value))}
                  className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {getSortOptionLabel(option.value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={filter.onRemove}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                >
                  {filter.label}
                  <XMarkIcon className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex gap-6">
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              {renderFilters()}
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <AnalyticsItemListTracker
              products={products?.data || []}
              listName="Products Listing"
              listId="products_listing"
            />
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {products?.pagination?.total || 0} sản phẩm
                </p>
                <p className="text-xs text-slate-500">Sắp xếp để dễ nhận biết và quyết định nhanh hơn.</p>
              </div>
              <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex">
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                {activeFiltersCount} bộ lọc đang bật
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="aspect-square animate-pulse rounded-2xl bg-slate-100" />
                    <div className="mt-4 h-4 animate-pulse rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                    <div className="mt-6 h-11 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[2rem] border border-rose-200 bg-white p-10 text-center shadow-sm">
                <p className="text-base font-medium text-rose-600">{t('errorLoadingProducts')}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                  {t('tryAgain')}
                </Button>
              </div>
            ) : !products?.data?.length ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">{t('noProductsFound')}</p>
                <p className="mt-2 text-sm text-slate-500">Thử tìm kiếm khác hoặc xoá bộ lọc để xem các sản phẩm khác.</p>
                <Button className="mt-5" variant="outline" onClick={clearFilters}>
                  {t('clearFilters')}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {products.data.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      imagePriority={page === 1 && index === 0}
                      analyticsListName="Products Listing"
                      analyticsListId="products_listing"
                      analyticsIndex={index}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
                    <p className="text-sm text-slate-500">
                      Trang {page} / {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={page <= 1}
                      >
                        Trước
                      </Button>
                      <Button
                        variant="brand"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={page >= totalPages}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" onClick={() => setShowFilters(false)}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-white p-5"
            onClick={(event) => event.stopPropagation()}
          >
            {renderFilters()}
          </div>
        </div>
      )}
    </div>
  );
}
