// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Authentication Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/auth/ForgetPassword';
import OTPVerification from './pages/auth/OTPVerification';
import CustomerSignup from './pages/auth/CustomerSignup';

// Landing & Public Pages
import LandingPage from './pages/LandingPage';
import CustomerContact from './pages/customer/Contact';
import Pricing from './pages/vendor/Pricing';

// Store Pages (Customer View)
import StoreHome from './pages/store/StoreHome';
import AllProducts from './pages/store/AllProducts';
import SingleProduct from './pages/product/SingleProduct';
import Cart from './pages/checkout/Cart';
import Checkout from './pages/checkout/Checkout';

// Vendor Pages
import VendorStore from './pages/vendor/VendorStore';
import VendorProducts from './pages/vendor/Products';
import VendorProductView from './pages/product/SingleProduct';
import VendorOrders from './pages/vendor/Orders';
import StoreDetails from './pages/vendor/StoreDetails';
import ContactSupport from './pages/vendor/ContactSupport';
import VendorPayment from './pages/vendor/Payment';
import CreateStore from './pages/vendor/CreateStore';

// Admin Pages
import ManageStores from './pages/admin/ManageStores';
import ManageVendors from './pages/admin/ManageVendors';
import AdminSettings from './pages/admin/AdminSettings';
import PricingManagement from './pages/admin/PricingManagement';

// Dashboard Pages
import VendorDashboard from './pages/dashboards/VendorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Protected Route Components
import ProtectedRoute, { VendorRoute, AdminRoute, CustomerRoute } from './routes/ProtectedRoutes';

// Create a wrapper component that uses useLocation
const AppContent = () => {
  // Note: We cannot use useLocation here because it's still at the top level
  // We'll handle redirect logic differently
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/customer/signup" element={<CustomerSignup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<CustomerContact />} />

      {/* Store Routes (Public) - Customer view */}
      <Route path="/store/:storeName" element={<StoreHome viewType="customer" />} />
      <Route path="/store/:storeName/products" element={<AllProducts viewType="customer" />} />
      <Route path="/store/:storeName/product/:productId" element={<SingleProduct viewType="customer" />} />
      <Route path="/store/:storeName/cart" element={
        <CustomerRoute>
          <Cart />
        </CustomerRoute>
      } />

      {/* Protected Customer Routes */}
      <Route path="/cart" element={
        <CustomerRoute>
          <Cart />
        </CustomerRoute>
      } />
      <Route path="/checkout" element={
        <CustomerRoute>
          <Checkout />
        </CustomerRoute>
      } />
      <Route path="/orders" element={
        <CustomerRoute>
          {/* Customer Orders page - to be created */}
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
        </CustomerRoute>
      } />

      {/* Protected Vendor Routes */}
      <Route path="/vendor/create-store" element={
        <VendorRoute>
          <CreateStore />
        </VendorRoute>
      } />
      <Route path="/vendor/dashboard" element={
        <VendorRoute>
          <VendorDashboard />
        </VendorRoute>
      } />
      <Route path="/vendor/store" element={
        <VendorRoute requireStore={true}>
          <VendorStore />
        </VendorRoute>
      } />
      <Route path="/vendor/products" element={
        <VendorRoute>
          <VendorProducts />
        </VendorRoute>
      } />
      <Route path="/vendor/product/:productId" element={
        <VendorRoute>
          <VendorProductView />
        </VendorRoute>
      } />
      <Route path="/vendor/orders" element={
        <VendorRoute>
          <VendorOrders />
        </VendorRoute>
      } />
      <Route path="/vendor/customers" element={
        <VendorRoute>
          {/* Vendor Customers page - to be created */}
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">Customers</h1>
          </div>
        </VendorRoute>
      } />
      <Route path="/vendor/settings" element={
        <VendorRoute>
          <StoreDetails />
        </VendorRoute>
      } />
      <Route path="/vendor/support" element={
        <VendorRoute>
          <ContactSupport />
        </VendorRoute>
      } />
      <Route path="/vendor/payment" element={
        <VendorRoute>
          <VendorPayment />
        </VendorRoute>
      } />
      <Route path="/vendor/pricing" element={
        <VendorRoute>
          <Pricing />
        </VendorRoute>
      } />

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/vendors" element={
        <AdminRoute>
          <ManageVendors />
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <ManageVendors />
        </AdminRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      } />
      <Route path="/admin/activity" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/support" element={
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      } />
      <Route path="/admin/stores" element={
        <AdminRoute>
          <ManageStores />
        </AdminRoute>
      } />
      <Route path="/admin/pricing" element={
        <AdminRoute>
          <PricingManagement />
        </AdminRoute>
      } />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  // Handle redirect logic on component mount
  useEffect(() => {
    // Check authentication on initial load
    const token = sessionStorage.getItem('authToken');
    const currentPath = window.location.pathname;
    
    if (!token && currentPath !== '/login' && currentPath !== '/signup' && 
        currentPath !== '/' && currentPath !== '/customer/signup' &&
        currentPath !== '/forgot-password' && currentPath !== '/verify-otp' &&
        currentPath !== '/pricing' && currentPath !== '/contact' &&
        !currentPath.startsWith('/store/')) {
      // Store intended destination
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
  }, []); // Run only on initial mount

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;