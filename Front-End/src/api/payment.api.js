import { fetchJSON, fetchWithAuth } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const paymentAPI = {
    getPaymentMethods: async (storeId) => {
        return fetchJSON(API_ENDPOINTS.PaymentMethods.GET_ALL(storeId));
    },
    addPaymentMethod: async (storeId, paymentMethodData) => {
    console.log('📤 StoreId for update:', storeId);
    const url = API_ENDPOINTS.PaymentMethods.ADD(storeId);
    console.log('📤 Update URL:', url); // المفروض يظهر "/store-payment-methods/123456/add"
    return fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(paymentMethodData),
    });
  }
}