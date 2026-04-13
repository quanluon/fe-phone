'use client';

import { Product, ProductVariant } from '@/types';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

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

  const activeVariants = useMemo(
    () => product.variants.filter((variant) => variant.isActive),
    [product.variants]
  );

  const uniqueColors = useMemo(
    () => Array.from(new Map(activeVariants.map((variant) => [variant.color, variant])).values()),
    [activeVariants]
  );

  const uniqueStorages = useMemo(
    () => Array.from(new Set(activeVariants.map((variant) => variant.storage).filter(Boolean))) as string[],
    [activeVariants]
  );

  const findBestVariant = (variants: ProductVariant[]) =>
    variants.find((variant) => variant.stock > 0) || variants[0] || null;

  const getColorVariants = (color: string) => activeVariants.filter((variant) => variant.color === color);
  const getStorageVariants = (storage: string) => activeVariants.filter((variant) => variant.storage === storage);

  const handleColorChange = (color: string) => {
    const colorVariants = getColorVariants(color);
    const preferredVariants = selectedVariant.storage
      ? colorVariants.filter((variant) => variant.storage === selectedVariant.storage)
      : colorVariants;

    const nextVariant = findBestVariant(preferredVariants) || findBestVariant(colorVariants);
    if (nextVariant) {
      onVariantChange(nextVariant);
    }
  };

  const handleStorageChange = (storage: string) => {
    const storageVariants = activeVariants.filter(
      (variant) => variant.storage === storage && variant.color === selectedVariant.color
    );
    const fallbackVariants = getStorageVariants(storage);
    const nextVariant = findBestVariant(storageVariants) || findBestVariant(fallbackVariants);

    if (nextVariant) {
      onVariantChange(nextVariant);
    }
  };

  const getColorState = (color: string) => {
    const colorVariants = getColorVariants(color);
    const matchingCurrentStorage = selectedVariant.storage
      ? colorVariants.filter((variant) => variant.storage === selectedVariant.storage)
      : colorVariants;
    const relevantVariants = matchingCurrentStorage.length ? matchingCurrentStorage : colorVariants;

    if (selectedVariant.color !== color && selectedVariant.storage && matchingCurrentStorage.length === 0) {
      return 'unavailable';
    }

    if (!relevantVariants.some((variant) => variant.stock > 0)) {
      return 'out-of-stock';
    }

    return selectedVariant.color === color ? 'selected' : 'available';
  };

  const getStorageState = (storage: string) => {
    const matchingVariants = activeVariants.filter(
      (variant) => variant.storage === storage && variant.color === selectedVariant.color
    );

    if (matchingVariants.length === 0) {
      return 'unavailable';
    }

    if (!matchingVariants.some((variant) => variant.stock > 0)) {
      return 'out-of-stock';
    }

    return selectedVariant.storage === storage ? 'selected' : 'available';
  };

  const getOptionClasses = (state: 'selected' | 'available' | 'out-of-stock' | 'unavailable') => {
    if (state === 'selected') {
      return 'border-slate-900 bg-slate-900 text-white shadow-[0_10px_25px_-18px_rgba(15,23,42,0.9)]';
    }

    if (state === 'out-of-stock') {
      return 'border-amber-300 bg-amber-50 text-amber-800';
    }

    if (state === 'unavailable') {
      return 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through opacity-70';
    }

    return 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white';
  };

  return (
    <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      {/* Color Selection */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            {t('color')}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map((variant: ProductVariant) => {
            const state = getColorState(variant.color);
            const disabled = state === 'unavailable';

            return (
              <button
                key={variant.color}
                type="button"
                onClick={() => handleColorChange(variant.color)}
                disabled={disabled}
                aria-pressed={state === 'selected'}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${getOptionClasses(state)}`}
              >
                <span>{variant.color}</span>
                {state === 'out-of-stock' ? (
                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    {t('variant.outOfStock')}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Selection */}
      {uniqueStorages.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              {t('storage')}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueStorages.map((storage) => {
              const state = getStorageState(storage);
              const disabled = state === 'unavailable';

              return (
                <button
                  key={storage}
                  type="button"
                  onClick={() => handleStorageChange(storage)}
                  disabled={disabled}
                  aria-pressed={state === 'selected'}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${getOptionClasses(state)}`}
                >
                  <span>{storage}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
