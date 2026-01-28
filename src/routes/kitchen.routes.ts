import { Router, Request, Response } from 'express';
import {
  getKitchenOrders,
  updateKitchenOrderStatus,
  getKitchenStats,
} from '../services/kitchen.service';
import { OrderStatus } from '../constants/order.constants';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/kitchen/orders
 * Get all orders with optional status filter
 */
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as OrderStatus | undefined;
    const orders = await getKitchenOrders(status);

    res.json({
      ok: true,
      orders,
    });
  } catch (error: any) {
    logger.error('Error fetching kitchen orders:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch orders',
    });
  }
});

/**
 * PATCH /api/kitchen/orders/:orderNumber/status
 * Update order status
 */
router.patch('/orders/:orderNumber/status', async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid status',
      });
    }

    const order = await updateKitchenOrderStatus(orderNumber, status);

    res.json({
      ok: true,
      order,
    });
  } catch (error: any) {
    logger.error('Error updating order status:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        ok: false,
        error: 'Order not found',
      });
    }

    if (error.message.includes('Invalid status transition')) {
      return res.status(400).json({
        ok: false,
        error: error.message,
      });
    }

    res.status(500).json({
      ok: false,
      error: 'Failed to update order status',
    });
  }
});

/**
 * GET /api/kitchen/stats
 * Get kitchen statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getKitchenStats();
    res.json({
      ok: true,
      ...stats,
    });
  } catch (error: any) {
    logger.error('Error fetching kitchen stats:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch stats',
    });
  }
});

export default router;
