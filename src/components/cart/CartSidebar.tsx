'use client';

import { NextImage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useProductNavigation } from '@/hooks/useProductNavigation';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('cart');
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const { currency } = useUIStore();
  const { navigateToProduct } = useProductNavigation();

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

  const handleNavigateToProduct = (product: { _id: string; slug: string }) => {
    onClose();
    navigateToProduct(product);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {t('title')} ({totalItems})
              </h2>
              <p className="text-sm text-slate-500">Review items before moving to checkout.</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 p-2 text-slate-400 transition-colors hover:text-slate-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 py-10 text-center">
                <ShoppingBagIcon className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                <p className="font-medium text-slate-700">{t('empty')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.variant._id}`} className="rounded-[1.5rem] border border-slate-200 bg-white p-3">
                    <div className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50">
                        <NextImage
                          src={getImageUrl(item.variant.images[0] || item.product.images[0])}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.product._id}-${item.product.slug}`}
                          className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors hover:text-sky-800"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigateToProduct(item.product);
                          }}
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.variant.color} • {item.variant.storage}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(item.variant.price, currency)}
                          </p>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                              <button
                                onClick={() => handleQuantityChange(
                                  item.product._id,
                                  item.variant._id,
                                  item.quantity - 1
                                )}
                                className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-white"
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-3 w-3" />
                              </button>
                              <span className="min-w-[1.75rem] text-center text-xs font-semibold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(
                                  item.product._id,
                                  item.variant._id,
                                  item.quantity + 1
                                )}
                                className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-white"
                                disabled={item.quantity >= item.variant.stock}
                              >
                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.product._id, item.variant._id)}
                              className="rounded-full border border-slate-200 p-2 text-slate-400 transition-colors hover:text-rose-600"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 p-5">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{t('total')}</span>
                  <span className="text-xl font-semibold text-slate-950">
                    {formatCurrency(totalPrice, currency)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Link href="/orders/create" onClick={onClose}>
                  <Button size="lg" variant="brand" className="w-full">
                    {t('checkout.title')}
                  </Button>
                </Link>
                
                <Link href="/cart" onClick={onClose}>
                  <Button size="lg" variant="outline" className="w-full">
                    {t('viewCart')}
                  </Button>
                </Link>
                
                <Link href="/products" onClick={onClose}>
                  <Button size="lg" variant="ghost" className="w-full">
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

