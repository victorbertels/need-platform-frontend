import axios from 'axios';
import Router from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, clear auth and redirect (only on client-side)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Use Next.js router instead of window.location for SSR safety
        Router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
