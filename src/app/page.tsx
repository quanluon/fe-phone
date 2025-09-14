'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { BestSellingSection } from '@/components/home/BestSellingSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <NewArrivalsSection />
      <BestSellingSection />
    </main>
  );
}
