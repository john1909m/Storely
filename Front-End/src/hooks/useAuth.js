// Custom hook for authentication
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

/**
 * Custom hook for authentication
 * Provides auth state and actions
 */
export const useAuth = () => {
  const authStore = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    authStore.initializeAuth();
  }, []);

  return {
    // State
    user: authStore.user,
    vendor: authStore.vendor,
    store: authStore.store,
    role: authStore.role,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,

    // Actions
    login: authStore.login,
    signup: authStore.signup,
    logout: authStore.logout,
    updateUser: authStore.updateUser,
    updateVendor: authStore.updateVendor,
    updateStore: authStore.updateStore,
    setStore: authStore.setStore,
    clearError: authStore.clearError,

    // Role checks
    hasRole: authStore.hasRole,
    isAdmin: authStore.isAdmin,
    isVendor: authStore.isVendor,
    isCustomer: authStore.isCustomer,
    hasStore: authStore.hasStore,
  };
};

export default useAuth;
