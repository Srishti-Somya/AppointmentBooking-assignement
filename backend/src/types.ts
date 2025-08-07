import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BookRequest {
  slotId: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

export interface SlotResponse {
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

export interface BookingResponse {
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