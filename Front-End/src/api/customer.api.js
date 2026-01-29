// Customer API service
import { fetchJSON } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const customerAPI = {
  /**
   * Add new customer
   */
  add: async (customerData) => {
    return fetchJSON(API_ENDPOINTS.CUSTOMER.ADD, {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  /**
   * Update customer
   */
  update: async (customerData) => {
    return fetchJSON(API_ENDPOINTS.CUSTOMER.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  /**
   * Get customers by store ID
   */
  getByStore: async (storeId) => {
    return fetchJSON(API_ENDPOINTS.CUSTOMER.GET_BY_STORE(storeId));
  },

  /**
   * Get customer by order ID
   */
  getByOrder: async (orderId) => {
    return fetchJSON(API_ENDPOINTS.CUSTOMER.GET_BY_ORDER(orderId));
  },

  /**
   * Get customers by city and store
   */
  getByCity: async (city, storeId) => {
    return fetchJSON(API_ENDPOINTS.CUSTOMER.GET_BY_CITY(city, storeId));
  },

  /**
   * Delete customer
   */
  delete: async (customerId) => {
    return fetchJSON(API_ENDPOINTS.CUSTOMER.DELETE(customerId), {
      method: 'DELETE',
    });
  },
};
