import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { useBestSellingProducts } from '@/hooks/useProducts';

export const BestSellingSection: React.FC = () => {
  const t = useTranslations('home.bestSelling');
  const { data: products, isLoading, error } = useBestSellingProducts(8);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mx-auto mb-2 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-64 sm:w-96 mx-auto mb-6 sm:mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 sm:h-72 lg:h-80 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !products) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t('title')}</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {products?.data?.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products?sortBy=created_at_desc">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              {t('viewAllProducts')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
