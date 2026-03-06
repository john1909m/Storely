// API Configuration
// Update this with your Spring Boot backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.storely-eg.com';
import Pricing from './../pages/vendor/Pricing';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  // Vendor
  VENDOR: {
    ADD: '/vendor/add',
    UPDATE: '/vendor/update',
    GET_BY_NAME: (vendorName) => `/vendor/get/${vendorName}`,
    GET_BY_ID: (vendorId) => `/vendor/get/${vendorId}`,
    GET_STORE_BY_NAME: (storeName) => `/vendor/get/store/${storeName}`,
    GET_STORE_BY_ID: (storeId) => `/vendor/get/store/${storeId}`,
    GET_ALL: '/vendor/get/all',
    DELETE: (vendorId) => `/vendor/delete/${vendorId}`,
  },
  // Store
  STORE: {
    ADD: '/store/add',
    UPDATE: '/store/update',
    GET_BY_ID: (storeId) => `/store/get/${storeId}`,
    GET_BY_VENDOR_ID: (vendorId) => `/store/get/vendor/${vendorId}`,
    GET_BY_VENDOR_NAME: (vendorName) => `/store/get/vendor/name/${vendorName}`,
    GET_BY_NAME: (storeName) => `/store/get/name/${storeName}`,
    GET_ALL: '/store/get/all',
    DELETE: (storeId) => `/store/delete/${storeId}`,
    UPLOAD_IMAGE: (storeId) => `/store/${storeId}/upload-image`,
    
  },
  // Product
  PRODUCT: {
    ADD: '/product/add',
    UPDATE: '/product/update',
    GET_BY_ID: (productId, storeId) => `/product/get/${productId}/${storeId}`,
    SEARCH: (productName, storeId) => `/product/get/search/${productName}/${storeId}`,
    GET_BY_CATEGORY: (categoryId, storeId) => `/product/get/category/${categoryId}/${storeId}`,
    GET_ALL: (storeId) => `/product/get/all/${storeId}`,
    DELETE: (productId) => `/product/delete/${productId}`,
    UPLOAD_PRODUCT_IMAGE: (productId) => `/product/${productId}/upload-product-images`,
  },
  // Product Images
  PRODUCT_IMAGES: {
    ADD: '/product/images/add',
    UPDATE: '/product/images/update',
    GET_BY_PRODUCT: (productId) => `/product/images/get/${productId}`,
    DELETE: (productImageId) => `/product/images/delete/${productImageId}`,
  },
  // Order
  ORDER: {
    CHECKOUT: '/order/checkout',
    ADD: '/order/add',
    UPDATE: '/order/update',
    GET_BY_ID: (orderId, storeId) => `/order/get/${orderId}/store/${storeId}`,
    GET_BY_STORE: (storeId) => `/order/get/store/${storeId}`,
    DELETE: (orderId) => `/order/delete/${orderId}`,
  },
  // Order Item
  ORDER_ITEM: {
    ADD: '/orderItem/add',
    UPDATE: '/orderItem/update',
    GET_BY_ORDER: (orderId) => `/orderItem/get/order/${orderId}`,
    DELETE: (orderItemId) => `/orderItem/delete/${orderItemId}`,
  },
  // Customer
  CUSTOMER: {
    ADD: '/customer/add',
    UPDATE: '/customer/update',
    GET_BY_STORE: (storeId) => `/customer/get/store/${storeId}`,
    GET_BY_ORDER: (orderId) => `/customer/get/order/${orderId}`,
    GET_BY_CITY: (city, storeId) => `/customer/get/city/store/${city}/${storeId}`,
    DELETE: (customerId) => `/customer/delete/${customerId}`,
  },
  // Category
  CATEGORY: {
    ADD: '/category/add',
    UPDATE: '/category/update',
    GET_BY_ID: (categoryId) => `/category/get/${categoryId}`,
    GET_BY_STORE: (storeId) => `/category/get/store/${storeId}`,
    GET_BY_NAME: (categoryName, storeId) => `/category/get/name/${categoryName}/store/${storeId}`,
    DELETE: (categoryId) => `/category/delete/${categoryId}`,
  },
  PRICING:{
    GET_PLANS: '/subscription-plan/get/all',
    Add_PLAN: '/subscription-plan/add',
    DELETE_PLAN: (planId) => `/subscription-plan/delete/${planId}`,
    UPDATE_PLAN: '/subscription-plan/update',
    GET_PLAN_BY_ID: (planId) => `/subscription-plan/get/${planId}`,
    
  },

  VENDOR_SUBSCRIPTION: {
    GET_ALL: '/vendor-subscription/get/all',
    GET_BY_ID: (id) => `/vendor-subscription/get/${id}`,
    GET_BY_VENDOR_ID: (vendorId) => `/vendor-subscription/get/vendor/${vendorId}`,
    ADD: '/vendor-subscription/add',
    UPDATE: '/vendor-subscription/update',
    DELETE: (id) => `/vendor-subscription/delete/${id}`,
  },
  SHIPPING:{
    GET_ALL:(storeId) => `/shipping-cost/store/${storeId}`,
    ADD:'/shipping-cost/add',
    UPDATE:'/shipping-cost/update',
    
  }
  ,
  GOVERNORATE: {
    GET_ALL:() => '/shipping-cost/governorates',
  },
};
