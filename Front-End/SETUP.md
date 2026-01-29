# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
   
   Or update `src/config/api.config.js` directly.

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Backend Integration

### Expected Backend Response Format

#### Login Response
```json
{
  "token": "jwt-token-string",
  "role": "ADMIN" | "VENDOR" | "CUSTOMER",
  "userId": "user-id",
  "vendorId": "vendor-id" // optional, only for vendors
}
```

#### Error Response
```json
{
  "message": "Error message here"
}
```

### CORS Configuration

Ensure your Spring Boot backend allows requests from your frontend origin:

```java
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
```

## Testing the Integration

1. **Test Login Flow**
   - Navigate to `/login`
   - Enter credentials
   - Should redirect to role-based dashboard

2. **Test Protected Routes**
   - Try accessing `/vendor/dashboard` without login → should redirect to `/login`
   - Login as vendor → should access vendor routes
   - Login as admin → should access admin routes

3. **Test API Calls**
   - Check browser DevTools Network tab
   - Verify `Authorization: Bearer <token>` header is present
   - Verify API calls go to correct endpoints

## Common Issues

### Token Not Persisting
- Check that `sessionStorage` is available (not in incognito/private mode)
- Verify token is being set in `auth.api.js`

### 401 Errors
- Check token format matches backend expectations
- Verify backend JWT secret matches
- Check token expiration time

### CORS Errors
- Ensure backend CORS is configured
- Check API base URL is correct

### Route Not Protecting
- Verify `ProtectedRoute` wrapper is used
- Check role matches expected format (uppercase: ADMIN, VENDOR, CUSTOMER)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |

## Next Steps

1. Implement remaining pages (Orders, Customers, etc.)
2. Add error boundaries for better error handling
3. Implement loading states for better UX
4. Add form validation
5. Implement token refresh mechanism
6. Add analytics tracking
7. Optimize bundle size with code splitting
