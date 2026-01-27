// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role = 'customer' }) => {
  // In a real app, you would check authentication and user role from your auth context/state
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const userRole = localStorage.getItem('userRole') || 'customer';
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  // Check if user has the required role
  // if (role !== 'any' && userRole !== role) {
  //   // Redirect to appropriate dashboard based on role
  //   const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : 
  //                        userRole === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard';
  //   return <Navigate to={dashboardPath} replace />;
  // }
  
  return children;
};

export default ProtectedRoute;