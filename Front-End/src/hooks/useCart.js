// Custom hook for cart management
import useCartStore from '../store/cartStore';

/**
 * Custom hook for cart operations
 */
export const useCart = () => {
  const cartStore = useCartStore();

  return {
    // State
    items: cartStore.items,
    totalPrice: cartStore.totalPrice,
    isLoading: cartStore.isLoading,
    error: cartStore.error,

    // Actions
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    syncWithCheckout: cartStore.syncWithCheckout,

    // Computed
    getItemCount: cartStore.getItemCount,
    isEmpty: cartStore.isEmpty,
    getItemsByStore: cartStore.getItemsByStore,
  };
};

export default useCart;
