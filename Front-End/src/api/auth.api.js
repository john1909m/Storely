// Authentication API service (Cookie-based)
import { fetchJSON, fetchWithAuth, cookieManager } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api.config';


export const authAPI = {
  /**
   * Send OTP to email
   * @param {string} email - User email
   */
  sendOtp: async (email) => {
    try {
      const response = await fetchJSON(
        API_ENDPOINTS.AUTH.SEND_OTP,
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        },
        false
      );
      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error(error.message || 'Failed to send verification code');
    }
  },

  /**
   * Verify OTP and reset password in one call
   * @param {string} email - User email
   * @param {string} code - OTP code (6 digits)
   * @param {string} newPassword - New password
   * @returns {Promise<string>} - Success message
   */
  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await fetchJSON(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify({ 
            email, 
            code, 
            newPassword 
          }),
        },
        false
      );
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Invalid code or failed to reset password');
    }
  },
}


/**
 * Login user - backend will set HTTP-only cookie
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - { user, role, vendor? }
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
    if (role) {
      role = role.toUpperCase();
    }

    // Store user info in sessionStorage (but NOT the token - it's in cookie)
    if (response.userId || response.user?.id) {
      sessionStorage.setItem('userId', response.userId || response.user?.id || '');
      sessionStorage.setItem('userRole', role || 'CUSTOMER');
      
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
      role: role || 'CUSTOMER'
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

    // If signup returns user data, store info in sessionStorage
    if (response && (response.userId || response.user?.id)) {
      sessionStorage.setItem('userId', response.userId || response.user?.id || '');
      sessionStorage.setItem('userRole', response.role || 'CUSTOMER');
      
      if (response.vendorId || response.vendor?.id) {
        sessionStorage.setItem('vendorId', response.vendorId || response.vendor.id);
      }
      
      if (response.store) {
        sessionStorage.setItem('storeId', response.store.id);
        sessionStorage.setItem('storeName', response.store.storeName);
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
 * Logout user - call backend to clear cookie
 */
export const logout = async () => {
  try {
    // Call logout endpoint to clear the cookie on server side
    await fetchJSON(
      API_ENDPOINTS.AUTH.LOGOUT,
      {
        method: 'POST',
      },
      true // Auth required for logout
    );
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear session storage regardless of API response
    cookieManager.clear();
  }
};

/**
 * Check if user is authenticated (by checking session storage)
 * Note: For a more reliable check, you might want to call a /verify endpoint
 */
export const isAuthenticated = () => {
  return cookieManager.isAuthenticated();
};

/**
 * Get current user info from session storage
 */
export const getCurrentUser = () => {
  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('userRole');
  const vendorId = sessionStorage.getItem('vendorId');
  const storeId = sessionStorage.getItem('storeId');
  const storeName = sessionStorage.getItem('storeName');
  
  if (!userId) return null;
  
  return {
    id: userId,
    role: userRole,
    vendorId: vendorId || null,
    store: storeId ? { id: storeId, storeName } : null
  };
};