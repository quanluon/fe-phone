import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';
import { useToastStore } from './toast';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartActions {
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, variantId: string) => number;
  isInCart: (productId: string, variantId: string) => boolean;
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

          // Show success toast
          useToastStore.getState().addToast({
            type: 'success',
            title: 'Added to cart',
            message: `${product.name} (${variant.color}) has been added to your cart.`,
          });

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
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
          return;
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
    }),
    {
      name: 'cart-storage',
    }
  )
);

