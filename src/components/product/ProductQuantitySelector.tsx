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
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        {t('quantity')}
      </h3>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          -
        </button>
        <span className="w-12 text-center">{quantity}</span>
        <button
          onClick={() => onQuantityChange(Math.min(availableStock, quantity + 1))}
          disabled={quantity >= availableStock}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      <div className="text-sm text-gray-500 mt-1">
        {availableStock > 0 ? (
          <span>
            {availableStock} {t('available')}
            {cartQuantity > 0 && (
              <span className="text-blue-600 ml-1">
                ({cartQuantity} {tProduct('inCartCount')})
              </span>
            )}
          </span>
        ) : (
          <span className="text-red-600">
            {cartQuantity > 0
              ? tProduct('allItemsInCart')
              : tProduct('outOfStock')}
          </span>
        )}
      </div>
    </div>
  );
}

