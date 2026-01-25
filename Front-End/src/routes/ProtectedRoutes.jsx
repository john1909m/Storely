import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('storely_auth_token');
  
//   if (!isAuthenticated || isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
  
  return children;
};

export default ProtectedRoute;