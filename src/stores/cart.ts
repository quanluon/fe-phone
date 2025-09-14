import { CartItem, CartValidationResult, Product, ProductVariant } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from './toast';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartActions {
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => CartValidationResult;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => CartValidationResult;
  clearCart: () => void;
  getItemQuantity: (productId: string, variantId: string) => number;
  isInCart: (productId: string, variantId: string) => boolean;
  validateCartItem: (product: Product, variant: ProductVariant, quantity: number) => CartValidationResult;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Actions
      addItem: (product: Product, variant: ProductVariant, quantity: number = 1) => {
        const state = get();
        const existingItem = state.items.find(
          (item) => item.productId === product._id && item.variantId === variant._id
        );

        const currentCartQuantity = existingItem?.quantity || 0;
        const newTotalQuantity = currentCartQuantity + quantity;

        // Validate the new total quantity
        const validation = get().validateCartItem(product, variant, newTotalQuantity);
        
        if (!validation.isValid) {
          return validation;
        }

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product._id && item.variantId === variant._id
          );

          let newItems: CartItem[];

          if (existingItemIndex > -1) {
            // Update existing item quantity
            newItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              productId: product._id,
              variantId: variant._id,
              quantity,
              product,
              variant,
            };
            newItems = [...state.items, newItem];
          }

          // Calculate totals
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce(
            (sum, item) => sum + item.variant.price * item.quantity,
            0
          );

          // Success toast will be handled by the hook

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });

        return validation;
      },

      removeItem: (productId: string, variantId: string) => {
        set((state) => {
          const itemToRemove = state.items.find(
            (item) => item.productId === productId && item.variantId === variantId
          );

          const newItems = state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          );

          // Calculate totals
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce(
            (sum, item) => sum + item.variant.price * item.quantity,
            0
          );

          // Show info toast
          if (itemToRemove) {
            useToastStore.getState().addToast({
              type: 'info',
              title: 'Removed from cart',
              message: `${itemToRemove.product.name} (${itemToRemove.variant.color}) has been removed from your cart.`,
            });
          }

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateQuantity: (productId: string, variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return { isValid: true, maxAllowedQuantity: 0 };
        }

        const state = get();
        const existingItem = state.items.find(
          (item) => item.productId === productId && item.variantId === variantId
        );

        if (!existingItem) {
          return { isValid: false, maxAllowedQuantity: 0 };
        }

        // Validate the new quantity
        const validation = get().validateCartItem(existingItem.product, existingItem.variant, quantity);
        
        if (!validation.isValid) {
          return validation;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          );

          // Calculate totals
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce(
            (sum, item) => sum + item.variant.price * item.quantity,
            0
          );

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });

        return validation;
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItemQuantity: (productId: string, variantId: string) => {
        const item = get().items.find(
          (item) => item.productId === productId && item.variantId === variantId
        );
        return item?.quantity || 0;
      },

      isInCart: (productId: string, variantId: string) => {
        return get().items.some(
          (item) => item.productId === productId && item.variantId === variantId
        );
      },

      validateCartItem: (product: Product, variant: ProductVariant, quantity: number): CartValidationResult => {
        // Check if quantity is valid
        if (quantity <= 0) {
          return {
            isValid: false,
            error: {
              type: 'invalid_quantity',
              message: 'Quantity must be greater than 0',
              currentStock: variant.stock,
              requestedQuantity: quantity,
            },
            maxAllowedQuantity: 0,
          };
        }

        // Check if variant is out of stock
        if (variant.stock === 0) {
          return {
            isValid: false,
            error: {
              type: 'out_of_stock',
              message: `${product.name} (${variant.color}) is currently out of stock`,
              currentStock: variant.stock,
              requestedQuantity: quantity,
            },
            maxAllowedQuantity: 0,
          };
        }

        // Check if requested quantity exceeds available stock
        if (quantity > variant.stock) {
          return {
            isValid: false,
            error: {
              type: 'insufficient_stock',
              message: `Only ${variant.stock} items available in stock. You requested ${quantity} items.`,
              currentStock: variant.stock,
              requestedQuantity: quantity,
            },
            maxAllowedQuantity: variant.stock,
          };
        }

        return {
          isValid: true,
          maxAllowedQuantity: variant.stock,
        };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

