// src/App.jsx
import React from 'react';
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
import VendorStoreHome from './pages/store/StoreHome';
import VendorProducts from './pages/store/AllProducts';
import VendorProductView from './pages/product/SingleProduct';
import VendorOrders from './pages/vendor/Orders';
import StoreDetails from './pages/vendor/StoreDetails';
import ContactSupport from './pages/vendor/ContactSupport';
import VendorPayment from './pages/vendor/Payment';

// Admin Pages
import ManageStores from './pages/admin/ManageStores';
import PricingManagement from './pages/admin/PricingManagement';

// Dashboard Pages
import VendorDashboard from './pages/dashboards/VendorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Protected Route Component
import ProtectedRoute from './routes/ProtectedRoutes';

function App() {
  return (
    <Router>
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

        {/* Store Routes (Public) */}
        <Route path="/store/:storeId" element={<StoreHome viewType="customer" />} />
        <Route path="/store/:storeId/products" element={<AllProducts viewType="customer" />} />
        <Route path="/store/:storeId/product/:productId" element={<SingleProduct viewType="customer" />} />

        {/* Customer Routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
      

        {/* Protected Vendor Routes */}
        <Route path="/vendor/dashboard" element={
          <ProtectedRoute>
            <VendorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/vendor/store" element={
          <ProtectedRoute>
            <VendorStoreHome />
          </ProtectedRoute>
        } />
        <Route path="/vendor/products" element={
          <ProtectedRoute>
            <VendorProducts />
          </ProtectedRoute>
        } />
        <Route path="/vendor/product/:productId" element={
          <ProtectedRoute>
            <VendorProductView />
          </ProtectedRoute>
        } />
        <Route path="/vendor/orders" element={
          <ProtectedRoute>
            <VendorOrders />
          </ProtectedRoute>
        } />
        <Route path="/vendor/store-settings" element={
          <ProtectedRoute>
            <StoreDetails />
          </ProtectedRoute>
        } />
        <Route path="/vendor/support" element={
          <ProtectedRoute>
            <ContactSupport />
          </ProtectedRoute>
        } />
        <Route path="/vendor/payment" element={
          <ProtectedRoute>
            <VendorPayment />
          </ProtectedRoute>
        } />

        <Route path="/vendor/pricing" element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute>
            <ManageStores />
          </ProtectedRoute>
        } />
        <Route path="/admin/pricing" element={
          <ProtectedRoute>
            <PricingManagement />
          </ProtectedRoute>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;