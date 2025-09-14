import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { CategoryCard } from '@/components/product/CategoryCard';
import { useCategories } from '@/hooks/useCategories';
import { CATEGORY_ICONS } from '@/lib/constants';

export const CategorySection: React.FC = () => {
  const t = useTranslations('home.categories');
  const tErrors = useTranslations('errors');
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mx-auto mb-6 sm:mb-8"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-24 sm:h-28 md:h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">{tErrors('failedToLoadCategories')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.data.length) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('title')}</h2>
          <div className="hidden sm:flex items-center space-x-2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
          {categories.data.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.name as keyof typeof CATEGORY_ICONS];
            
            return (
              <CategoryCard
                key={category._id}
                category={category}
                icon={IconComponent && <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
