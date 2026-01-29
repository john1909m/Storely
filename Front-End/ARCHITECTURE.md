# Storely Frontend Architecture

## 🏗️ Architecture Overview

This is a production-ready multi-vendor e-commerce frontend built with React 18, React Router v6, Tailwind CSS, and Zustand for state management.

## 📁 Folder Structure

```
src/
├── api/                    # API service layer
│   ├── auth.api.js        # Authentication endpoints
│   ├── vendor.api.js      # Vendor management endpoints
│   ├── store.api.js       # Store management endpoints
│   ├── product.api.js     # Product & product images endpoints
│   ├── order.api.js       # Order & order item endpoints
│   ├── customer.api.js    # Customer management endpoints
│   ├── category.api.js    # Category management endpoints
│   └── fetchWithAuth.js   # Centralized fetch wrapper with auth
├── store/                  # Zustand global state stores
│   ├── authStore.js       # Authentication state
│   ├── cartStore.js       # Shopping cart state
│   └── storeStore.js      # Store & product state
├── hooks/                  # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   ├── useCart.js         # Cart management hook
│   └── useStore.js        # Store management hook
├── routes/                 # Route components
│   └── ProtectedRoutes.jsx # RBAC protected route wrapper
├── pages/                  # Page components
├── components/             # Reusable UI components
├── config/                 # Configuration files
│   └── api.config.js      # API endpoints configuration
└── utils/                  # Utility functions
    └── constants.js        # Application constants
```

## 🔐 Authentication & Authorization

### JWT Token Storage
- **Token Storage**: Uses `sessionStorage` (more secure than localStorage)
- **Token Management**: Centralized in `fetchWithAuth.js`
- **Auto-logout**: Automatically redirects to login on 401/403 errors

### Role-Based Access Control (RBAC)

Three user roles are supported:
- **ADMIN**: Full system access
- **VENDOR**: Store management access
- **CUSTOMER**: Shopping access

### Protected Routes

```jsx
// Vendor-only route
<VendorRoute>
  <VendorDashboard />
</VendorRoute>

// Admin-only route
<AdminRoute>
  <AdminDashboard />
</AdminRoute>

// Customer-only route
<CustomerRoute>
  <Cart />
</CustomerRoute>

// Custom role-based route
<ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
  <Component />
</ProtectedRoute>
```

## 🌐 API Integration

### Centralized API Service

All API calls go through `fetchWithAuth` which:
- Automatically attaches JWT token to requests
- Handles 401/403 errors globally
- Redirects to login on token expiration
- Provides consistent error handling

### API Usage Example

```javascript
import { vendorAPI } from '../api/vendor.api';

// Get vendor by name
const vendor = await vendorAPI.getByName('vendor-name');

// Add new vendor (requires auth)
const newVendor = await vendorAPI.add({
  name: 'New Vendor',
  email: 'vendor@example.com',
  // ... other fields
});
```

## 📦 State Management (Zustand)

### Auth Store

```javascript
import { useAuth } from '../hooks/useAuth';

const { 
  user, 
  role, 
  isAuthenticated, 
  login, 
  logout,
  isAdmin,
  isVendor 
} = useAuth();
```

### Cart Store

```javascript
import { useCart } from '../hooks/useCart';

const { 
  items, 
  totalPrice, 
  addItem, 
  removeItem,
  updateQuantity,
  clearCart 
} = useCart();
```

### Store Store

```javascript
import { useStore } from '../hooks/useStore';

const { 
  currentStore, 
  storeProducts, 
  categories,
  fetchStore,
  fetchProducts 
} = useStore();
```

## 🛣️ Routing Structure

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/store/:storeName` - Public store view
- `/store/:storeName/product/:productId` - Product view

### Protected Customer Routes
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Customer orders

### Protected Vendor Routes
- `/vendor/dashboard` - Vendor dashboard
- `/vendor/store` - Store management
- `/vendor/products` - Product management
- `/vendor/orders` - Order management
- `/vendor/customers` - Customer management
- `/vendor/settings` - Store settings

### Protected Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/vendors` - Vendor management
- `/admin/stores` - Store management
- `/admin/pricing` - Pricing management

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### API Base URL

The API base URL is configured in `src/config/api.config.js` and can be overridden via environment variable.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   - Create `.env` file with `VITE_API_BASE_URL`
   - Or update `src/config/api.config.js`

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📡 Backend API Integration

### Authentication Flow

1. User submits login form
2. Frontend calls `POST /auth/login` with credentials
3. Backend returns JWT token + user data
4. Token stored in sessionStorage
5. Token automatically attached to subsequent requests

### Error Handling

- **401 Unauthorized**: Token expired/invalid → Auto redirect to login
- **403 Forbidden**: Insufficient permissions → Show error message
- **Network Errors**: Display user-friendly error messages

## 🔒 Security Best Practices

1. **Token Storage**: Using sessionStorage (cleared on tab close)
2. **HTTPS**: Always use HTTPS in production
3. **Token Validation**: Backend validates all tokens
4. **CORS**: Backend should configure CORS properly
5. **XSS Protection**: React automatically escapes content
6. **CSRF**: Consider implementing CSRF tokens for state-changing operations

## 🎯 Performance Optimizations

1. **Code Splitting**: Use React.lazy() for route-based splitting
2. **Memoization**: Use React.memo() for expensive components
3. **State Management**: Zustand provides efficient re-renders
4. **API Caching**: Consider implementing response caching for frequently accessed data

## 📝 API Endpoints Reference

All API endpoints are documented in `src/config/api.config.js`. The backend should implement:

- **Auth**: `/auth/login`, `/auth/signup`
- **Vendor**: `/vendor/*`
- **Store**: `/store/*`
- **Product**: `/product/*`
- **Order**: `/order/*`, `/orderItem/*`
- **Customer**: `/customer/*`
- **Category**: `/category/*`

## 🧪 Testing Recommendations

1. **Unit Tests**: Test hooks and utility functions
2. **Integration Tests**: Test API integration
3. **E2E Tests**: Test complete user flows
4. **Role-based Tests**: Test RBAC for each role

## 🔄 Future Enhancements

- Token refresh mechanism
- Offline support with service workers
- Real-time updates with WebSockets
- Advanced analytics integration
- Payment gateway integration
- Subscription management

## 📚 Additional Resources

- [React Router v6 Documentation](https://reactrouter.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
