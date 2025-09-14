'use client';

import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useUIStore } from '@/stores/ui';
import { CURRENCY_OPTIONS } from '@/lib/constants';

export const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useUIStore();

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency as 'VND' | 'USD');
  };


  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) => handleCurrencyChange(e.target.value)}
        className="appearance-none bg-transparent border-none text-white focus:outline-none cursor-pointer pr-6"
      >
        {CURRENCY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-blue-700 text-white">
            {option.value}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-0 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white pointer-events-none" />
    </div>
  );
};
