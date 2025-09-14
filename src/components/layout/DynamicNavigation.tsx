'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';

interface DynamicNavigationProps {
  className?: string;
}

export const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ className = '' }) => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <nav className={`${className.includes('flex-col') ? 'flex flex-col space-y-2' : 'hidden lg:flex items-center space-x-6 xl:space-x-8'} ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
        ))}
      </nav>
    );
  }

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  // Take first 6 categories for navigation
  const navCategories = categories.slice(0, 6);

  const isMobile = className.includes('flex-col');

  return (
    <nav className={`${isMobile ? 'flex flex-col space-y-2' : 'hidden lg:flex items-center space-x-6 xl:space-x-8'} ${className}`}>
      {navCategories.map((category: Category) => (
        <div key={category._id} className="relative group">
          <Link
            href={`/products?category=${category._id}`}
            className={`flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors ${
              isMobile 
                ? 'block px-3 py-2 hover:bg-gray-50 rounded-md' 
                : 'text-sm xl:text-base'
            }`}
          >
            <span>{category.name}</span>
            {!isMobile && <ChevronDownIcon className="h-4 w-4" />}
          </Link>
          
          {/* Category dropdown could be added here in the future */}
        </div>
      ))}
    </nav>
  );
};
