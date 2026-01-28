export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

export const OrderStatus = {
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  ON_THE_WAY: 'ON_THE_WAY',
  DELIVERED: 'DELIVERED',
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderEventType = {
  CONFIRM_SENT: 'CONFIRM_SENT',
  ON_THE_WAY_SENT: 'ON_THE_WAY_SENT',
} as const;

export type OrderEventTypeType = typeof OrderEventType[keyof typeof OrderEventType];
