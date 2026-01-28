import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/order.types';
import { orderService } from '../services/orderService';
import { usePolling } from './usePolling';

export function useOrders(status?: OrderStatus) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setError(null);
      const data = await orderService.getOrders(status);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pedidos');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  usePolling(fetchOrders, 5000);

  return { orders, loading, error, refetch: fetchOrders };
}
