'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { LANGUAGE_OPTIONS } from '@/lib/constants';

export const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };


  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-transparent border-none text-white focus:outline-none cursor-pointer pr-6"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-blue-700 text-white">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-0 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white pointer-events-none" />
    </div>
  );
};
