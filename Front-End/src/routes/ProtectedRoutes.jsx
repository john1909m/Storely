// src/routes/ProtectedRoutes.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute component with role-based access control (RBAC)
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string|string[]} allowedRoles - Role(s) allowed to access this route
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['CUSTOMER', 'VENDOR', 'ADMIN'], 
  requireAuth = true 
}) => {
  const { isAuthenticated, role, isLoading, initializeAuth } = useAuth();
  const location = useLocation();

  // Initialize auth on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      initializeAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireAuth && role) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const normalizedRoles = rolesArray.map(r => r.toUpperCase());
    const userRole = role.toUpperCase();

    if (!normalizedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user's role
      const dashboardPath = 
        userRole === 'ADMIN' ? '/admin/dashboard' :
        userRole === 'VENDOR' ? '/vendor/dashboard' :
        '/';

      return <Navigate to={dashboardPath} replace />;
    }
  }

  return children;
};

/**
 * Vendor-specific protected route with store check
 */
export const VendorRoute = ({ children, requireStore = false }) => {
  const { isVendor, store, hasStore, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth to load
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If route requires store and vendor doesn't have one, redirect to create-store
  if (requireStore && isVendor() && !hasStore()) {
    console.log('VendorRoute: No store found, redirecting to create-store');
    return <Navigate to="/vendor/create-store" state={{ from: location }} replace />;
  }

  // If vendor has store but trying to access create-store, redirect to store
  if (isVendor() && hasStore() && location.pathname === '/vendor/create-store') {
    console.log('VendorRoute: Store exists, redirecting from create-store to store');
    return <Navigate to="/vendor/store" replace />;
  }

  // If vendor accesses /vendor/dashboard without store, redirect to create-store
  if (isVendor() && !hasStore() && location.pathname === '/vendor/dashboard') {
    console.log('VendorRoute: No store, redirecting dashboard to create-store');
    return <Navigate to="/vendor/create-store" replace />;
  }

  // If vendor accesses /vendor/dashboard with store, redirect to store page
  if (isVendor() && hasStore() && location.pathname === '/vendor/dashboard') {
    console.log('VendorRoute: Store exists, redirecting dashboard to store');
    return <Navigate to="/vendor/store" replace />;
  }

  return (
    <ProtectedRoute allowedRoles={['VENDOR']}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Admin-specific protected route
 */
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Customer-specific protected route
 */
export const CustomerRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;