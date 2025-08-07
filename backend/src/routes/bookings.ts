import { Router, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { bookSchema } from '../validation';
import { authenticateToken, requireRole } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { handleRouteError, successResponse } from '../lib/errorHandler';

const router = Router();

// Book a slot (requires authentication)
router.post('/', authenticateToken, requireRole('PATIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = bookSchema.parse(req.body);
    const booking = await BookingService.createBooking(
      req.user!.id,
      validatedData.slotId
    );

    res.status(201).json(successResponse({ booking }, 'Booking created successfully'));
  } catch (error: any) {
    handleRouteError(error, res);
  }
});

// Get user's bookings (requires authentication)
router.get('/my-bookings', authenticateToken, requireRole('PATIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await BookingService.getUserBookings(req.user!.id);
    res.status(200).json(successResponse({ bookings }));
  } catch (error: any) {
    handleRouteError(error, res);
  }
});

// Get all bookings (requires admin authentication)
router.get('/all-bookings', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await BookingService.getAllBookings();
    res.status(200).json(successResponse({ bookings }));
  } catch (error: any) {
    handleRouteError(error, res);
  }
});

export default router; 