import { useTranslations } from 'next-intl';
import { useCartStore } from '@/stores/cart';
import { useToastStore } from '@/stores/toast';
import { Product, ProductVariant, CartValidationResult } from '@/types';
import { formatMessage } from '@/lib/translations';

export function useCartWithTranslations() {
  const t = useTranslations();
  const { addItem: originalAddItem, updateQuantity: originalUpdateQuantity } = useCartStore();
  const { addToast } = useToastStore();

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1): CartValidationResult => {
    const result = originalAddItem(product, variant, quantity);
    
    if (!result.isValid && result.error) {
      const { type, currentStock, requestedQuantity } = result.error;
      
      let message: string;
      let title: string;

      switch (type) {
        case 'insufficient_stock':
          title = t('cart.validation.cannotAddToCart');
          message = formatMessage(t('cart.validation.insufficientStock'), {
            stock: currentStock,
            quantity: requestedQuantity
          });
          break;
        case 'out_of_stock':
          title = t('cart.validation.cannotAddToCart');
          message = formatMessage(t('cart.validation.outOfStock'), {
            productName: product.name,
            color: variant.color
          });
          break;
        case 'invalid_quantity':
          title = t('cart.validation.cannotAddToCart');
          message = t('cart.validation.quantityMustBeGreaterThanZero');
          break;
        default:
          title = t('cart.validation.cannotAddToCart');
          message = t('cart.validation.invalidQuantity');
      }

      addToast({
        type: 'error',
        title,
        message,
      });
    } else {
      // Success toast
      addToast({
        type: 'success',
        title: t('cart.validation.addedToCart'),
        message: formatMessage(t('cart.validation.addedToCart'), {
          productName: product.name,
          color: variant.color
        }),
      });
    }

    return result;
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number): CartValidationResult => {
    const result = originalUpdateQuantity(productId, variantId, quantity);
    
    if (!result.isValid && result.error) {
      const { type, currentStock, requestedQuantity } = result.error;
      
      let message: string;
      let title: string;

      switch (type) {
        case 'insufficient_stock':
          title = t('cart.validation.cannotUpdateQuantity');
          message = formatMessage(t('cart.validation.insufficientStock'), {
            stock: currentStock,
            quantity: requestedQuantity
          });
          break;
        case 'out_of_stock':
          title = t('cart.validation.cannotUpdateQuantity');
          message = t('cart.validation.outOfStock');
          break;
        case 'invalid_quantity':
          title = t('cart.validation.cannotUpdateQuantity');
          message = t('cart.validation.quantityMustBeGreaterThanZero');
          break;
        default:
          title = t('cart.validation.cannotUpdateQuantity');
          message = t('cart.validation.invalidQuantity');
      }

      addToast({
        type: 'error',
        title,
        message,
      });
    }

    return result;
  };

  const cartStore = useCartStore();
  
  return {
    addItem,
    updateQuantity,
    // Include all other methods from the cart store
    removeItem: cartStore.removeItem,
    clearCart: cartStore.clearCart,
    getItemQuantity: cartStore.getItemQuantity,
    isInCart: cartStore.isInCart,
    validateCartItem: cartStore.validateCartItem,
    // Include state
    items: cartStore.items,
    totalItems: cartStore.totalItems,
    totalPrice: cartStore.totalPrice,
  };
}
