import { Router, Request, Response } from 'express';
import { validateCustomerToken } from '../middleware/auth.middleware';
import { findOrderByCustomerToken } from '../services/order.service';
import { getLatestLocation } from '../services/location.service';
import { logger } from '../utils/logger';

const router = Router();

router.get('/:orderNumber', validateCustomerToken, async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const token = req.query.token as string;

    // Find order by customer token
    const order = await findOrderByCustomerToken(orderNumber, token);

    if (!order) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid order number or token',
      });
    }

    // Get latest location
    const location = await getLatestLocation(order.id);

    if (!location) {
      return res.json({
        ok: false,
        message: 'No location data available yet',
      });
    }

    res.json({
      ok: true,
      location: {
        lat: location.latitude,
        lng: location.longitude,
        accuracy: location.accuracy,
        updatedAt: location.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching tracking data:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch tracking data',
    });
  }
});

export default router;
