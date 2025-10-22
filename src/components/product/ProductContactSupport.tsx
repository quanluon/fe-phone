'use client';

import { CONTACT_INFO } from '@/lib/constants';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export function ProductContactSupport() {
  const t = useTranslations('product.detail');

  return (
    <div className="pt-6 border-t">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        {t('needHelp')}
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`tel:${CONTACT_INFO.phoneLink}`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <PhoneIcon className="h-5 w-5" />
          {t('callUs')}
        </a>
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <EnvelopeIcon className="h-5 w-5" />
          {t('emailUs')}
        </a>
      </div>
    </div>
  );
}

