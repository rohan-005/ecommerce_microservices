import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { getAccessToken, getRefreshToken, setTokens, clearAuth } from "../utils/token";

const API_BASE_URL = "http://localhost:5001/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
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
  },
);

// Response Interceptor: Handle errors globally with toasts and refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    
    // Skip interceptor for refresh token endpoint itself to avoid loops
    if (originalRequest.url === '/auth/refresh-token') {
      return Promise.reject(error);
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        // Call refresh token endpoint directly with axios to avoid interceptors
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        
        setTokens(newAccessToken, newRefreshToken);
        
        // Update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        clearAuth();
        // Trigger a reload or redirect
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const data = error.response?.data as
      | { message?: string; success?: boolean }
      | undefined;
    const errorMessage =
      data?.message || error.message || "An unexpected error occurred";

    if (status === 401) {
      toast.error(errorMessage || "Session expired. Please log in again.");
    } else if (status === 404) {
      toast.error(errorMessage || "Requested resource not found (404).");
    } else if (status === 500) {
      toast.error(
        errorMessage || "Internal server error (500). Please try again later.",
      );
    } else {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  },
);

export default api;
