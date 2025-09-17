'use client';

import { Card, NextImage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useWishlistStore } from '@/stores/wishlist';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import {
  ArrowLeftIcon,
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Product } from '@/types';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const { items: wishlistItems, removeItem: removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCart();
  const { currency } = useUIStore();

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: Product) => {
    // Add the first variant to cart (you might want to show variant selection)
    if (product.variants && product.variants.length > 0) {
      addToCart(product, product.variants[0], 1);
    }
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('continueShopping')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <HeartIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('empty')}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('emptyDescription')}
            </p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                {t('startShopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t('continueShopping')}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('itemCount', { count: wishlistItems.length })}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {t('clearAll')}
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product._id} className="group relative overflow-hidden">
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden">
                <NextImage
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  title={t('remove')}
                >
                  <HeartIcon className="h-5 w-5 fill-current text-red-500" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Price */}
                <div className="mb-4">
                  {product.variants && product.variants.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.variants[0].price, currency)}
                      </span>
                      {product.variants[0].originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.variants[0].originalPrice, currency)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!product.variants || product.variants.length === 0}
                  >
                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                    {t('addToCart')}
                  </Button>
                  
                  <Link href={`/products/${product._id}-${product.slug}`}>
                    <Button variant="outline" className="w-full">
                      {t('viewDetails')}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('youMightAlsoLike')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with recommended products */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
