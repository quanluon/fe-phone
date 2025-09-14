import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui';

export const HeroSection: React.FC = () => {
  const t = useTranslations('home.hero');
  
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Hero Banner */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12 text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-600 mb-2 sm:mb-4">
                    {t('saleOff')}
                  </div>
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                    {t('headphoneTitle')}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8">
                    {t('headphoneDescription')}
                  </p>
                  <Link href="/products?productType=airpods">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      {t('shopNow')}
                    </Button>
                  </Link>
                </div>
                <div className="flex-1 relative h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 w-full">
                  <Image
                    src="/images/hero-headphones.png"
                    alt="True Wireless Noise Cancelling Headphones"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
                  />
                </div>
              </div>
              
              {/* Carousel Dots */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </Card>
          </div>

          {/* Side Promotions */}
          <div className="space-y-4 sm:space-y-6">
            {/* iPhone Promotion */}
            <Card className="relative overflow-hidden">
              <div className="flex items-center p-4 sm:p-6">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {t('iphoneTitle')}
                  </h3>
                  <p className="text-xs sm:text-sm text-red-600 font-medium mb-2">
                    {t('limitedOffer')}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">₫32.000.000</span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through">₫40.000.000</span>
                  </div>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
                  <Image
                    src="/images/iphone-16-pro.png"
                    alt="iPhone 16 Pro"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 64px, 80px"
                  />
                </div>
              </div>
            </Card>

            {/* MacBook Promotion */}
            <Card className="relative overflow-hidden">
              <div className="flex items-center p-4 sm:p-6">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {t('macbookTitle')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    {t('macbookDescription')}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 font-medium mb-2">
                    {t('saveUp')} ₫3.750.000
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('code')} AC150
                  </p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
                  <Image
                    src="/images/macbook-pro-m4.png"
                    alt="MacBook Pro M4"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 64px, 80px"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
