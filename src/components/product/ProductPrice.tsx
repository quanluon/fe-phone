'use client';

import { formatCurrency } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import { Product, ProductVariant } from '@/types';
import { ContactPrice } from '../molecules/ContactPrice';
import { shouldHideProductPrice } from '@/lib/utils';

interface ProductPriceProps {
  product: Product;
  variant: ProductVariant;
}

export function ProductPrice({ product, variant }: ProductPriceProps) {
  const { currency } = useUIStore();
  const isContactOnly = shouldHideProductPrice(product, variant);

  return (
    <div className="rounded-[1.5rem] bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Today&apos;s price</p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        {isContactOnly ? (
          <ContactPrice label="Liên hệ" />
        ) : (
          <>
            <span className="text-3xl font-semibold text-slate-950">
              {formatCurrency(variant.price, currency)}
            </span>
            {variant.originalPrice && variant.originalPrice > variant.price && (
              <span className="text-lg text-slate-400 line-through">
                {formatCurrency(variant.originalPrice, currency)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
