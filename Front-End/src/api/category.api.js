// Category API service
import { fetchJSON } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const categoryAPI = {
  /**
   * Add new category
   */
  add: async (categoryData) => {
    return fetchJSON(API_ENDPOINTS.CATEGORY.ADD, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * Update category
   */
  update: async (categoryData) => {
    return fetchJSON(API_ENDPOINTS.CATEGORY.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * Get category by ID
   */
  getById: async (categoryId) => {
    return fetchJSON(API_ENDPOINTS.CATEGORY.GET_BY_ID(categoryId));
  },

  /**
   * Get categories by store ID
   */
  getByStore: async (storeId) => {
    return fetchJSON(API_ENDPOINTS.CATEGORY.GET_BY_STORE(storeId));
  },

  /**
   * Get category by name and store
   */
  getByName: async (categoryName, storeId) => {
    return fetchJSON(API_ENDPOINTS.CATEGORY.GET_BY_NAME(categoryName, storeId));
  },

  /**
   * Delete category
   */
  delete: async (categoryId) => {
    return fetchJSON(API_ENDPOINTS.CATEGORY.DELETE(categoryId), {
      method: 'DELETE',
    });
  },
};
