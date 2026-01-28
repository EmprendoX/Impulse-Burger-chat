import { Badge } from '../ui/Badge';
import type { OrderStatus } from '../../types/order.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge status={status} />;
}
