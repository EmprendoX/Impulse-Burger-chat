import { Order, OrderStatus } from '../../types/order.types';
import { Card } from '../ui/Card';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimer } from './OrderTimer';
import { Button } from '../ui/Button';
import { formatCurrency, formatTime } from '../../utils/format';
import { Phone, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderNumber: string, newStatus: OrderStatus) => void;
  loading?: boolean;
}

export function OrderCard({ order, onStatusChange, loading = false }: OrderCardProps) {
  const getActionButton = () => {
    switch (order.orderStatus) {
      case 'CONFIRMED':
        return (
          <Button
            variant="primary"
            onClick={() => onStatusChange(order.orderNumber, 'PREPARING')}
            disabled={loading}
            className="w-full"
          >
            Iniciar Preparación
          </Button>
        );
      case 'PREPARING':
        return (
          <Button
            variant="success"
            onClick={() => onStatusChange(order.orderNumber, 'READY')}
            disabled={loading}
            className="w-full"
          >
            Marcar como Listo
          </Button>
        );
      case 'READY':
        return (
          <div className="text-center text-sm text-gray-600">
            Esperando repartidor...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pedido {order.orderNumber}</h3>
            <OrderTimer createdAt={order.createdAt} />
          </div>
          <OrderStatusBadge status={order.orderStatus} />
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{order.customerName}</span>
            <a
              href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{order.address}</span>
          </div>
        </div>

        {/* Items */}
        <div className="border-t pt-3">
          <h4 className="font-semibold mb-2">Items:</h4>
          <ul className="space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t pt-3">
          <span className="font-bold text-lg">Total:</span>
          <span className="font-bold text-lg text-primary-600">
            {formatCurrency(order.total)}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {getActionButton()}
        </div>
      </div>
    </Card>
  );
}
