import { create } from 'zustand';
import { api } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  profile_pic?: string;
  location?: string;
  bio?: string;
  is_active: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    full_name: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  
  // Helper methods
  isAuthenticated: () => boolean;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null,
  token: typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/login', { username, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Register endpoint now returns { token, token_type, user }
      const response = await api.post('/register', data);
      const { token, user } = response.data;
      
      // Store token from registration response
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: token, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  clearError: () => set({ error: null }),

  isAuthenticated: () => {
    return get().token !== null && get().user !== null;
  },

  getToken: () => {
    return get().token;
  },
}));
