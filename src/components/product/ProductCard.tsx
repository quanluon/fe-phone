'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HeartIcon, ShoppingCartIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product, ProductVariant } from '@/types';
import { Card, Badge, NextImage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { trackSelectItem } from '@/lib/firebase/analytics';
import { formatCurrency, calculateDiscount, getImageUrl } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';
import { useCart } from '@/hooks/useCart';
import { useWishlistStore } from '@/stores/wishlist';
import { useUIStore } from '@/stores/ui';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant: ProductVariant) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  className?: string;
  imagePriority?: boolean;
  analyticsListName?: string;
  analyticsListId?: string;
  analyticsIndex?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onViewProduct,
  className,
  imagePriority = false,
  analyticsListName,
  analyticsListId,
  analyticsIndex,
}) => {
  const t = useTranslations('product');
  const router = useRouter();
  const productHref = `/products/${product._id}-${product.slug}`;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);

  const { addItem: addToCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();
  const { currency } = useUIStore();
  const isInWishlistState = isInWishlist(product._id);

  const discount = selectedVariant.originalPrice
    ? calculateDiscount(selectedVariant.price, selectedVariant.originalPrice)
    : 0;

  const cartQuantity = getItemQuantity(product._id, selectedVariant._id);
  const availableStock = selectedVariant.stock - cartQuantity;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedVariant);
      return;
    }

    const result = addToCart(product, selectedVariant);
    if (!result.isValid) {
      logger.warn({ productId: product._id, variantId: selectedVariant._id, error: result.error }, 'Cart validation failed');
    }
  };

  const handleToggleWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
      return;
    }
    toggleWishlist(product);
  };

  const handleViewProduct = () => {
    void trackSelectItem({
      product,
      variant: selectedVariant,
      currency: 'VND',
      listName: analyticsListName,
      listId: analyticsListId,
      index: analyticsIndex,
    });

    if (onViewProduct) {
      onViewProduct(product);
      return;
    }
    router.push(productHref);
  };

  const handlePrefetchProduct = () => {
    router.prefetch(productHref);
  };

  return (
    <Card
      variant="outlined"
      className={`group overflow-hidden border-slate-200 bg-white ${className || ''}`}
    >
      <div className="relative">
        <Link
          href={productHref}
          prefetch
          onClick={handleViewProduct}
          onMouseEnter={handlePrefetchProduct}
          onFocus={handlePrefetchProduct}
          onTouchStart={handlePrefetchProduct}
          className="block"
        >
          <div className="relative aspect-square overflow-hidden bg-slate-50">
            <NextImage
              src={getImageUrl(selectedVariant.images[0] || product.images[0])}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={imagePriority}
            />
          </div>
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNew && <Badge variant="secondary" size="sm">New</Badge>}
          {product.isFeatured && <Badge variant="warning" size="sm">Featured</Badge>}
          {discount > 0 && <Badge variant="danger" size="sm">-{discount}%</Badge>}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`rounded-full border p-2 shadow-sm backdrop-blur transition-colors ${
              isInWishlistState
                ? 'border-rose-200 bg-rose-50 text-rose-500'
                : 'border-white/70 bg-white/90 text-slate-600 hover:text-rose-500'
            }`}
            aria-label="Toggle wishlist"
          >
            {isInWishlistState ? (
              <HeartSolidIcon className="h-4 w-4" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleViewProduct}
            onMouseEnter={handlePrefetchProduct}
            onFocus={handlePrefetchProduct}
            onTouchStart={handlePrefetchProduct}
            className="rounded-full border border-white/70 bg-white/90 p-2 text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-slate-950"
            aria-label="View product"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {product.brand.name}
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <StarIcon className="h-4 w-4" />
              <span>4.8</span>
            </div>
          </div>

          <Link
            href={productHref}
            prefetch
            onClick={handleViewProduct}
            onMouseEnter={handlePrefetchProduct}
            onFocus={handlePrefetchProduct}
            onTouchStart={handlePrefetchProduct}
            className="block"
          >
            <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-6 text-slate-900 transition-colors hover:text-sky-800">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="line-clamp-2 text-sm text-slate-500">
              {product.shortDescription}
            </p>
          )}
        </div>

        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {product.variants.slice(0, 4).map((variant) => (
              <button
                key={variant._id}
                onClick={() => setSelectedVariant(variant)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedVariant._id === variant._id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                }`}
              >
                {variant.color}
              </button>
            ))}
            {product.variants.length > 4 && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                +{product.variants.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Starting at</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-semibold text-slate-950">
                  {formatCurrency(selectedVariant.price, currency)}
                </span>
                {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(selectedVariant.originalPrice, currency)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-xs">
              {availableStock > 0 ? (
                <>
                  <p className="font-semibold text-emerald-600">{availableStock} {t('inStock')}</p>
                  {cartQuantity > 0 && (
                    <p className="text-sky-700">{cartQuantity} {t('inCartCount')}</p>
                  )}
                </>
              ) : (
                <p className="font-semibold text-rose-600">
                  {cartQuantity > 0 ? t('allInCart') : t('outOfStock')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="lg"
            variant="brand"
            onClick={handleAddToCart}
            disabled={availableStock === 0}
            className="flex-1"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {availableStock === 0
              ? (cartQuantity > 0 ? t('inCart') : t('outOfStock'))
              : t('addToCart')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleViewProduct}
            onMouseEnter={handlePrefetchProduct}
            onFocus={handlePrefetchProduct}
            onTouchStart={handlePrefetchProduct}
            className="px-4"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
