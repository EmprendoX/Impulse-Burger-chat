import type { OrderStatus } from '../../types/order.types';

interface BadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: 'En Preparación', color: 'bg-yellow-100 text-yellow-800' },
  READY: { label: 'Listo', color: 'bg-green-100 text-green-800' },
  ON_THE_WAY: { label: 'En Camino', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Entregado', color: 'bg-gray-100 text-gray-800' },
};

export function Badge({ status, className = '' }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}
