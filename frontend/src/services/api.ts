import axios from 'axios';
import { AuthResponse, Slot, Booking, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post<ApiResponse>('/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/login', {
      email,
      password,
    });
    return response.data;
  },
};

export const slotsAPI = {
  getSlots: async (from: string, to: string) => {
    const response = await api.get<ApiResponse<{ slots: Slot[] }>>('/slots', {
      params: { from, to },
    });
    return response.data;
  },
};

export const bookingsAPI = {
  bookSlot: async (slotId: string) => {
    const response = await api.post<ApiResponse<{ booking: Booking }>>('/book', {
      slotId,
    });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get<ApiResponse<{ bookings: Booking[] }>>('/book/my-bookings');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get<ApiResponse<{ bookings: Booking[] }>>('/book/all-bookings');
    return response.data;
  },
};

export default api; 