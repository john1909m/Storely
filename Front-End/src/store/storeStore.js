// Store state management using Zustand
import { create } from 'zustand';
import { storeAPI } from '../api/store.api';
import { productAPI } from '../api/product.api';
import { categoryAPI } from '../api/category.api';

const useStoreStore = create((set, get) => ({
  // State
  currentStore: null,
  storeProducts: [],
  categories: [],
  isLoading: false,
  error: null,

  // Actions
  /**
   * Set current store
   */
  setCurrentStore: (store) => {
    set({ currentStore: store });
  },

  /**
   * Fetch store by ID
   */
  fetchStore: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      const store = await storeAPI.getById(storeId);
      set({ currentStore: store, isLoading: false });
      return store;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Fetch store by name
   */
  fetchStoreByName: async (storeName) => {
    set({ isLoading: true, error: null });
    try {
      const store = await storeAPI.getByName(storeName);
      set({ currentStore: store, isLoading: false });
      return store;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Fetch products for current store
   */
  fetchProducts: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      const products = await storeId
        ? await productAPI.getAll(storeId)
        : await productAPI.getAll(get().currentStore?.id);
      
      set({ storeProducts: products, isLoading: false });
      return products;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Fetch categories for current store
   */
  fetchCategories: async (storeId) => {
    set({ isLoading: true, error: null });
    try {
      const categories = await storeId
        ? await categoryAPI.getByStore(storeId)
        : await categoryAPI.getByStore(get().currentStore?.id);
      
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Search products
   */
  searchProducts: async (productName, storeId) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productAPI.search(
        productName,
        storeId || get().currentStore?.id
      );
      set({ storeProducts: products, isLoading: false });
      return products;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryId, storeId) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productAPI.getByCategory(
        categoryId,
        storeId || get().currentStore?.id
      );
      set({ storeProducts: products, isLoading: false });
      return products;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Clear store data
   */
  clearStore: () => {
    set({
      currentStore: null,
      storeProducts: [],
      categories: [],
      error: null,
    });
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },
}));

export default useStoreStore;
