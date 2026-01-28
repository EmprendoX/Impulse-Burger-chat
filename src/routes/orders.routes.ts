import { Router, Request, Response } from 'express';
import { validateOrderSecret, validateAdminApiKey } from '../middleware/auth.middleware';
import { validateOrderPayload } from '../middleware/validation.middleware';
import { createOrUpdateOrder, hasEventBeenSent, listRecentOrders } from '../services/order.service';
import { sendOrderConfirmation } from '../services/whatsapp.service';
import { OrderEventType } from '../constants/order.constants';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', validateAdminApiKey, async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50;
    const orders = await listRecentOrders(safeLimit);

    res.json({ ok: true, orders });
  } catch (error: any) {
    logger.error('Error listing orders:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch orders',
    });
  }
});

router.post(
  '/paid',
  validateOrderSecret,
  validateOrderPayload,
  async (req: Request, res: Response) => {
    try {
      const orderData = req.body;

      // Create or update order
      const order = await createOrUpdateOrder(orderData);

      // Check idempotency and send WhatsApp confirmation if needed
      const confirmSent = await hasEventBeenSent(order.id, OrderEventType.CONFIRM_SENT);
      
      if (!confirmSent) {
        // Send WhatsApp confirmation (non-blocking)
        sendOrderConfirmation(order).catch((error) => {
          logger.error('Failed to send order confirmation WhatsApp:', error);
          // Don't fail the request if WhatsApp fails
        });
      }

      // Generate tracking URLs
      const customerTrackingUrl = `${env.BASE_URL}/t/${order.orderNumber}?token=${order.customerToken}`;
      const courierTrackingUrl = `${env.BASE_URL}/c/${order.orderNumber}?token=${order.courierToken}`;

      res.json({
        ok: true,
        customerTrackingUrl,
        courierTrackingUrl,
      });
    } catch (error: any) {
      logger.error('Error creating/updating order:', error);
      res.status(500).json({
        ok: false,
        error: 'Failed to process order',
      });
    }
  }
);

export default router;
