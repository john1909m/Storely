// Order API service
import { fetchJSON } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const orderAPI = {
  /**
   * Checkout - Create order from cart
   */
  checkout: async (checkoutData) => {
    return fetchJSON(API_ENDPOINTS.ORDER.CHECKOUT, {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
  },

  /**
   * Add new order
   */
  add: async (orderData) => {
    return fetchJSON(API_ENDPOINTS.ORDER.ADD, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Update order
   */
  update: async (orderData) => {
    return fetchJSON(API_ENDPOINTS.ORDER.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Get order by ID and store ID
   */
  getById: async (orderId, storeId) => {
    return fetchJSON(API_ENDPOINTS.ORDER.GET_BY_ID(orderId, storeId));
  },

  /**
   * Get all orders for a store
   */
  getByStore: async (storeId) => {
    return fetchJSON(API_ENDPOINTS.ORDER.GET_BY_STORE(storeId));
  },

  /**
   * Delete order
   */
  delete: async (orderId) => {
    return fetchJSON(API_ENDPOINTS.ORDER.DELETE(orderId), {
      method: 'DELETE',
    });
  },
};

// Order Item API
export const orderItemAPI = {
  /**
   * Add order item
   */
  add: async (orderItemData) => {
    return fetchJSON(API_ENDPOINTS.ORDER_ITEM.ADD, {
      method: 'POST',
      body: JSON.stringify(orderItemData),
    });
  },

  /**
   * Update order item
   */
  update: async (orderItemData) => {
    return fetchJSON(API_ENDPOINTS.ORDER_ITEM.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(orderItemData),
    });
  },

  /**
   * Get order items by order ID
   */
  getByOrder: async (orderId) => {
    return fetchJSON(API_ENDPOINTS.ORDER_ITEM.GET_BY_ORDER(orderId));
  },

  /**
   * Delete order item
   */
  delete: async (orderItemId) => {
    return fetchJSON(API_ENDPOINTS.ORDER_ITEM.DELETE(orderItemId), {
      method: 'DELETE',
    });
  },
};
