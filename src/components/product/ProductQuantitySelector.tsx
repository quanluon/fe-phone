'use client';

import { useTranslations } from 'next-intl';

interface ProductQuantitySelectorProps {
  quantity: number;
  availableStock: number;
  cartQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductQuantitySelector({
  quantity,
  availableStock,
  cartQuantity,
  onQuantityChange,
}: ProductQuantitySelectorProps) {
  const t = useTranslations('product.detail');
  const tProduct = useTranslations('product');

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        {t('quantity')}
      </h3>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg hover:bg-white"
        >
          -
        </button>
        <span className="min-w-[3rem] text-center text-lg font-semibold text-slate-900">{quantity}</span>
        <button
          onClick={() => onQuantityChange(Math.min(availableStock, quantity + 1))}
          disabled={quantity >= availableStock}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      <div className="mt-3 text-sm text-slate-500">
        {availableStock > 0 ? (
          <span>
            {availableStock} {t('available')}
            {cartQuantity > 0 && (
              <span className="ml-1 text-sky-700">
                ({cartQuantity} {tProduct('inCartCount')})
              </span>
            )}
          </span>
        ) : (
          <span className="text-rose-600">
            {cartQuantity > 0
              ? tProduct('allItemsInCart')
              : tProduct('outOfStock')}
          </span>
        )}
      </div>
    </div>
  );
}
