import { Router, Request, Response } from 'express';
import { SlotService } from '../services/slotService';
import { slotsQuerySchema } from '../validation';
import { handleRouteError, successResponse } from '../lib/errorHandler';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const validatedData = slotsQuerySchema.parse(req.query);
    const slots = await SlotService.getAvailableSlots(
      validatedData.from,
      validatedData.to
    );

    res.status(200).json(successResponse({ slots }));
  } catch (error: any) {
    handleRouteError(error, res);
  }
});

export default router; 