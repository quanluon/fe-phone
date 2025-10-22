'use client';

import { formatCurrency } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import { ProductVariant } from '@/types';

interface ProductPriceProps {
  variant: ProductVariant;
}

export function ProductPrice({ variant }: ProductPriceProps) {
  const { currency } = useUIStore();

  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold text-gray-900">
        {formatCurrency(variant.price, currency)}
      </span>
      {variant.originalPrice && variant.originalPrice > variant.price && (
        <span className="text-xl text-gray-500 line-through">
          {formatCurrency(variant.originalPrice, currency)}
        </span>
      )}
    </div>
  );
}

