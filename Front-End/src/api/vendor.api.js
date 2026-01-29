// Vendor API service
import { fetchJSON } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const vendorAPI = {
  /**
   * Add new vendor
   */
  add: async (vendorData) => {
    return fetchJSON(API_ENDPOINTS.VENDOR.ADD, {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  },

  /**
   * Update vendor
   */
  update: async (vendorData) => {
    return fetchJSON(API_ENDPOINTS.VENDOR.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  },

  /**
   * Get vendor by name
   */
  getByName: async (vendorName) => {
    return fetchJSON(API_ENDPOINTS.VENDOR.GET_BY_NAME(vendorName));
  },

  /**
   * Get vendor by ID
   */
  getById: async (vendorId) => {
    return fetchJSON(API_ENDPOINTS.VENDOR.GET_BY_ID(vendorId));
  },

  /**
   * Get store by vendor name
   */
  getStoreByName: async (storeName) => {
    return fetchJSON(API_ENDPOINTS.VENDOR.GET_STORE_BY_NAME(storeName));
  },

  /**
   * Get store by vendor ID
   */
  getStoreById: async (storeId) => {
    return fetchJSON(API_ENDPOINTS.VENDOR.GET_STORE_BY_ID(storeId));
  },

  /**
   * Get all vendors
   */
  getAll: async () => {
    return fetchJSON(API_ENDPOINTS.VENDOR.GET_ALL);
  },

  /**
   * Delete vendor
   */
  delete: async (vendorId) => {
    return fetchJSON(API_ENDPOINTS.VENDOR.DELETE(vendorId), {
      method: 'DELETE',
    });
  },
};
