// src/api/shipping.api.js
import { fetchJSON, fetchWithAuth } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const shippingAPI = {
    add: async (shippingData) => {
        const formData = new FormData();
        if (shippingData instanceof FormData) {
          return fetchWithAuth(API_ENDPOINTS.SHIPPING.ADD, {
            method: 'POST',
            body: shippingData,
            headers: {},
          });
        }
        return fetchJSON(API_ENDPOINTS.SHIPPING.ADD,{
            method: 'POST',
            body: JSON.stringify(shippingData),
        });
    },
    update: async (shippingData) => {
        if (shippingData instanceof FormData) {
          return fetchWithAuth(API_ENDPOINTS.SHIPPING.UPDATE, {
            method: 'PUT',
            body: shippingData,
            headers: {},
          });
        }
        return fetchJSON(API_ENDPOINTS.SHIPPING.UPDATE,{
            method: 'PUT',
            body: JSON.stringify(shippingData),
        });
    },
    get: async (storeId) => {
        return fetchJSON(API_ENDPOINTS.SHIPPING.GET_ALL(storeId));
    },
    get_governments: async () => {
        return fetchJSON(API_ENDPOINTS.GOVERNORATE.GET_ALL());
    }
}