// Product API service
import { fetchJSON, fetchWithAuth } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const productAPI = {
  /**
   * Add new product
   */
  add: async (productData) => {
    // For file uploads, use FormData
    const formData = new FormData();
    
    if (productData instanceof FormData) {
      return fetchWithAuth(API_ENDPOINTS.PRODUCT.ADD, {
        method: 'POST',
        body: productData,
        headers: {}, // Let browser set Content-Type for FormData
      });
    }

    return fetchJSON(API_ENDPOINTS.PRODUCT.ADD, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  uploadProductImage: async (productId, formData) => {
  // CRITICAL: Do NOT set Content-Type header for FormData
  // Let the browser set it automatically with the boundary
  
  return fetchWithAuth(API_ENDPOINTS.PRODUCT.UPLOAD_PRODUCT_IMAGE(productId), {
    method: 'POST',
    body: formData,
    // NO headers object at all - this is key!
  });
},

  /**
   * Update product
   */
  update: async (productData) => {
    if (productData instanceof FormData) {
      return fetchWithAuth(API_ENDPOINTS.PRODUCT.UPDATE, {
        method: 'PUT',
        body: productData,
        headers: {},
      });
    }

    return fetchJSON(API_ENDPOINTS.PRODUCT.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  /**
   * Get product by ID and store ID
   */
  getById: async (productId, storeId) => {
    return fetchJSON(API_ENDPOINTS.PRODUCT.GET_BY_ID(productId, storeId));
  },

  /**
   * Search products by name
   */
  search: async (productName, storeId) => {
    return fetchJSON(API_ENDPOINTS.PRODUCT.SEARCH(productName, storeId));
  },

  /**
   * Get products by category
   */
  getByCategory: async (categoryId, storeId) => {
    return fetchJSON(API_ENDPOINTS.PRODUCT.GET_BY_CATEGORY(categoryId, storeId));
  },

  /**
   * Get all products for a store
   */
  getAll: async (storeId) => {
    return fetchJSON(API_ENDPOINTS.PRODUCT.GET_ALL(storeId));
  },

  /**
   * Delete product
   */
  delete: async (productId) => {
    return fetchJSON(API_ENDPOINTS.PRODUCT.DELETE(productId), {
      method: 'DELETE',
    });
  },
};

// Product Images API
export const productImagesAPI = {
  /**
   * Add product images
   */
  add: async (imageData) => {
    const formData = new FormData();
    if (imageData instanceof FormData) {
      return fetchWithAuth(API_ENDPOINTS.PRODUCT_IMAGES.ADD, {
        method: 'POST',
        body: imageData,
        headers: {},
      });
    }
    return fetchJSON(API_ENDPOINTS.PRODUCT_IMAGES.ADD, {
      method: 'POST',
      body: JSON.stringify(imageData),
    });
  },

  /**
   * Update product images
   */
  update: async (imageData) => {
    if (imageData instanceof FormData) {
      return fetchWithAuth(API_ENDPOINTS.PRODUCT_IMAGES.UPDATE, {
        method: 'PUT',
        body: imageData,
        headers: {},
      });
    }
    return fetchJSON(API_ENDPOINTS.PRODUCT_IMAGES.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    });
  },

  /**
   * Get images by product ID
   */
  getByProduct: async (productId) => {
    return fetchJSON(API_ENDPOINTS.PRODUCT_IMAGES.GET_BY_PRODUCT(productId));
  },

  /**
   * Delete product image
   */
  delete: async (productImageId) => {
    return fetchJSON(API_ENDPOINTS.PRODUCT_IMAGES.DELETE(productImageId), {
      method: 'DELETE',
    });
  },



};
