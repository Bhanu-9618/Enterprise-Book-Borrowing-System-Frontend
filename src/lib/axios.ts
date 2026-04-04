import axios from 'axios';
import { useAuthStore } from '@/src/store/useAuthStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // If the backend sends a "code" that isn't 200/201 in a 200 HTTP response
    // we can handle it here or in the services. 
    // In this project, services check for response.data.code === 200.
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    // 1. Handle Session Expiration
    if (status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth/')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/auth/signin';
        }
      }
    } 
    
    // 2. Handle Forbidden
    else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    // 3. Handle Server Errors (500+)
    else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    // 4. Handle Specific Bad Requests (unless it's a 404 which might be "not found")
    else if (status === 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;