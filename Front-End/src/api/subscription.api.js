import { fetchJSON, fetchWithAuth } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const subscriptionAPI = {
    /**
    * Get all subscription plans
    */
    getAllVendorSubscriptions: async () => {
        return fetchWithAuth(API_ENDPOINTS.VENDOR_SUBSCRIPTION.GET_ALL);
    },

    getVendorSubscriptionById: async (id) => {
        return fetchWithAuth(API_ENDPOINTS.VENDOR_SUBSCRIPTION.GET_BY_ID(id));
    },

    getVendorSubscriptionByVendorId: async (vendorId) => {
        return fetchJSON(API_ENDPOINTS.VENDOR_SUBSCRIPTION.GET_BY_VENDOR_ID(vendorId));
    },
    /**
    * Add a new subscription plan
    */
    addVendorSubscription: async (subscriptionData) => {
        return fetchWithAuth(API_ENDPOINTS.VENDOR_SUBSCRIPTION.ADD, {
            method: 'POST',
            body: JSON.stringify(subscriptionData),
        });
    },

    updateVendorSubscription: async (subscriptionData) => {
        return fetchWithAuth(API_ENDPOINTS.VENDOR_SUBSCRIPTION.UPDATE, {
            method: 'PUT',
            body: JSON.stringify(subscriptionData),
        });
    },
    /**
    * Delete a subscription plan
    */
    deleteVendorSubscription: async (id) => {
        return fetchWithAuth(API_ENDPOINTS.VENDOR_SUBSCRIPTION.DELETE(id), {
            method: 'DELETE',
        });
    }




}