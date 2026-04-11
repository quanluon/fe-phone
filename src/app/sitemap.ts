import { MetadataRoute } from 'next';
import { getBrands, getCategories, getIndexableProductsForSitemap, getProductPath } from '@/lib/api/server-catalog';
import { COLLECTION_LANDING_PAGES } from '@/lib/catalog-seo';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [products, categories, brands] = await Promise.all([
    getIndexableProductsForSitemap(),
    getCategories(),
    getBrands(),
  ]);
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

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(category.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(brand.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTION_LANDING_PAGES.map((collection) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}${getProductPath(product)}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily',
    priority: product.isNew ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...collectionRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
