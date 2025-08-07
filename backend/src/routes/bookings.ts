import { Router, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { bookSchema } from '../validation';
import { authenticateToken, requireRole } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Book a slot (requires authentication)
router.post('/', authenticateToken, requireRole('PATIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = bookSchema.parse(req.body);
    const booking = await BookingService.createBooking(
      req.user!.id,
      validatedData.slotId
    );

    res.status(201).json({
      data: {
        message: 'Booking created successfully',
        booking
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

    if (error.message === 'Slot not found') {
      return res.status(404).json({
        error: {
          code: 'SLOT_NOT_FOUND',
          message: error.message
        }
      });
    }

    if (error.message === 'Slot is already booked') {
      return res.status(409).json({
        error: {
          code: 'SLOT_TAKEN',
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

// Get user's bookings (requires authentication)
router.get('/my-bookings', authenticateToken, requireRole('PATIENT'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await BookingService.getUserBookings(req.user!.id);

    res.status(200).json({
      data: {
        bookings
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

// Get all bookings (requires admin authentication)
router.get('/all-bookings', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await BookingService.getAllBookings();

    res.status(200).json({
      data: {
        bookings
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

export default router; 