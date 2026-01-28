import { prisma } from '../db/client';
import { OrderStatus } from '../constants/order.constants';
import { logger } from '../utils/logger';

export interface KitchenStats {
  pending: number;
  preparing: number;
  ready: number;
  onTheWay: number;
  averagePrepTime: number;
}

/**
 * Get all orders with optional status filter
 */
export async function getKitchenOrders(status?: OrderStatus) {
  const where = status ? { orderStatus: status } : {};
  
  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100, // Limit to 100 most recent
  });

  return orders;
}

/**
 * Update order status
 */
export async function updateKitchenOrderStatus(
  orderNumber: string,
  newStatus: OrderStatus
) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Validate status transition
  const validTransitions: Record<string, OrderStatus[]> = {
    CONFIRMED: ['PREPARING'],
    PREPARING: ['READY'],
    READY: ['ON_THE_WAY'], // This happens when courier shares location
    ON_THE_WAY: ['DELIVERED'],
  };

  const allowedStatuses = validTransitions[order.orderStatus] || [];
  if (!allowedStatuses.includes(newStatus) && order.orderStatus !== newStatus) {
    throw new Error(
      `Invalid status transition from ${order.orderStatus} to ${newStatus}`
    );
  }

  const updated = await prisma.order.update({
    where: { orderNumber },
    data: { orderStatus: newStatus },
    include: {
      items: true,
    },
  });

  logger.info(`Order ${orderNumber} status updated to ${newStatus}`);
  return updated;
}

/**
 * Get kitchen statistics
 */
export async function getKitchenStats(): Promise<KitchenStats> {
  const [pending, preparing, ready, onTheWay] = await Promise.all([
    prisma.order.count({ where: { orderStatus: 'CONFIRMED' } }),
    prisma.order.count({ where: { orderStatus: 'PREPARING' } }),
    prisma.order.count({ where: { orderStatus: 'READY' } }),
    prisma.order.count({ where: { orderStatus: 'ON_THE_WAY' } }),
  ]);

  // Calculate average prep time (simplified - time from CONFIRMED to READY)
  const readyOrders = await prisma.order.findMany({
    where: { orderStatus: 'READY' },
    select: { createdAt: true, updatedAt: true },
  });

  let averagePrepTime = 0;
  if (readyOrders.length > 0) {
    const totalTime = readyOrders.reduce((sum, order) => {
      const prepTime = order.updatedAt.getTime() - order.createdAt.getTime();
      return sum + prepTime;
    }, 0);
    averagePrepTime = Math.round(totalTime / readyOrders.length / 1000 / 60); // Convert to minutes
  }

  return {
    pending,
    preparing,
    ready,
    onTheWay,
    averagePrepTime,
  };
}
