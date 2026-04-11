'use client';

import { Card, NextImage } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useProductNavigation } from '@/hooks/useProductNavigation';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CartPage() {
  const t = useTranslations('cart');
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { currency } = useUIStore();
  const { navigateToProduct } = useProductNavigation();

  const handleQuantityChange = (productId: string, variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    updateQuantity(productId, variantId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <ShoppingBagIcon className="mx-auto h-20 w-20 text-slate-300" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-950">{t('title')}</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/products">
                <Button variant="brand" size="xl">
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] pb-28 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/products"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:text-slate-900"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('continueShopping')}
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t('title')}</h1>
            <p className="mt-2 text-sm text-slate-500">{totalItems} item{totalItems === 1 ? '' : 's'} ready for checkout.</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_24rem]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={`${item.product._id}-${item.variant._id}`} className="border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex gap-4">
                  <button
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-50"
                    onClick={() => navigateToProduct(item.product)}
                    aria-label={item.product.name}
                  >
                    <NextImage
                      src={getImageUrl(item.variant.images[0] || item.product.images[0])}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          onClick={() => navigateToProduct(item.product)}
                          className="line-clamp-2 text-left text-base font-semibold text-slate-900 transition-colors hover:text-sky-800"
                        >
                          {item.product.name}
                        </button>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.variant.color} • {item.variant.storage}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id, item.variant._id)}
                        className="rounded-full border border-slate-200 p-2 text-slate-400 transition-colors hover:text-rose-600"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">{t('quantity')}</span>
                        <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.variant._id, item.quantity - 1)}
                            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2.5rem] text-center text-sm font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.variant._id, item.quantity + 1)}
                            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white"
                            disabled={item.quantity >= item.variant.stock}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        {item.quantity >= item.variant.stock && (
                          <span className="text-xs font-medium text-rose-600">Max stock: {item.variant.stock}</span>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-500">Unit price</p>
                        <p className="text-lg font-semibold text-slate-950">
                          {formatCurrency(item.variant.price, currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="sticky top-24 border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-950">{t('orderSummary')}</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t('items')} ({totalItems})</span>
                  <span className="font-medium text-slate-900">{formatCurrency(totalPrice, currency)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t('shipping')}</span>
                  <span className="font-medium text-emerald-600">{t('free')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t('tax')}</span>
                  <span className="font-medium text-slate-900">{t('calculatedAtCheckout')}</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{t('total')}</span>
                    <span className="text-2xl font-semibold text-slate-950">{formatCurrency(totalPrice, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/orders/create">
                  <Button variant="brand" size="xl" className="w-full">
                    {t('checkout.title')}
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="w-full">
                    {t('continueShopping')}
                  </Button>
                </Link>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                  <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                  Secure checkout with SSL encryption
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">Estimated shipping and payment details shown before order submission.</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-500">{totalItems} item{totalItems === 1 ? '' : 's'}</p>
            <p className="text-lg font-semibold text-slate-950">{formatCurrency(totalPrice, currency)}</p>
          </div>
          <Link href="/orders/create" className="shrink-0">
            <Button variant="brand">{t('checkout.title')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
