'use client';

import { NextImage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import { useLoadingStore } from '@/stores/loading';
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const { currency } = useUIStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const router = useRouter();

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

  const handleNavigateToProduct = (productId: string, productSlug: string) => {
    showLoading(tCommon('loading'));
    onClose();
    router.push(`/products/${productId}-${productSlug}`);
    setTimeout(() => hideLoading(), 300);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('title')} ({totalItems})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t('empty')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.variant._id}`} className="flex gap-3">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0">
                      <NextImage
                        src={getImageUrl(item.variant.images[0] || item.product.images[0])}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product._id}-${item.product.slug}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigateToProduct(item.product._id, item.product.slug);
                        }}
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variant.color} • {item.variant.storage}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(item.variant.price, currency)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(
                              item.product._id, 
                              item.variant._id, 
                              item.quantity - 1
                            )}
                            className="p-1 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="px-2 py-1 text-xs font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.product._id, 
                              item.variant._id, 
                              item.quantity + 1
                            )}
                            className="p-1 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity >= item.variant.stock}
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.product._id, item.variant._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">{t('total')}</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(totalPrice, currency)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Link href="/orders/create" onClick={onClose}>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    {t('checkout.title')}
                  </Button>
                </Link>
                
                <Link href="/cart" onClick={onClose}>
                  <Button size="sm" variant="outline" className="w-full">
                    {t('viewCart')}
                  </Button>
                </Link>
                
                <Link href="/products" onClick={onClose}>
                  <Button size="sm" variant="outline" className="w-full">
                    {t('continueShopping')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


