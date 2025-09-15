'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product, ProductVariant } from '@/types';
import { Card, Badge, NextImage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { formatCurrency, calculateDiscount, getImageUrl } from '@/lib/utils';
import { useCartWithTranslations } from '@/hooks/useCartWithTranslations';
import { useWishlistStore } from '@/stores/wishlist';
import { useUIStore } from '@/stores/ui';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant: ProductVariant) => void;
  onAddToWishlist?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onViewProduct,
  className,
}) => {
  const t = useTranslations('product');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [isHovered, setIsHovered] = useState(false);
  
  const { addItem: addToCart, getItemQuantity } = useCartWithTranslations();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();
  const { currency } = useUIStore();

  const isInWishlistState = isInWishlist(product._id);
  const discount = selectedVariant.originalPrice 
    ? calculateDiscount(selectedVariant.price, selectedVariant.originalPrice)
    : 0;

  // Calculate available stock considering cart quantity
  const cartQuantity = getItemQuantity(product._id, selectedVariant._id);
  const availableStock = selectedVariant.stock - cartQuantity;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedVariant);
    } else {
      const result = addToCart(product, selectedVariant);
      
      // If validation failed, the error toast is already shown by the store
      if (!result.isValid) {
        console.warn('Cart validation failed:', result.error);
      }
    }
  };

  const handleToggleWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
    } else {
      toggleWishlist(product);
    }
  };

  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct(product);
    }
  };

  return (
    <Card 
      variant="outlined"
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product._id}-${product.slug}`}>
          <NextImage
            src={getImageUrl(selectedVariant.images[0] || product.images[0])}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge variant="success" size="sm">{t('new')}</Badge>
          )}
          {product.isFeatured && (
            <Badge variant="warning" size="sm">{t('featured')}</Badge>
          )}
          {discount > 0 && (
            <Badge variant="danger" size="sm">{discount}% {t('off')}</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isInWishlistState
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          {isInWishlistState ? (
            <HeartSolidIcon className="h-4 w-4" />
          ) : (
            <HeartIcon className="h-4 w-4" />
          )}
        </button>

        {/* Quick Actions */}
        <div className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={availableStock === 0}
            >
              <ShoppingCartIcon className="h-4 w-4 mr-1" />
              {availableStock === 0 
                ? (cartQuantity > 0 ? t('inCart') : t('outOfStock'))
                : t('addToCart')
              }
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewProduct}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>

        {/* Product Name */}
        <Link href={`/products/${product._id}-${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors text-sm sm:text-base">
            {product.name}
          </h3>
        </Link>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <div className="mb-2 sm:mb-3">
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded border transition-colors ${
                    selectedVariant._id === variant._id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {variant.color}
                </button>
              ))}
              {product.variants.length > 3 && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-gray-500">
                  +{product.variants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            {formatCurrency(selectedVariant.price, currency)}
          </span>
          {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              {formatCurrency(selectedVariant.originalPrice, currency)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-xs text-gray-500">
          {availableStock > 0 ? (
            <span className="text-green-600">
              {availableStock} {t('inStock')}
              {cartQuantity > 0 && (
                <span className="text-blue-600 ml-1">
                  ({cartQuantity} {t('product.inCartCount')})
                </span>
              )}
            </span>
          ) : (
            <span className="text-red-600">
              {cartQuantity > 0 ? t('allInCart') : t('outOfStock')}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
