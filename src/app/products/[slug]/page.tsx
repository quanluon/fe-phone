import React from 'react';
import { ProductDetailClient } from './ProductDetailClient';

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, we'll generate a few common product slugs
  // In a real app, you might want to fetch this from your API
  const commonSlugs = [
    'iphone-15-pro-max',
    'iphone-15-pro',
    'iphone-15',
    'ipad-pro-12-9',
    'macbook-pro-16',
    'airpods-pro-2',
    'apple-watch-series-9'
  ];
  
  return commonSlugs.map((slug) => ({
    slug: slug,
  }));
}


export default function ProductDetailPage() {
  return <ProductDetailClient />;
}


