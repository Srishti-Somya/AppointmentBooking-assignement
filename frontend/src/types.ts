export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'ADMIN';
}

export interface Slot {
  id: string;
  startAt: string;
  endAt: string;
  isBooked: boolean;
  bookedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Booking {
  id: string;
  slot: {
    id: string;
    startAt: string;
    endAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  role: 'PATIENT' | 'ADMIN';
  user: User;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
} 