import { fetchJSON, fetchWithAuth } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

export const pricingAPI = {
    /**
    * Get all subscription plans
    */
    getPlans: async () => {
        return fetchJSON(API_ENDPOINTS.PRICING.GET_PLANS);
    },
    /**
    * Add a new subscription plan
    */
    addPlan: async (planData) => {
        return fetchWithAuth(API_ENDPOINTS.PRICING.Add_PLAN, {
            method: 'POST',
            body: JSON.stringify(planData),
        });
    },
    
    updatePlan: async (planData) => {
        return fetchWithAuth(API_ENDPOINTS.PRICING.UPDATE_PLAN, {
            method: 'PUT',
            body: JSON.stringify(planData),
        });
    },
    /**
    * Delete a subscription plan
    */
    deletePlan: async (planId) => {
        return fetchWithAuth(API_ENDPOINTS.PRICING.DELETE_PLAN(planId), {
            method: 'DELETE',
        });
    }

}