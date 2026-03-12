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
  uploadDepositProof: async (orderId, formData) => {
  try {
    console.log('📤 Uploading deposit proof for order:', orderId);
    
    // ✅ 1. جرب من غير fetchWithAuth - استخدم fetch مباشرة
    const url = `https://api.storely-eg.com/order/${orderId}/deposit`;
    console.log('📤 URL:', url);
    
    // ✅ 2. تأكد من اسم الحقل في FormData
    console.log('📤 FormData contents:');
    for (let pair of formData.entries()) {
      console.log('   ', pair[0], ':', pair[1] instanceof File ? pair[1].name : pair[1]);
    }
    
    // ✅ 3. استخدم fetch بدون أي headers إضافية
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // لا headers - خلي fetch يضبطها لوحده
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message_en || 'Upload failed');
      } catch {
        throw new Error(errorText || 'Upload failed');
      }
    }

    const data = await response.json();
    console.log('✅ Upload success:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error uploading deposit proof:', error);
    throw error;
  }
}
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
