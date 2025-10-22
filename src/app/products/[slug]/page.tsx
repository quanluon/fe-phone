import React from 'react';
import { Metadata } from 'next';
import { ProductDetail } from '../../../components/product';
import { CONTACT_INFO } from '@/lib/constants';
import { Product } from '@/types';
import { logger } from '@/lib/utils/logger';
import { safeServerFetch, buildApiUrl } from '@/lib/utils/server-fetch';

// Helper function to strip HTML tags from description
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

async function getProduct(identifier: string): Promise<Product | null> {
  try {
    // Extract _id from the identifier (format: _id-slug)
    const productId = identifier.split('-')[0];
    
    if (!productId) {
      logger.warn({ identifier }, 'Invalid product identifier');
      return null;
    }
    
    const apiUrl = buildApiUrl(`/api/products/${productId}`);
    const { data, error } = await safeServerFetch<{ data: Product }>(apiUrl, {
      timeout: 5000,
      retries: 1,
    });
    
    if (error) {
      logger.error({ error, productId }, 'Error fetching product');
      return null;
    }
    
    if (!data || !data.data) {
      logger.warn({ productId, data }, 'Invalid API response structure');
      return null;
    }
    
    return data.data;
  } catch (error) {
    logger.error({ error, identifier }, 'Unexpected error in getProduct');
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
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
      keywords: `${product.name}, ${product.brand.name}, ${product.category.name}, Apple products, buy online, iPhone, iPad, MacBook, mua online, điện thoại Apple`,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
            type: 'image/jpeg',
          },
          ...product.images.slice(1, 4).map((img: string, index: number) => ({
            url: img,
            width: 1200,
            height: 630,
            alt: `${product.name} - Hình ${index + 2}`,
            type: 'image/jpeg',
          })),
        ],
        type: 'website',
        siteName: CONTACT_INFO.name,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/products/${slug}`,
        locale: 'vi_VN',
        countryName: 'Vietnam',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: {
          url: imageUrl,
          alt: product.name,
        },
        creator: '@ncmobile',
        site: '@ncmobile',
      },
      // Additional meta tags for Vietnamese social platforms
      other: {
        // Enhanced Open Graph tags
        'og:title': title,
        'og:description': description,
        'og:image': imageUrl,
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:type': 'image/jpeg',
        'og:image:alt': product.name,
        'og:url': `${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/products/${slug}`,
        'og:type': 'website',
        'og:site_name': CONTACT_INFO.name,
        'og:locale': 'vi_VN',
        'og:country-name': 'Vietnam',
        
        // Product-specific Open Graph
        'product:brand': product.brand.name,
        'product:category': product.category.name,
        'product:price:amount': product.basePrice.toString(),
        'product:price:currency': 'VND',
        'product:availability': 'in stock',
        'product:condition': 'new',
        'product:retailer': CONTACT_INFO.name,
        
        // Zalo sharing
        'zalo:title': title,
        'zalo:description': description,
        'zalo:image': imageUrl,
        
        // Facebook Messenger
        'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        
        // WhatsApp sharing
        'whatsapp:title': title,
        'whatsapp:description': description,
        'whatsapp:image': imageUrl,
        
        // Viber sharing
        'viber:title': title,
        'viber:description': description,
        'viber:image': imageUrl,
        
        // Telegram sharing
        'telegram:title': title,
        'telegram:description': description,
        'telegram:image': imageUrl,
        
        // Vietnamese SEO
        'geo.region': 'VN',
        'geo.placename': 'Vietnam',
        'geo.position': '16.0583;108.2772',
        'ICBM': '16.0583, 108.2772',
        
        // Article tags
        'article:author': CONTACT_INFO.name,
        'article:section': 'Technology',
        'article:tag': `${product.brand.name}, ${product.category.name}`,
        'article:published_time': new Date().toISOString(),
        'article:modified_time': new Date().toISOString(),
        
        // Mobile app tags
        'al:ios:app_name': 'NC Mobile',
        'al:ios:app_store_id': 'ncmobile://product/' + slug,
        'al:android:app_name': 'NC Mobile',
        'al:android:package': 'com.ncmobile.app',
        'al:android:url': 'ncmobile://product/' + slug,
        
        // Additional meta tags
        'theme-color': '#1f2937',
        'msapplication-TileColor': '#1f2937',
        'msapplication-TileImage': imageUrl,
      },
      alternates: {
        canonical: `/products/${slug}`,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Error generating metadata');
    // Fallback metadata
    return {
      title: 'Product | ' + CONTACT_INFO.name,
      description: 'Browse our collection of premium products.',
    };
  }
}

// Note: generateStaticParams is removed because we're using dynamic rendering
// This prevents DYNAMIC_SERVER_USAGE errors

// Force dynamic rendering to avoid DYNAMIC_SERVER_USAGE error
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Disable static generation completely for this route
export const revalidate = false;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
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
        <ProductDetail initialProduct={product} />
      </>
    );
  } catch (error) {
    logger.error({ error }, 'Error in ProductDetailPage');
    // Return fallback component
    return <ProductDetail initialProduct={null} />;
  }
}


