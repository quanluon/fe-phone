'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { 
  HomeIcon, 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function NotFound() {
  const t = useTranslations('notFound');
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <Card className="p-8 sm:p-12 text-center shadow-2xl">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            </div>
            
            {/* 404 Number */}
            <div className="text-8xl sm:text-9xl font-bold text-gray-300 mb-4">
              {t('subtitle')}
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
              {t('description')}
            </p>
          </div>

          {/* Suggestions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('suggestions')}
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
                <span>{t('checkUrl')}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <ArrowLeftIcon className="h-5 w-5 text-blue-500" />
                <span>{t('goBack')}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <HomeIcon className="h-5 w-5 text-blue-500" />
                <span>{t('visitHome')}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <ClockIcon className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">{t('comingSoon')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-3"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                {t('buttonHome')}
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto px-8 py-3"
              onClick={handleGoBack}
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('buttonBack')}
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t('description')} If you believe this is an error, please contact our support team.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
