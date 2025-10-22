'use client';

import { Badge } from '@/components/ui';
import { Product } from '@/types';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

interface ProductHeaderProps {
  product: Product;
  discount: number;
}

export function ProductHeader({ product, discount }: ProductHeaderProps) {
  const t = useTranslations('product.detail');
  const tProduct = useTranslations('product');

  return (
    <>
      {/* Brand & Badges */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{product.brand.name}</span>
        {product.isNew && (
          <Badge variant="success" size="sm">
            {tProduct('new')}
          </Badge>
        )}
        {product.isFeatured && (
          <Badge variant="warning" size="sm">
            {tProduct('featured')}
          </Badge>
        )}
        {discount > 0 && (
          <Badge variant="danger" size="sm">
            {discount}% {tProduct('off')}
          </Badge>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarSolidIcon key={star} className="h-5 w-5 text-yellow-400" />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          (4.8) • 124 {t('reviewsCount')}
        </span>
      </div>
    </>
  );
}

