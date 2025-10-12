import React from 'react';
import { Metadata } from 'next';
import { ProductDetailClient } from './ProductDetailClient';
import { CONTACT_INFO } from '@/lib/constants';
import { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to strip HTML tags from description
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

async function getProduct(identifier: string): Promise<Product | null> {
  try {
    // Extract _id from the identifier (format: _id-slug)
    const productId = identifier.split('-')[0];
    
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      next: { revalidate: 3600 }, // Revalidate every hour (ISR)
      method: 'GET'
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
  // Strip HTML tags and limit length for meta description
  const cleanDescription = stripHtmlTags(product.shortDescription || product.description);
  const description = cleanDescription.substring(0, 160);
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
    const response = await fetch(`${API_URL}/api/products?limit=50`, {
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

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  // Generate JSON-LD structured data for SEO
  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripHtmlTags(product.shortDescription || product.description),
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.basePrice,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/products/${slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
    },
  } : null;
  
  // Pass the server-side fetched product as initial data
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient initialProduct={product} />
    </>
  );
}


