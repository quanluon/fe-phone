import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLoadingStore } from '@/stores/loading';
import { Product } from '@/types';

/**
 * Hook for navigating to product detail page with loading state
 * @returns Function to navigate to product detail page
 */
export function useProductNavigation() {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const { showLoading, hideLoading } = useLoadingStore();

  /**
   * Navigate to product detail page
   * @param product - Product object containing _id and slug
   */
  const navigateToProduct = (product: Product | { _id: string; slug: string }) => {
    showLoading(tCommon('loading'));
    router.push(`/products/${product._id}-${product.slug}`);
    // Hide loading after a short delay to ensure navigation has started
    setTimeout(() => hideLoading(), 300);
  };

  return { navigateToProduct };
}

