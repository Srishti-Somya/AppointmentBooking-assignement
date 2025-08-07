import { Response } from 'express';
import { ZodError } from 'zod';

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

export const handleRouteError = (error: any, res: Response) => {
  console.error('Route error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.errors[0].message
      }
    });
  }

  // Known application errors
  if (error.message === 'User with this email already exists') {
    return res.status(409).json({
      error: {
        code: 'USER_EXISTS',
        message: error.message
      }
    });
  }

  if (error.message === 'Invalid credentials') {
    return res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: error.message
      }
    });
  }

  if (error.message === 'Slot not found') {
    return res.status(404).json({
      error: {
        code: 'SLOT_NOT_FOUND',
        message: error.message
      }
    });
  }

  if (error.message === 'Slot already booked') {
    return res.status(409).json({
      error: {
        code: 'SLOT_ALREADY_BOOKED',
        message: error.message
      }
    });
  }

  // Default internal server error
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
};

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    data: message ? { message, ...data } : data
  };
};
