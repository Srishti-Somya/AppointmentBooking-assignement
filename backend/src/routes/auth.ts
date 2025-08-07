import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../validation';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await AuthService.register(
      validatedData.name,
      validatedData.email,
      validatedData.password
    );

    res.status(201).json({
      data: {
        message: 'User registered successfully',
        user
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors[0].message
        }
      });
    }

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        error: {
          code: 'USER_EXISTS',
          message: error.message
        }
      });
    }

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(
      validatedData.email,
      validatedData.password
    );

    res.status(200).json({
      data: {
        message: 'Login successful',
        token: result.token,
        role: result.user.role,
        user: result.user
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors[0].message
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

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

export default router; 