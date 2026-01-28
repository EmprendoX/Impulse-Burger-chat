import { prisma } from '../db/client';
import { updateOrderStatus, markEventAsSent, hasEventBeenSent } from './order.service';
import { sendOnTheWayNotification } from './whatsapp.service';
import { OrderStatus, OrderEventType } from '../constants/order.constants';
import { logger } from '../utils/logger';

/**
 * Save a location ping from courier
 */
export async function saveLocationPing(
  orderId: string,
  lat: number,
  lng: number,
  accuracy: number
) {
  return prisma.locationPing.create({
    data: {
      orderId,
      latitude: lat,
      longitude: lng,
      accuracy,
    },
  });
}

/**
 * Get the latest location ping for an order
 */
export async function getLatestLocation(orderId: string) {
  return prisma.locationPing.findFirst({
    where: { orderId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Check if this is the first location ping and trigger "on the way" notification
 */
export async function checkAndTriggerOnTheWay(orderId: string): Promise<void> {
  // Check if this is the first location ping
  const pingCount = await prisma.locationPing.count({
    where: { orderId },
  });

  // If this is the first ping, trigger "on the way" flow
  if (pingCount === 1) {
    // Check idempotency
    const alreadySent = await hasEventBeenSent(orderId, OrderEventType.ON_THE_WAY_SENT);
    
    if (!alreadySent) {
      try {
        // Update order status
        await updateOrderStatus(orderId, OrderStatus.ON_THE_WAY);
        
        // Mark event as sent first (to prevent race conditions)
        await markEventAsSent(orderId, OrderEventType.ON_THE_WAY_SENT);
        
        // Send WhatsApp notification (non-blocking)
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (order) {
          await sendOnTheWayNotification(order);
        }
      } catch (error) {
        logger.error(`Error triggering on-the-way notification for order ${orderId}:`, error);
        // Don't throw - we don't want to fail the location ping
      }
    }
  }
}
