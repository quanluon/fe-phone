'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, NextImage } from '@/components/ui';
import { useCartStore } from '@/stores/cart';
import { useUIStore } from '@/stores/ui';
import { formatCurrency, getImageUrl } from '@/lib/utils';

export default function CartPage() {
  const t = useTranslations('cart');
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();
  const { currency } = useUIStore();

  const handleQuantityChange = (productId: string, variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, variantId);
    } else {
      updateQuantity(productId, variantId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    removeItem(productId, variantId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (items.length === 0) {
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
              Continue Shopping
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
          </div>

          {/* Empty Cart */}
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('empty')}</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                {t('continueShopping')}
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
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
            <button
              onClick={handleClearCart}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.variant._id}`} className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <NextImage
                        src={getImageUrl(item.variant.images[0] || item.product.images[0])}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.product._id}-${item.product.slug}`}
                            className="text-sm sm:text-base font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.variant.color} • {item.variant.storage}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            {formatCurrency(item.variant.price, currency)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product._id, item.variant._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm text-gray-600">{t('quantity')}:</span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(
                              item.product._id, 
                              item.variant._id, 
                              item.quantity - 1
                            )}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.product._id, 
                              item.variant._id, 
                              item.quantity + 1
                            )}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity >= item.variant.stock}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        {item.quantity >= item.variant.stock && (
                          <span className="text-xs text-red-600">
                            Max stock: {item.variant.stock}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('orderSummary')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('items')} ({totalItems})</span>
                  <span className="text-gray-900">{formatCurrency(totalPrice, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('shipping')}</span>
                  <span className="text-green-600">{t('free')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('tax')}</span>
                  <span className="text-gray-900">{t('calculatedAtCheckout')}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">{t('total')}</span>
                    <span className="text-base font-semibold text-gray-900">
                      {formatCurrency(totalPrice, currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // TODO: Implement checkout flow
                    alert('Checkout functionality will be implemented soon!');
                  }}
                >
                  {t('checkout')}
                </Button>
                
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                  >
                    {t('continueShopping')}
                  </Button>
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </Card>
          </div>
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


