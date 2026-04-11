import { Product } from '@/types';
import { useRouter } from 'next/navigation';

/**
 * Hook for navigating to product detail page with loading state
 * @returns Function to navigate to product detail page
 */
export function useProductNavigation() {
  const router = useRouter();

  const getProductPath = (product: Product | { _id: string; slug: string }) =>
    `/products/${product._id}-${product.slug}`;

  const prefetchProduct = (product: Product | { _id: string; slug: string }) => {
    router.prefetch(getProductPath(product));
  };

  /**
   * Navigate to product detail page
   * @param product - Product object containing _id and slug
   */
  const navigateToProduct = (product: Product | { _id: string; slug: string }) => {
    router.push(getProductPath(product));
  };

  return { navigateToProduct, prefetchProduct };
}
