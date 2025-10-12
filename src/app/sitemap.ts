import { MetadataRoute } from 'next';
import { safeServerFetch, buildApiUrl } from '@/lib/utils/server-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com';

interface Product {
  _id: string;
  slug: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  slug: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  try {
    // Fetch products for dynamic routes
    const { data: productsData, error: productsError } = await safeServerFetch<{ data: { products: Product[] } }>(
      buildApiUrl('/api/products?limit=1000'),
      {
        timeout: 8000,
        retries: 1,
        next: { revalidate: 3600 },
      }
    );

    const productRoutes: MetadataRoute.Sitemap = [];
    if (!productsError && productsData?.data?.products) {
      productsData.data.products.forEach((product: Product) => {
        productRoutes.push({
          url: `${BASE_URL}/products/${product._id}-${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    // Fetch categories for dynamic routes
    const { data: categoriesData, error: categoriesError } = await safeServerFetch<{ data: Category[] }>(
      buildApiUrl('/api/categories'),
      {
        timeout: 8000,
        retries: 1,
        next: { revalidate: 3600 },
      }
    );

    const categoryRoutes: MetadataRoute.Sitemap = [];
    if (!categoriesError && categoriesData?.data) {
      categoriesData.data.forEach((category: Category) => {
        categoryRoutes.push({
          url: `${BASE_URL}/products?category=${category._id}`,
          lastModified: new Date(category.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static routes if API fails
    return staticRoutes;
  }
}

