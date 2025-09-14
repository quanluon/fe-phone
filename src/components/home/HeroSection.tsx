import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { HeroData } from "@/types";
import heroData from "@/data/heroData.json";
import { formatCurrency } from "@/lib/utils";
import { useUIStore } from "@/stores/ui";

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { currency } = useUIStore();
  const t = useTranslations('hero');

  const data = heroData as HeroData;
  const { heroSlides, sidePromotions } = data;

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Hero Banner */}
          <div className="lg:col-span-2">
            <Card
              className={`relative overflow-hidden bg-gradient-to-r ${currentSlideData.backgroundColor} border-0 shadow-2xl h-full`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                aria-label={t('previousSlide')}
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                aria-label={t('nextSlide')}
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>

              <div className="flex flex-col lg:flex-row items-center min-h-[400px] lg:min-h-[500px]">
                <div className="flex-1 p-6 sm:p-8 lg:p-10 xl:p-12 text-center lg:text-left">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div
                      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold ${currentSlideData.textColor}`}
                    >
                      {currentSlideData.discount}
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                      {currentSlideData.discountText}
                    </div>
                  </div>
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                    {currentSlideData.title}
                  </h1>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden sm:block text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8">
                    {currentSlideData.description}
                  </p>
                  {/* Hide button on mobile (will show below image) */}
                  <div className="hidden sm:block">
                    <Link href={currentSlideData.buttonLink}>
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        {currentSlideData.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex-1 relative h-80 sm:h-72 md:h-80 lg:h-80 xl:h-96 w-full p-4">
                  <Image
                    src={currentSlideData.image}
                    alt={currentSlideData.imageAlt}
                    fill
                    className="object-contain drop-shadow-lg"
                    priority={currentSlide === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
                  />
                </div>
                {/* Show button below image on mobile */}
                <div className="sm:hidden w-full px-6 pb-6 mt-4">
                  <Link href={currentSlideData.buttonLink}>
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 w-full px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      {currentSlideData.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-600 shadow-lg"
                        : "bg-white/60 hover:bg-white/80 border border-gray-300"
                    }`}
                    aria-label={t('goToSlide', { index: index + 1 })}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Side Promotions */}
          <div className="flex flex-col gap-6 sm:gap-8 h-full">
            {sidePromotions.map((promotion) => (
              <Link key={promotion.id} href={promotion.link} className="flex-1">
                <Card 
                  className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-xl bg-white rounded-xl h-full"
                  style={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div className="flex items-center p-4 sm:p-8 h-full">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {promotion.title}
                      </h3>
                      <p className="text-sm sm:text-base text-red-600 font-semibold mb-3">
                        {promotion.subtitle}
                      </p>

                      {promotion.currentPrice && promotion.originalPrice && (
                        <div className="flex-row items-center space-x-3 mb-2">
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">
                            {formatCurrency(promotion.currentPrice, currency)}
                          </div>
                          <div className="text-sm sm:text-base text-gray-500 line-through">
                            {formatCurrency(promotion.originalPrice, currency)}
                          </div>
                        </div>
                      )}

                      {promotion.savings && (
                        <p className="text-sm sm:text-base text-green-600 font-semibold mb-2">
                          {promotion.savings}
                        </p>
                      )}

                      {promotion.promoCode && (
                        <p className="text-sm text-gray-500 font-medium">
                          {promotion.promoCode}
                        </p>
                      )}
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 bg-gray-50 rounded-lg p-2">
                      <Image
                        src={promotion.image}
                        alt={promotion.imageAlt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
