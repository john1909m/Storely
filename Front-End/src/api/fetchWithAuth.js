// Centralized API service with authentication
import { API_BASE_URL } from '../config/api.config';

/**
 * Secure token storage using sessionStorage (more secure than localStorage)
 * For production, consider using httpOnly cookies or secure storage solutions
 */
const getToken = () => {
  return sessionStorage.getItem('authToken');
};

const setToken = (token) => {
  if (token) {
    sessionStorage.setItem('authToken', token);
  } else {
    sessionStorage.removeItem('authToken');
  }
};

const clearAuth = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('vendorId');
};

/**
 * Enhanced fetch wrapper with automatic auth token attachment and error handling
 * @param {string} url - API endpoint (relative or absolute)
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 * @returns {Promise<Response>}
 */
export const fetchWithAuth = async (url, options = {}, requireAuth = true) => {
  // Build full URL if relative
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach auth token if required and available
  if (requireAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Merge options
  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(fullUrl, fetchOptions);

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      clearAuth();
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
      throw new Error('Unauthorized: Please login again');
    }

    // Handle 403 Forbidden - insufficient permissions
    if (response.status === 403) {
      throw new Error('Forbidden: You do not have permission to access this resource');
    }

    // Handle other errors
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const text = await response.text();
        if (text) {
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // If not JSON, use the text as error message
            errorMessage = text.substring(0, 200) || errorMessage;
          }
        }
      } catch (e) {
        // If we can't read the response, use default message
      }
      throw new Error(errorMessage);
    }

    // Return response for manual parsing if needed
    return response;
  } catch (error) {
    // Re-throw with context
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      throw error;
    }
    throw new Error(`Network error: ${error.message}`);
  }
};

/**
 * Convenience method for JSON responses
 */
export const fetchJSON = async (url, options = {}, requireAuth = true) => {
  const response = await fetchWithAuth(url, options, requireAuth);
  
  // Check if response has content
  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');
  
  // If no content or empty response, return empty object
  if (contentLength === '0' || !contentType) {
    return {};
  }
  
  // Check if response is actually JSON
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    // If empty text, return empty object
    if (!text || text.trim() === '') {
      return {};
    }
    // Try to parse as JSON anyway (some servers don't set content-type correctly)
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }
  }
  
  // Get response text first to check if it's empty
  const text = await response.text();
  
  // If empty, return empty object
  if (!text || text.trim() === '') {
    return {};
  }
  
  // Parse JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${e.message}`);
  }
};

/**
 * Token management utilities
 */
export const tokenManager = {
  get: getToken,
  set: setToken,
  clear: clearAuth,
  exists: () => !!getToken(),
};
