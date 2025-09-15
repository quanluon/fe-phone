'use client';

import { LANGUAGE_OPTIONS } from '@/lib/constants';
import { useUIStore } from '@/stores/ui';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useUIStore();
  const router = useRouter();
  const t = useTranslations('header');

  const handleLanguageChange = useCallback((newLocale: string) => {
    const newLanguage = newLocale as 'vi' | 'en';
    
    // Update the UI store
    setLanguage(newLanguage);
    
    // Update URL with locale parameter to trigger middleware
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('locale', newLanguage);
    
    // Navigate to the new URL
    router.push(currentUrl.pathname + currentUrl.search);
    router.refresh()
  }, [setLanguage, router]);

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-transparent border-none text-white focus:outline-none cursor-pointer pr-6 text-xs sm:text-sm hover:text-blue-200 transition-colors"
        aria-label={t('languageSelector')}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-blue-700 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
