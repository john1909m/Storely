// api/apiInterceptor.js
import { useErrorHandler } from '../hooks/useErrorHandler';

export const setupApiInterceptor = (api, errorHandler) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      errorHandler.handleError(error);
      return Promise.reject(error);
    }
  );
};