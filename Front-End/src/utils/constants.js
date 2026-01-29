// Application constants
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
  CUSTOMER: 'CUSTOMER',
};

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Customer
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  
  // Vendor
  VENDOR_DASHBOARD: '/vendor/dashboard',
  VENDOR_STORE: '/vendor/store',
  VENDOR_PRODUCTS: '/vendor/products',
  VENDOR_ORDERS: '/vendor/orders',
  VENDOR_CUSTOMERS: '/vendor/customers',
  VENDOR_SETTINGS: '/vendor/settings',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_VENDORS: '/admin/vendors',
  ADMIN_STORES: '/admin/stores',
  ADMIN_PRICING: '/admin/pricing',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
