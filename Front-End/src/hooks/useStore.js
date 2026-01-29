// Custom hook for store management
import useStoreStore from '../store/storeStore';

/**
 * Custom hook for store operations
 */
export const useStore = () => {
  const storeStore = useStoreStore();

  return {
    // State
    currentStore: storeStore.currentStore,
    storeProducts: storeStore.storeProducts,
    categories: storeStore.categories,
    isLoading: storeStore.isLoading,
    error: storeStore.error,

    // Actions
    setCurrentStore: storeStore.setCurrentStore,
    fetchStore: storeStore.fetchStore,
    fetchStoreByName: storeStore.fetchStoreByName,
    fetchProducts: storeStore.fetchProducts,
    fetchCategories: storeStore.fetchCategories,
    searchProducts: storeStore.searchProducts,
    getProductsByCategory: storeStore.getProductsByCategory,
    clearStore: storeStore.clearStore,
    clearError: storeStore.clearError,
  };
};

export default useStore;
