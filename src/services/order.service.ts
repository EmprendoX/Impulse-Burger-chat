import { Prisma } from '@prisma/client';
import { prisma } from '../db/client';
import { generateCustomerToken, generateCourierToken } from './token.service';
import { normalizePhone } from '../utils/phone.util';
import { logger } from '../utils/logger';
import { OrderStatus, OrderEventType, OrderStatusType } from '../constants/order.constants';

export interface CreateOrderData {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
  };
  items: Array<{
    name: string;
    qty: number;
  }>;
  total: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  address: string;
}

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerToken: string;
  courierToken: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  total: string;
  paymentMethod: string;
  address: string;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastLocationAccuracy: number | null;
  lastLocationUpdatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create or update an order based on orderNumber
 */
export async function createOrUpdateOrder(data: CreateOrderData): Promise<OrderWithItems> {
  const normalizedPhone = normalizePhone(data.customer.phone);
  
  // Try to find existing order
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: data.orderNumber },
    include: { items: true },
  });

  if (existingOrder) {
    // Update existing order
    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        customerName: data.customer.name,
        customerPhone: normalizedPhone,
        total: data.total,
        paymentStatus: data.paymentStatus.toUpperCase(),
        paymentMethod: data.paymentMethod,
        address: data.address,
      },
      include: { items: true },
    });

    // Update items (delete old, create new)
    await prisma.orderItem.deleteMany({
      where: { orderId: updatedOrder.id },
    });

    await prisma.orderItem.createMany({
      data: data.items.map(item => ({
        orderId: updatedOrder.id,
        name: item.name,
        quantity: item.qty,
      })),
    });

    return updatedOrder as OrderWithItems;
  } else {
    // Create new order
    const customerToken = generateCustomerToken();
    const courierToken = generateCourierToken();

    const newOrder = await prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        customerName: data.customer.name,
        customerPhone: normalizedPhone,
        customerToken,
        courierToken,
        paymentStatus: data.paymentStatus.toUpperCase(),
        orderStatus: OrderStatus.CONFIRMED,
        total: data.total,
        paymentMethod: data.paymentMethod,
        address: data.address,
        items: {
          create: data.items.map(item => ({
            name: item.name,
            quantity: item.qty,
          })),
        },
      },
      include: { items: true },
    });

    return newOrder as OrderWithItems;
  }
}

/**
 * Find order by order number
 */
export async function findOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/**
 * Find order by customer token
 */
export async function findOrderByCustomerToken(orderNumber: string, token: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order || order.customerToken !== token) {
    return null;
  }

  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/**
 * Find order by courier token
 */
export async function findOrderByCourierToken(orderNumber: string, token: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order || order.courierToken !== token) {
    return null;
  }

  return order;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatusType) {
  return prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: status },
  });
}

/**
 * Update order's last known location
 */
export async function updateLastLocation(
  orderId: string,
  lat: number,
  lng: number,
  accuracy: number
) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      lastLatitude: lat,
      lastLongitude: lng,
      lastLocationAccuracy: accuracy,
      lastLocationUpdatedAt: new Date(),
    },
  });
}

/**
 * Check if an event has already been sent (idempotency)
 */
export async function hasEventBeenSent(orderId: string, eventType: string): Promise<boolean> {
  const event = await prisma.orderEvent.findUnique({
    where: {
      orderId_eventType: {
        orderId,
        eventType,
      },
    },
  });

  return event !== null;
}

/**
 * Mark an event as sent (idempotency)
 */
export async function markEventAsSent(orderId: string, eventType: string): Promise<void> {
  try {
    await prisma.orderEvent.create({
      data: {
        orderId,
        eventType,
      },
    });
  } catch (error) {
    // If unique constraint violation, event was already marked
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.warn(`Event ${eventType} already marked for order ${orderId}`);
      return;
    }
    throw error;
  }
}
