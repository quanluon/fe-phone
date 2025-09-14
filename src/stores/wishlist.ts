import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
}

interface WishlistActions {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Actions
      addItem: (product: Product) => {
        set((state) => {
          const isAlreadyInWishlist = state.items.some((item) => item._id === product._id);
          
          if (isAlreadyInWishlist) {
            return state;
          }

          return {
            items: [...state.items, product],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item._id === productId);
      },

      toggleItem: (product: Product) => {
        const isInWishlist = get().isInWishlist(product._id);
        
        if (isInWishlist) {
          get().removeItem(product._id);
        } else {
          get().addItem(product);
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

