// Store API service
import { fetchJSON } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const storeAPI = {
  /**
   * Add new store
   */
  add: async (storeData) => {
    return fetchJSON(API_ENDPOINTS.STORE.ADD, {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  },

  /**
   * Update store
   */
  update: async (storeData) => {
    return fetchJSON(API_ENDPOINTS.STORE.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  },

  /**
   * Get store by ID
   */
  getById: async (storeId, requireAuth = true) => {
    return fetchJSON(API_ENDPOINTS.STORE.GET_BY_ID(storeId), {}, requireAuth);
  },

  /**
   * Get stores by vendor ID
   */
  getByVendorId: async (vendorId) => {
    return fetchJSON(API_ENDPOINTS.STORE.GET_BY_VENDOR_ID(vendorId));
  },

  /**
   * Get stores by vendor name
   */
  getByVendorName: async (vendorName) => {
    return fetchJSON(API_ENDPOINTS.STORE.GET_BY_VENDOR_NAME(vendorName));
  },

  /**
   * Get store by name
   */
  getByName: async (storeName, requireAuth = true) => {
    return fetchJSON(API_ENDPOINTS.STORE.GET_BY_NAME(storeName), {}, requireAuth);
  },

  /**
   * Get all stores
   */
  getAll: async () => {
    return fetchJSON(API_ENDPOINTS.STORE.GET_ALL);
  },

  /**
   * Delete store
   */
  delete: async (storeId) => {
    return fetchJSON(API_ENDPOINTS.STORE.DELETE(storeId), {
      method: 'DELETE',
    });
  },
};
