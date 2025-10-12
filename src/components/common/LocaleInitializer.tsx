'use client';

import { useUIStore } from '@/stores/ui';
import { useEffect } from 'react';

export function LocaleInitializer({ locale }: { locale: 'vi' | 'en' }) {
  const { setLanguage } = useUIStore();

  useEffect(() => {
    // Sync the UI store with the actual locale
    setLanguage(locale);
  }, [locale, setLanguage]);

  return null;
}

