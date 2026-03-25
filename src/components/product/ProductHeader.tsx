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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
          {product.brand.name}
        </span>
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

      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarSolidIcon key={star} className="h-4 w-4 text-amber-400" />
          ))}
        </div>
        <span className="text-sm font-medium text-slate-600">4.8/5</span>
        <span className="text-sm text-slate-500">124 {t('reviewsCount')}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
          In stock
        </span>
      </div>
    </div>
  );
}
