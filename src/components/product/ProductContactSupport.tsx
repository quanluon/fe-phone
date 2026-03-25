'use client';

import { CONTACT_INFO } from '@/lib/constants';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export function ProductContactSupport() {
  const t = useTranslations('product.detail');

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-slate-950">
        {t('needHelp')}
      </h3>
      <p className="mb-4 text-sm text-slate-500">Talk to a specialist before checkout if you need help picking the right variant.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={`tel:${CONTACT_INFO.phoneLink}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <PhoneIcon className="h-5 w-5" />
          {t('callUs')}
        </a>
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <EnvelopeIcon className="h-5 w-5" />
          {t('emailUs')}
        </a>
      </div>
    </div>
  );
}
