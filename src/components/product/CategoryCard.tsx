import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { Card } from '@/components/ui';
import { CATEGORY_ICONS } from '@/lib/constants';

interface CategoryCardProps {
  category: Category;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
  onClick,
  className,
}) => {
  const IconComponent = CATEGORY_ICONS[category.name as keyof typeof CATEGORY_ICONS];

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const content = (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center p-4">
        {/* Icon */}
        <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
          {icon || (IconComponent && <IconComponent className="w-8 h-8 text-blue-600" />)}
        </div>

        {/* Category Name */}
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>

        {/* Description */}
        {category.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Card>
  );

  if (onClick) {
    return content;
  }

  return (
    <Link href={`/products?category=${category._id}`}>
      {content}
    </Link>
  );
};

