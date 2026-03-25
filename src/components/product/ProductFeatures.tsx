'use client';

import { ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export function ProductFeatures() {
  const t = useTranslations('product.detail');

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
        <TruckIcon className="h-5 w-5 text-sky-700" />
        <p className="mt-3 text-sm font-semibold text-slate-900">{t('freeShipping')}</p>
        <p className="mt-1 text-sm text-slate-500">Clear shipping messaging before checkout.</p>
      </div>
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
        <ShieldCheckIcon className="h-5 w-5 text-sky-700" />
        <p className="mt-3 text-sm font-semibold text-slate-900">{t('warranty')}</p>
        <p className="mt-1 text-sm text-slate-500">Warranty and service details stay visible.</p>
      </div>
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
        <ShieldCheckIcon className="h-5 w-5 text-sky-700" />
        <p className="mt-3 text-sm font-semibold text-slate-900">{t('returns')}</p>
        <p className="mt-1 text-sm text-slate-500">Returns and exchange reassurance near the CTA.</p>
      </div>
    </div>
  );
}
