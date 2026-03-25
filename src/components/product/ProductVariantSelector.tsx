'use client';

import { Product, ProductVariant } from '@/types';
import { useTranslations } from 'next-intl';

interface ProductVariantSelectorProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
}

export function ProductVariantSelector({
  product,
  selectedVariant,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const t = useTranslations('product.detail');

  const handleStorageChange = (storage: string) => {
    const variant = product.variants.find(
      (v: ProductVariant) =>
        v.storage === storage && v.color === selectedVariant.color
    );
    if (variant) onVariantChange(variant);
  };

  const uniqueStorages = Array.from(
    new Set(product.variants.map((v: ProductVariant) => v.storage))
  );

  return (
    <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      {/* Color Selection */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          {t('color')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant: ProductVariant) => (
            <button
              key={variant._id}
              onClick={() => onVariantChange(variant)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedVariant._id === variant._id
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {variant.color}
            </button>
          ))}
        </div>
      </div>

      {/* Storage Selection */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          {t('storage')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {uniqueStorages.map((storage) => (
            <button
              key={storage as string}
              onClick={() => handleStorageChange(storage as string)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedVariant.storage === storage
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {storage as string}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
