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
    <div className="space-y-4">
      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {t('color')}
        </h3>
        <div className="flex gap-2">
          {product.variants.map((variant: ProductVariant) => (
            <button
              key={variant._id}
              onClick={() => onVariantChange(variant)}
              className={`px-4 py-2 rounded-md border-2 transition-colors ${
                selectedVariant._id === variant._id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {variant.color}
            </button>
          ))}
        </div>
      </div>

      {/* Storage Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {t('storage')}
        </h3>
        <div className="flex gap-2">
          {uniqueStorages.map((storage) => (
            <button
              key={storage as string}
              onClick={() => handleStorageChange(storage as string)}
              className={`px-4 py-2 rounded-md border-2 transition-colors ${
                selectedVariant.storage === storage
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
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

