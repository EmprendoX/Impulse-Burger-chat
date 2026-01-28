import { Order, OrderStatus } from '../../types/order.types';
import { OrderCard } from './OrderCard';
import { Loading } from '../ui/Loading';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onStatusChange: (orderNumber: string, newStatus: OrderStatus) => void;
  statusChangeLoading?: string | null;
}

export function OrderList({
  orders,
  loading,
  onStatusChange,
  statusChangeLoading,
}: OrderListProps) {
  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No hay pedidos en este estado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
          loading={statusChangeLoading === order.orderNumber}
        />
      ))}
    </div>
  );
}
