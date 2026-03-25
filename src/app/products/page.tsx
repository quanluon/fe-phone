'use client';

import { ProductCard } from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/atoms/Input';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import { SORT_OPTIONS } from '@/lib/constants';
import { Product, ProductQuery } from '@/types';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 12;

function ProductsContent() {
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at_desc');
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSortBy(searchParams.get('sortBy') || 'created_at_desc');
    setPage(Number(searchParams.get('page') || '1'));
    setPriceRange({
      min: searchParams.get('minPrice') || '',
      max: searchParams.get('maxPrice') || '',
    });
  }, [searchParams]);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const debouncedPriceRange = useDebounce(priceRange, 700);
  const [isSearchPending, setIsSearchPending] = useState(false);

  const query: ProductQuery = useMemo(() => {
    const params: ProductQuery = { page, limit: PAGE_SIZE };

    if (sortBy.includes('created_at')) {
      params.sort = 'createdAt';
      params.order = sortBy.endsWith('_asc') ? 'asc' : 'desc';
    } else if (sortBy.includes('price')) {
      params.sort = 'basePrice';
      params.order = sortBy.endsWith('_asc') ? 'asc' : 'desc';
    } else {
      params.sort = 'name';
      params.order = sortBy.endsWith('_asc') ? 'asc' : 'desc';
    }

    if (debouncedSearchQuery) params.search = debouncedSearchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (debouncedPriceRange.min) params.minPrice = Number(debouncedPriceRange.min);
    if (debouncedPriceRange.max) params.maxPrice = Number(debouncedPriceRange.max);

    return params;
  }, [debouncedPriceRange, debouncedSearchQuery, page, selectedBrand, selectedCategory, sortBy]);

  const { data: products, isLoading, error } = useProducts(query);
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  useEffect(() => {
    setIsSearchPending(searchQuery !== debouncedSearchQuery);
  }, [searchQuery, debouncedSearchQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (sortBy) params.set('sortBy', sortBy);
    if (debouncedPriceRange.min) params.set('minPrice', debouncedPriceRange.min);
    if (debouncedPriceRange.max) params.set('maxPrice', debouncedPriceRange.max);
    if (page > 1) params.set('page', String(page));

    const nextUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [debouncedPriceRange, debouncedSearchQuery, page, router, selectedBrand, selectedCategory, sortBy]);

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
    priceRange.min ? { label: `${t('minPrice')}: ${priceRange.min}`, onRemove: () => setPriceRange((prev) => ({ ...prev, min: '' })) } : null,
    priceRange.max ? { label: `${t('maxPrice')}: ${priceRange.max}`, onRemove: () => setPriceRange((prev) => ({ ...prev, max: '' })) } : null,
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  const activeFiltersCount = activeFilters.length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('created_at_desc');
    setPriceRange({ min: '', max: '' });
    setPage(1);
    router.push('/products');
  };

  const updateFilterAndResetPage = (callback: () => void) => {
    callback();
    setPage(1);
  };

  const totalPages = products?.pagination?.pages || 1;

  const renderFilters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('filters')}</h2>
          <p className="text-sm text-slate-500">Refine results by category, brand, and budget.</p>
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
            onChange={(e) => updateFilterAndResetPage(() => setSearchQuery(e.target.value))}
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
          onChange={(e) => updateFilterAndResetPage(() => setSelectedCategory(e.target.value))}
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
          onChange={(e) => updateFilterAndResetPage(() => setSelectedBrand(e.target.value))}
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
            onChange={(e) => updateFilterAndResetPage(() => setPriceRange((prev) => ({ ...prev, min: e.target.value })))}
            className="border-slate-200 bg-slate-50"
          />
          <Input
            type="number"
            placeholder={t('maxPrice')}
            value={priceRange.max}
            onChange={(e) => updateFilterAndResetPage(() => setPriceRange((prev) => ({ ...prev, max: e.target.value })))}
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
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Shop all products</p>
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
                  onChange={(e) => updateFilterAndResetPage(() => setSortBy(e.target.value))}
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
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {products?.pagination?.total || 0} products
                </p>
                <p className="text-xs text-slate-500">Sorted for easier comparison and faster buying decisions.</p>
              </div>
              <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex">
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                {activeFiltersCount} active filter{activeFiltersCount === 1 ? '' : 's'}
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
                <p className="mt-2 text-sm text-slate-500">Try a broader search or clear some filters to discover more products.</p>
                <Button className="mt-5" variant="outline" onClick={clearFilters}>
                  {t('clearFilters')}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {products.data.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
                    <p className="text-sm text-slate-500">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={page <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="brand"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={page >= totalPages}
                      >
                        Next
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" />
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
