'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useDebounce } from '@/hooks/useDebounce';
import { Product, ProductQuery, ProductType } from '@/types';
import { PRODUCT_TYPE_LABELS, SORT_OPTIONS } from '@/lib/constants';

function ProductsContent() {
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper function to get translated product type label
  const getProductTypeLabel = (type: string) => {
    return t(`productTypes.${type}` as keyof typeof t) || type;
  };

  // Helper function to get translated sort option label
  const getSortOptionLabel = (value: string) => {
    const sortKeyMap: Record<string, string> = {
      'created_at_desc': 'newestFirst',
      'created_at_asc': 'oldestFirst',
      'price_asc': 'priceLowToHigh',
      'price_desc': 'priceHighToLow',
      'name_asc': 'nameAToZ',
      'name_desc': 'nameZToA'
    };
    const key = sortKeyMap[value] || value;
    return t(`sortOptions.${key}` as keyof typeof t) || value;
  };
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('productType') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at_desc');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });

  // Debounced values
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedPriceRange = useDebounce(priceRange, 800);

  // Build query object
  const query: ProductQuery = useMemo(() => {
    const params: ProductQuery = {
      page: 1,
      limit: 12,
      sortBy: sortBy as ProductQuery['sortBy'],
    };

    if (debouncedSearchQuery) params.search = debouncedSearchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedType) params.productType = selectedType as ProductType;
    if (debouncedPriceRange.min) params.minPrice = Number(debouncedPriceRange.min);
    if (debouncedPriceRange.max) params.maxPrice = Number(debouncedPriceRange.max);

    return params;
  }, [debouncedSearchQuery, selectedCategory, selectedBrand, selectedType, sortBy, debouncedPriceRange]);

  const { data: products, isLoading, error } = useProducts(query);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Update URL when debounced values change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedType) params.set('productType', selectedType);
    if (sortBy) params.set('sortBy', sortBy);
    if (debouncedPriceRange.min) params.set('minPrice', debouncedPriceRange.min);
    if (debouncedPriceRange.max) params.set('maxPrice', debouncedPriceRange.max);

    const newUrl = `/products?${params.toString()}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl);
    }
  }, [debouncedSearchQuery, selectedCategory, selectedBrand, selectedType, sortBy, debouncedPriceRange, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by debounced effect
  };

  const handleFilterChange = () => {
    // Filter changes are handled by debounced effect
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedType('');
    setSortBy('created_at_desc');
    setPriceRange({ min: '', max: '' });
    router.push('/products');
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedType,
    priceRange.min,
    priceRange.max
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600">
            {products?.pagination?.total ? t('productsCount', { count: products.pagination.total }) : t('discoverProducts')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{t('filters')}</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('search')}
                </label>
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder={t('search') + '...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                  />
                </form>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('category')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories?.data?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('brand')}
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('allBrands')}</option>
                  {brands?.data?.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('productType')}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('allTypes')}</option>
                  {Object.entries(PRODUCT_TYPE_LABELS).map(([key]) => (
                    <option key={key} value={key}>
                      {getProductTypeLabel(key)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('priceRange')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder={t('minPrice')}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder={t('maxPrice')}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  {t('clearAllFilters')} ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                  >
                    <FunnelIcon className="h-4 w-4" />
                    {t('filters')}
                    {activeFiltersCount > 0 && (
                      <Badge variant="default" size="sm">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    {products?.pagination?.total ? t('productsCount', { count: products.pagination.total }) : t('loadingProducts')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{t('sortBy')}:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleFilterChange();
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">{t('errorLoadingProducts')}</div>
                <Button onClick={() => window.location.reload()}>
                  {t('tryAgain')}
                </Button>
              </div>
            ) : !products?.data?.length ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">{t('noProductsFound')}</div>
                <Button onClick={clearFilters}>
                  {t('clearFilters')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.data.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {products?.data?.length && products.pagination.total > products.data.length && (
              <div className="text-center mt-8">
                <Button size="lg" variant="outline">
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}


