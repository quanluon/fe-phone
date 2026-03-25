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
    <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
        <Button
          size="xl"
          onClick={onAddToCart}
          disabled={availableStock === 0 || isAddingToCart}
          className="w-full"
          variant="outline"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {stockMessage || (isAddingToCart ? t('adding') : tProduct('addToCart'))}
        </Button>

        <Button
          size="xl"
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
          size="xl"
          variant="outline"
          onClick={onShare}
          className="px-4"
        >
          <ShareIcon className="h-5 w-5" />
        </Button>
      </div>

      <Button
        size="xl"
        onClick={onBuyNow}
        disabled={availableStock === 0 || isBuyingNow}
        className="w-full"
        variant="brand"
      >
        {stockMessage || (isBuyingNow ? tProduct('buyingNow') : tProduct('buyNow'))}
      </Button>
      <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 px-3 py-2">Secure checkout</div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2">Official warranty</div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2">Fast delivery available</div>
      </div>
    </div>
  );
}
