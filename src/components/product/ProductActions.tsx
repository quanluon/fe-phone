'use client';

import { Button } from '@/components/ui/Button';
import {
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

interface ProductActionsProps {
  availableStock: number;
  cartQuantity: number;
  isAddingToCart: boolean;
  isBuyingNow: boolean;
  isInWishlist: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
}

export function ProductActions({
  availableStock,
  cartQuantity,
  isAddingToCart,
  isBuyingNow,
  isInWishlist,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onShare,
}: ProductActionsProps) {
  const t = useTranslations('product.detail');
  const tProduct = useTranslations('product');

  const getStockMessage = () => {
    if (availableStock === 0) {
      return cartQuantity > 0
        ? tProduct('allItemsInCart')
        : tProduct('outOfStock');
    }
    return null;
  };

  const stockMessage = getStockMessage();

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={onAddToCart}
          disabled={availableStock === 0 || isAddingToCart}
          className="flex-1"
          variant="outline"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {stockMessage || (isAddingToCart ? t('adding') : tProduct('addToCart'))}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onToggleWishlist}
          className="px-4"
        >
          {isInWishlist ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onShare}
          className="px-4"
        >
          <ShareIcon className="h-5 w-5" />
        </Button>
      </div>

      <Button
        size="lg"
        onClick={onBuyNow}
        disabled={availableStock === 0 || isBuyingNow}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {stockMessage || (isBuyingNow ? tProduct('buyingNow') : tProduct('buyNow'))}
      </Button>
    </div>
  );
}

