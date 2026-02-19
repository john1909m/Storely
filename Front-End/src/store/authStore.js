// Authentication store using Zustand (Cookie-based)
import { create } from 'zustand';
import { login as loginAPI, logout as logoutAPI, signup as signupAPI, getCurrentUser } from '../api/auth.api';
import { storeAPI } from '../api/store.api';
import { cookieManager } from '../api/fetchWithAuth';
import { ca } from 'date-fns/locale';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  vendor: null,
  store: null, // Store information
  role: null,
  isAuthenticated: false,
  isLoading: true,
  authInialized: false,
  error: null,

  // Actions
  /**
   * Login user
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginAPI(credentials);
      
      // Normalize role to uppercase
      const role = (response.role || 'CUSTOMER').toUpperCase();
      const vendorData = response.vendor || (response.vendorId ? { id: response.vendorId } : null);
      
      // Handle store data
      console.log('Login response:', response);
      
      let storeData = null;
      
      // If vendor, try to fetch store(s) by vendorId
      if (role === 'VENDOR' && vendorData?.id) {
        try {
          const vendorStores = await storeAPI.getByVendorId(vendorData.id);
          console.log('Vendor stores:', vendorStores);
          
          // Check if we got an array or single store
          if (Array.isArray(vendorStores) && vendorStores.length > 0) {
            // Get the first store (or find active one)
            storeData = vendorStores[0];
          } else if (vendorStores && vendorStores.id) {
            // Single store returned
            storeData = vendorStores;
          }
          
          console.log('Found store data:', storeData);
        } catch (err) {
          console.error('Error fetching vendor store:', err);
          storeData = null;
        }
      }

      set({
        user: response.user || { 
          id: response.userId || response.user?.id, 
          email: credentials.email,
          ...response.user
        },
        vendor: vendorData,
        store: storeData, // This will be null if no store found
        role: role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Store in sessionStorage for persistence
      if (response.userId || response.user?.id) {
        sessionStorage.setItem('userId', response.userId || response.user?.id || '');
        sessionStorage.setItem('userRole', role);
        
        if (vendorData?.id) {
          sessionStorage.setItem('vendorId', vendorData.id);
        }
        
        if (storeData?.id) {
          sessionStorage.setItem('storeId', storeData.id);
          sessionStorage.setItem('storeName', storeData.storeName);
        } else {
          // Clear store from session if no store
          sessionStorage.removeItem('storeId');
          sessionStorage.removeItem('storeName');
        }
      }

      return {
        ...response,
        role: role,
        store: storeData
      };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Login failed',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  /**
   * Signup new user
   */
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signupAPI(userData);
      
      // DON'T set authenticated state - user needs to login manually
      // Just return the response
      
      set({
        isLoading: false,
        error: null,
        // Don't change authentication state
      });

      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Signup failed',
      });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear session storage
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('vendorId');
      sessionStorage.removeItem('storeId');
      sessionStorage.removeItem('storeName');
      
      set({
        user: null,
        vendor: null,
        store: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Initialize auth from session storage
   */
  initializeAuth: async () => {
    try{
          const currentUser = await getCurrentUser();
    
    if (currentUser) {
      const store = currentUser.store;
      const vendorId = currentUser.vendorId;
      
      set({
        user: { id: currentUser.id },
        vendor: vendorId ? { id: vendorId } : null,
        store: store,
        role: currentUser.role,
        isAuthenticated: true,
      });
    }
    }catch(error){
      console.error('Error initializing auth:', error);
    }finally{
      set({ isLoading: false, authInialized: true });
    }
  },

  /**
   * Update user data
   */
  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  },

  /**
   * Update vendor data
   */
  updateVendor: (vendorData) => {
    set({ vendor: { ...get().vendor, ...vendorData } });
  },

  /**
   * Update store data
   */
  updateStore: (storeData) => {
    set({ store: { ...get().store, ...storeData } });
    if (storeData.id) {
      sessionStorage.setItem('storeId', storeData.id);
    }
    if (storeData.storeName) {
      sessionStorage.setItem('storeName', storeData.storeName);
    }
  },

  /**
   * Set store data
   */
  setStore: (store) => {
    set({ store });
    if (store) {
      sessionStorage.setItem('storeId', store.id);
      sessionStorage.setItem('storeName', store.storeName);
    }
  },

  /**
   * Check if vendor has store
   */
  hasStore: () => {
    return !!get().store;
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Check if user has specific role
   */
  hasRole: (requiredRole) => {
    const { role } = get();
    return role === requiredRole;
  },

  /**
   * Check if user is admin
   */
  isAdmin: () => {
    return get().role === 'ADMIN';
  },

  /**
   * Check if user is vendor
   */
  isVendor: () => {
    return get().role === 'VENDOR';
  },

  /**
   * Check if user is customer
   */
  isCustomer: () => {
    return get().role === 'CUSTOMER';
  },
}));

export default useAuthStore;