import React from 'react';
import { Metadata } from 'next';
import { ProductDetailClient } from './ProductDetailClient';
import { CONTACT_INFO } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  images: string[];
  category: { name: string };
  brand: { name: string };
  slug: string;
}

async function getProduct(identifier: string): Promise<Product | null> {
  try {
    // Extract _id from the identifier (format: _id-slug)
    const productId = identifier.split('-')[0];
    
    const response = await fetch(`${API_URL}/products/${productId}`, {
      next: { revalidate: 3600 }, // Revalidate every hour (ISR)
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found | ' + CONTACT_INFO.name,
      description: 'The product you are looking for could not be found.',
    };
  }

  const title = `${product.name} | ${CONTACT_INFO.name}`;
  const description = product.shortDescription || product.description.substring(0, 160);
  const imageUrl = product.images[0] || '/placeholder.png';

  return {
    title,
    description,
    keywords: `${product.name}, ${product.brand.name}, ${product.category.name}, Apple products, buy online`,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: CONTACT_INFO.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

// Generate static params for ISR (Incremental Static Regeneration)
export async function generateStaticParams() {
  try {
    // Fetch products from API
    const response = await fetch(`${API_URL}/products?limit=50`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      // Fallback to common slugs if API fails
      return [
        { slug: 'iphone-15-pro-max' },
        { slug: 'iphone-15-pro' },
        { slug: 'macbook-pro-16' },
      ];
    }
    
    const data = await response.json();
    const products = data.data?.products || [];
    
    return products.map((product: Product) => ({
      slug: `${product._id}-${product.slug}`,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback to common slugs
    return [
      { slug: 'iphone-15-pro-max' },
      { slug: 'iphone-15-pro' },
      { slug: 'macbook-pro-16' },
    ];
  }
}

// Enable ISR for better performance
export const revalidate = 3600; // Revalidate every hour

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}


