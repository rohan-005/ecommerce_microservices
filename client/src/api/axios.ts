import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { getAccessToken } from '../utils/token';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach in-memory Access Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally with toasts
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; success?: boolean } | undefined;
    const errorMessage = data?.message || error.message || 'An unexpected error occurred';

    if (status === 401) {
      toast.error(errorMessage || 'Session expired. Please log in again.');
      // Optionally we could trigger window.dispatchEvent(new Event('auth-logout'))
      // or similar to clean up state if needed.
    } else if (status === 404) {
      toast.error(errorMessage || 'Requested resource not found (404).');
    } else if (status === 500) {
      toast.error(errorMessage || 'Internal server error (500). Please try again later.');
    } else {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
