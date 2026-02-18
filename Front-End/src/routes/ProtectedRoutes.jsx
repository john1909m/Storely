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
  const { isAuthenticated, role, isLoading} = useAuth();
  const location = useLocation();

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

  // First check if user is vendor (let ProtectedRoute handle role checking)
  // We'll handle store-specific logic here
  
  const currentPath = location.pathname;
  
  console.log('VendorRoute - Path:', currentPath, 'Has Store:', hasStore(), 'Store:', store);

  // CASE 1: Vendor with store
  if (isVendor() && hasStore()) {
    // If trying to access create-store, redirect to store
    if (currentPath === '/vendor/create-store') {
      console.log('VendorRoute: Has store, redirecting from create-store to store');
      return <Navigate to="/vendor/store" replace />;
    }
    
    // If trying to access dashboard, redirect to store (or keep on dashboard if you want)
    if (currentPath === '/vendor/dashboard') {
      console.log('VendorRoute: Has store, redirecting from dashboard to store');
      return <Navigate to="/vendor/store" replace />;
    }
    
    // Allow access to store page and other vendor routes
    console.log('VendorRoute: Has store, allowing access to:', currentPath);
    return (
      <ProtectedRoute allowedRoles={['VENDOR']}>
        {children}
      </ProtectedRoute>
    );
  }
  
  // CASE 2: Vendor without store
  if (isVendor() && !hasStore()) {
    // If trying to access store or dashboard without store, redirect to create-store
    if (currentPath === '/vendor/store' || currentPath === '/vendor/dashboard') {
      console.log('VendorRoute: No store, redirecting to create-store');
      return <Navigate to="/vendor/create-store" replace />;
    }
    
    // Allow access to create-store page
    if (currentPath === '/vendor/create-store') {
      console.log('VendorRoute: No store, allowing access to create-store');
      return (
        <ProtectedRoute allowedRoles={['VENDOR']}>
          {children}
        </ProtectedRoute>
      );
    }
  }

  // Default case - let ProtectedRoute handle it
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