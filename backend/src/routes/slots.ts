import { Router, Request, Response } from 'express';
import { SlotService } from '../services/slotService';
import { slotsQuerySchema } from '../validation';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const validatedData = slotsQuerySchema.parse(req.query);
    const slots = await SlotService.getAvailableSlots(
      validatedData.from,
      validatedData.to
    );

    res.status(200).json({
      data: {
        slots
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

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

export default router; 