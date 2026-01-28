import { Router, Request, Response } from 'express';
import { validateCourierToken } from '../middleware/auth.middleware';
import { validateLocationPayload } from '../middleware/validation.middleware';
import { findOrderByCourierToken, updateLastLocation } from '../services/order.service';
import { saveLocationPing, checkAndTriggerOnTheWay } from '../services/location.service';
import { logger } from '../utils/logger';

const router = Router();

router.post(
  '/location',
  validateCourierToken,
  validateLocationPayload,
  async (req: Request, res: Response) => {
    try {
      const { orderNumber, token, lat, lng, accuracy } = req.body;

      // Find order by courier token
      const order = await findOrderByCourierToken(orderNumber, token);

      if (!order) {
        return res.status(401).json({
          ok: false,
          error: 'Invalid order number or token',
        });
      }

      // Save location ping
      await saveLocationPing(order.id, lat, lng, accuracy);

      // Update order's last location
      await updateLastLocation(order.id, lat, lng, accuracy);

      // Check if first ping and trigger "on the way" notification
      await checkAndTriggerOnTheWay(order.id);

      res.json({
        ok: true,
      });
    } catch (error: any) {
      logger.error('Error saving courier location:', error);
      res.status(500).json({
        ok: false,
        error: 'Failed to save location',
      });
    }
  }
);

export default router;
