export type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'READY' | 'ON_THE_WAY' | 'DELIVERED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  total: string;
  paymentMethod: string;
  address: string;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastLocationAccuracy: number | null;
  lastLocationUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface KitchenStats {
  pending: number;
  preparing: number;
  ready: number;
  onTheWay: number;
  averagePrepTime: number;
}
