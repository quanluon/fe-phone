import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
    const productsResponse = await fetch(`${API_URL}/api/products?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    const productRoutes: MetadataRoute.Sitemap = [];
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      const products = productsData.data?.products || [];

      products.forEach((product: Product) => {
        productRoutes.push({
          url: `${BASE_URL}/products/${product._id}-${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    // Fetch categories for dynamic routes
    const categoriesResponse = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });

    const categoryRoutes: MetadataRoute.Sitemap = [];
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      const categories = categoriesData.data || [];

      categories.forEach((category: Category) => {
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

