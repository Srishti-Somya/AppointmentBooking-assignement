import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../validation';
import { handleRouteError, successResponse } from '../lib/errorHandler';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await AuthService.register(
      validatedData.name,
      validatedData.email,
      validatedData.password
    );

    res.status(201).json(successResponse({ user }, 'User registered successfully'));
  } catch (error: any) {
    handleRouteError(error, res);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(
      validatedData.email,
      validatedData.password
    );

    res.status(200).json(successResponse({
      token: result.token,
      role: result.user.role,
      user: result.user
    }, 'Login successful'));
  } catch (error: any) {
    handleRouteError(error, res);
  }
});

export default router; 