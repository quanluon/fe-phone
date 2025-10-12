import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/profile/', '/cart/', '/wishlist/', '/orders/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

