'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DynamicNavigationProps {
  className?: string;
}

export const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ className = '' }) => {
  const { data: categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    setIsOpen(false);
    router.push(`/products?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <nav className={`${className.includes('flex-col') ? 'flex flex-col space-y-2' : 'hidden lg:flex items-center space-x-6 xl:space-x-8'} ${className}`}>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
      </nav>
    );
  }

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const isMobile = className.includes('flex-col');

  // Mobile version - simple list
  if (isMobile) {
    return (
      <nav className={`flex flex-col space-y-2 ${className}`}>
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {t('categories')}
        </div>
        {categories.map((category: Category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className="block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950"
          >
            {category.name}
          </button>
        ))}
      </nav>
    );
  }

  // Desktop version - dropdown
  return (
    <nav className={`hidden lg:flex items-center space-x-5 xl:space-x-6 ${className}`}>
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="flex items-center space-x-1 rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 xl:text-base"
        >
          <span>{t('categories')}</span>
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
        {/* Dropdown Menu */}
        <div
          className={`absolute top-full left-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200 ${
            isOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-2'
          }`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-2">
            {categories.map((category: Category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className="block w-full rounded-xl px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
