// Authentication store using Zustand
import { create } from 'zustand';
import { login, logout as logoutAPI, signup } from '../api/auth.api';
import { tokenManager } from '../api/fetchWithAuth';

const useAuthStore = create((set, get) => ({
      // State
      user: null,
      vendor: null,
      store: null, // Store information
      role: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      /**
       * Login user
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await login(credentials);
          // Normalize role to uppercase
          const role = (response.role || 'CUSTOMER').toUpperCase();
          const vendorData = response.vendor || (response.vendorId ? { id: response.vendorId } : null);
          let storeData = response.store || null;
          // If vendor but no store in response, try to fetch store(s) by vendorId
          if (role === 'VENDOR' && vendorData?.id && (!storeData || !storeData.id)) {
            try {
              const { storeAPI } = await import('../api/store.api');
              const vendorStores = await storeAPI.getByVendorId(vendorData.id);
              const foundStore = Array.isArray(vendorStores)
                ? vendorStores.find(s => s.vendorId && String(s.vendorId) === String(vendorData.id))
                : (vendorStores && vendorStores.vendorId && String(vendorStores.vendorId) === String(vendorData.id) ? vendorStores : null);
              if (foundStore && foundStore.id) {
                storeData = foundStore;
              } else {
                storeData = null;
              }
            } catch (err) {
              storeData = null;
            }
          }
          set({
            user: response.user || { id: response.userId || response.user?.id, email: credentials.email },
            vendor: vendorData,
            store: storeData && storeData.id ? storeData : null, // Only set if valid
            role: role, // Use normalized role
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          // Store info in sessionStorage if exists
          if (storeData && storeData.id) {
            sessionStorage.setItem('storeId', storeData.id);
            sessionStorage.setItem('storeName', storeData.storeName);
          } else {
            sessionStorage.removeItem('storeId');
            sessionStorage.removeItem('storeName');
          }
          // Return response with normalized role and store
          return {
            ...response,
            role: role,
            store: storeData && storeData.id ? storeData : null
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
          const response = await signup(userData);
          
          if (response.token) {
            set({
              user: response.user || { id: response.userId, email: userData.email },
              vendor: response.vendor || null,
              store: response.store || null,
              role: response.role || 'VENDOR', // Default to VENDOR for signup
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            if (response.store) {
              sessionStorage.setItem('storeId', response.store.id);
              sessionStorage.setItem('storeName', response.store.storeName);
            }
          }

          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Signup failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },

      /**
       * Logout user
       */
      logout: () => {
        logoutAPI();
        set({
          user: null,
          vendor: null,
          store: null,
          role: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Initialize auth from session storage
       */
      initializeAuth: () => {
        const token = tokenManager.get();
        const role = sessionStorage.getItem('userRole');
        const userId = sessionStorage.getItem('userId');
        const vendorId = sessionStorage.getItem('vendorId');
        const storeId = sessionStorage.getItem('storeId');
        const storeName = sessionStorage.getItem('storeName');
        let store = null;
        if (storeId && storeName) {
          store = { id: storeId, storeName };
        }
        if (token && role && userId) {
          set({
            token,
            role,
            user: { id: userId },
            vendor: vendorId ? { id: vendorId } : null,
            store: store,
            isAuthenticated: true,
          });
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
    })
);

export default useAuthStore;
