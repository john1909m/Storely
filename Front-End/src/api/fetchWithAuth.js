// api/fetchWithAuth.js
import { API_BASE_URL } from '../config/api.config';

/**
 * Clear session storage data (cookies are handled by backend)
 */
const clearAuthData = () => {
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('vendorId');
  sessionStorage.removeItem('storeId');
  sessionStorage.removeItem('storeName');
};

/**
 * Enhanced fetch wrapper with automatic cookie-based authentication
 */
export const fetchWithAuth = async (url, options = {}, requireAuth = true) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const isFormData = options.body instanceof FormData;
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(fullUrl, fetchOptions);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      clearAuthData();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
      const error = new Error('Unauthorized: Please login again');
      error.response = {
        status: 401,
        data: { message_ar: 'الرجاء تسجيل الدخول مرة أخرى', message_en: 'Please login again' },
        headers: response.headers
      };
      throw error;
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      const error = new Error('Forbidden: You do not have permission');
      error.response = {
        status: 403,
        data: { message_ar: 'ليس لديك صلاحية', message_en: 'Access denied' },
        headers: response.headers
      };
      throw error;
    }

    // Handle other errors (400, 404, 500, etc.)
    if (!response.ok) {
      let errorData = null;
      let errorText = '';
      
      try {
        const text = await response.text();
        if (text) {
          try {
            errorData = JSON.parse(text);
            errorText = JSON.stringify(errorData);
          } catch {
            errorText = text;
            errorData = { message: text };
          }
        }
      } catch (e) {
        errorText = 'Could not read response';
      }

      // ✅ إنشاء error object بالشكل المطلوب
      const error = new Error(errorData?.message || errorText || `HTTP error ${response.status}`);
      
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: errorData,        // هنا هيكون فيه message_ar و message_en
        headers: response.headers,
        url: response.url
      };
      error.status = response.status;
      
      console.log(errorData);
      
      throw error;
    }

    return response;
    
  } catch (error) {
    // لو الـ error أصلاً من النوع اللي احنا عملناه
    if (error.response) {
      throw error;
    }
    
    // لو error تاني (مشكلة في الشبكة)
    const networkError = new Error(error.message || 'Network error');
    networkError.response = {
      status: 0,
      data: { 
        message_ar: 'خطأ في الشبكة. تحقق من اتصالك', 
        message_en: 'Network error. Please check your connection.' 
      }
    };
    networkError.status = 0;
    throw networkError;
  }
};

/**
 * Convenience method for JSON responses
 */
export const fetchJSON = async (url, options = {}, requireAuth = true) => {
  const response = await fetchWithAuth(url, options, requireAuth);
  
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  if (!text || text.trim() === '') {
    return {};
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return { message: text };
  }
};

export const cookieManager = {
  isAuthenticated: () => !!sessionStorage.getItem('userRole'),
  clear: clearAuthData,
};