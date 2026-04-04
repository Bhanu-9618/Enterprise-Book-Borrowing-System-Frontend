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

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';


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
    

    else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    }


    else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }


    else if (status === 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;