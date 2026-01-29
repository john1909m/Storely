// Cart store using Zustand
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
      // State
      items: [], // Array of { productId, product, quantity, price, storeId, storeName }
      currentStoreId: null, // Current store for cart
      totalPrice: 0,
      isLoading: false,
      error: null,

      // Actions
      /**
       * Set current store for cart
       */
      setCurrentStore: (storeId, storeName) => {
        set({ currentStoreId: storeId });
        // Clear cart if switching stores
        const { items } = get();
        const itemsFromOtherStore = items.filter(item => item.storeId !== storeId);
        if (itemsFromOtherStore.length < items.length) {
          // Items from different store exist, clear them
          set({
            items: items.filter(item => item.storeId === storeId),
            currentStoreId: storeId,
            totalPrice: get().calculateTotal(items.filter(item => item.storeId === storeId)),
          });
        }
      },

      /**
       * Add item to cart
       */
      addItem: (item) => {
        const { items, currentStoreId } = get();
        
        // If adding item from different store, clear cart first
        if (currentStoreId && item.storeId !== currentStoreId) {
          set({
            items: [],
            currentStoreId: item.storeId,
          });
        } else if (!currentStoreId) {
          set({ currentStoreId: item.storeId });
        }

        const updatedItems = get().items;
        const existingItemIndex = updatedItems.findIndex(
          (i) => i.productId === item.productId && i.storeId === item.storeId
        );

        let newItems;
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          newItems = updatedItems.map((i, index) =>
            index === existingItemIndex
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          );
        } else {
          // Add new item
          newItems = [...updatedItems, { ...item, quantity: item.quantity || 1 }];
        }

        set({
          items: newItems,
          totalPrice: get().calculateTotal(newItems),
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (productId, storeId) => {
        const { items } = get();
        const newItems = items.filter(
          (i) => !(i.productId === productId && i.storeId === storeId)
        );
        set({
          items: newItems,
          totalPrice: get().calculateTotal(newItems),
        });
      },

      /**
       * Update item quantity
       */
      updateQuantity: (productId, storeId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, storeId);
          return;
        }

        const { items } = get();
        const newItems = items.map((i) =>
          i.productId === productId && i.storeId === storeId
            ? { ...i, quantity }
            : i
        );

        set({
          items: newItems,
          totalPrice: get().calculateTotal(newItems),
        });
      },

      /**
       * Clear cart
       */
      clearCart: () => {
        set({
          items: [],
          totalPrice: 0,
          currentStoreId: null,
        });
      },

      /**
       * Clear cart for specific store
       */
      clearCartForStore: (storeId) => {
        const { items } = get();
        const remainingItems = items.filter(item => item.storeId !== storeId);
        set({
          items: remainingItems,
          totalPrice: get().calculateTotal(remainingItems),
        });
      },

      /**
       * Calculate total price
       */
      calculateTotal: (items = null) => {
        const itemsToCalculate = items || get().items;
        return itemsToCalculate.reduce(
          (total, item) => total + (item.price || 0) * (item.quantity || 1),
          0
        );
      },

      /**
       * Get cart item count
       */
      getItemCount: () => {
        return get().items.reduce((count, item) => count + (item.quantity || 1), 0);
      },

      /**
       * Get items for specific store
       */
      getItemsByStore: (storeId) => {
        return get().items.filter((item) => item.storeId === storeId);
      },

      /**
       * Check if cart is empty
       */
      isEmpty: () => {
        return get().items.length === 0;
      },

      /**
       * Sync cart with checkout API response
       */
      syncWithCheckout: (checkoutData) => {
        // After successful checkout, you might want to clear cart or update it
        // This can be customized based on your checkout flow
        if (checkoutData.clearCart !== false) {
          get().clearCart();
        }
      },
    })
);

export default useCartStore;
