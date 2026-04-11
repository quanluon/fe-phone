import { MetadataRoute } from 'next';
import { getIndexableProductsForSitemap, getProductPath } from '@/lib/api/server-catalog';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const products = await getIndexableProductsForSitemap();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}${getProductPath(product)}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily',
    priority: product.isNew ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
