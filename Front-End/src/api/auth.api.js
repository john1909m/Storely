// Authentication API service
import { fetchJSON, fetchWithAuth, tokenManager } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Login user and store token
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - { token, user, role, vendor? }
 */
export const login = async (credentials) => {
  try {
    const response = await fetchJSON(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false // No auth required for login
    );

    // Debug: Log the response to see what backend returns
    console.log('Login response:', response);

    // Determine role - check multiple possible fields
    let role = response.role || response.userRole || response.user?.role;
    
    // If vendorId exists but no role, assume VENDOR
    if (!role && (response.vendorId || response.vendor)) {
      role = 'VENDOR';
    }
    
    // If adminId exists, assume ADMIN
    if (!role && (response.adminId || response.admin)) {
      role = 'ADMIN';
    }
    
    


    // Normalize role to uppercase
    role = role.toUpperCase();

    // Store token and user info
    if (response.token) {
      tokenManager.set(response.token);
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('userId', response.userId || response.user?.id || '');
      if (response.vendorId || response.vendor?.id) {
        sessionStorage.setItem('vendorId', response.vendorId || response.vendor.id);
      }
      if (response.store) {
        sessionStorage.setItem('storeId', response.store.id);
        sessionStorage.setItem('storeName', response.store.storeName);
      }
    }

    // Return response with normalized role
    return {
      ...response,
      role: role
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Signup new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} - Created user data
 */
export const signup = async (userData) => {
  try {
    const response = await fetchJSON(
      API_ENDPOINTS.AUTH.SIGNUP,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      false // No auth required for signup
    );

    // If signup returns token, store it
    if (response && response.token) {
      tokenManager.set(response.token);
      sessionStorage.setItem('userRole', response.role || 'VENDOR');
      sessionStorage.setItem('userId', response.userId || '');
      if (response.vendorId) {
        sessionStorage.setItem('vendorId', response.vendorId);
      }
    }

    // Return response even if empty (some backends return 204 No Content)
    return response || { success: true };
  } catch (error) {
    // Provide more detailed error message
    const errorMessage = error.message || 'Signup failed';
    console.error('Signup error:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Logout user
 */
export const logout = () => {
  tokenManager.clear();
  // Additional cleanup can be added here
};
