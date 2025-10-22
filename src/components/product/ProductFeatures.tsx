'use client';

import { ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export function ProductFeatures() {
  const t = useTranslations('product.detail');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
      <div className="flex items-center gap-2">
        <TruckIcon className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-gray-600">{t('freeShipping')}</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-gray-600">{t('warranty')}</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-gray-600">{t('returns')}</span>
      </div>
    </div>
  );
}

