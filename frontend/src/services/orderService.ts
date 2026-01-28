import api from './api';
import { Order, OrderStatus, KitchenStats } from '../types/order.types';

export const orderService = {
  async getOrders(status?: OrderStatus): Promise<Order[]> {
    const params = status ? { status } : {};
    const response = await api.get('/kitchen/orders', { params });
    return response.data.orders || [];
  },

  async updateOrderStatus(orderNumber: string, status: OrderStatus): Promise<Order> {
    const response = await api.patch(`/kitchen/orders/${orderNumber}/status`, { status });
    return response.data.order;
  },

  async getStats(): Promise<KitchenStats> {
    const response = await api.get('/kitchen/stats');
    return response.data;
  },
};
