import { useState } from 'react';
import { OrderStatus } from '../types/order.types';
import { useOrders } from '../hooks/useOrders';
import { orderService } from '../services/orderService';
import { KitchenStats } from '../components/kitchen/KitchenStats';
import { OrderList } from '../components/kitchen/OrderList';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';

export function KitchenDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);
  
  const { orders, loading, refetch } = useOrders(selectedStatus);

  const handleStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    try {
      setStatusChangeLoading(orderNumber);
      await orderService.updateOrderStatus(orderNumber, newStatus);
      await refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    } finally {
      setStatusChangeLoading(null);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusFilters: { label: string; status: OrderStatus | undefined }[] = [
    { label: 'Todos', status: undefined },
    { label: 'Confirmados', status: 'CONFIRMED' },
    { label: 'En Preparación', status: 'PREPARING' },
    { label: 'Listos', status: 'READY' },
    { label: 'En Camino', status: 'ON_THE_WAY' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Cocina - IMPULSE</h1>
          <p className="text-gray-600">Gestiona los pedidos en tiempo real</p>
        </div>

        {/* Stats */}
        <KitchenStats />

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Button
                key={filter.label}
                variant={selectedStatus === filter.status ? 'primary' : 'secondary'}
                onClick={() => setSelectedStatus(filter.status)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Orders List */}
        <OrderList
          orders={filteredOrders}
          loading={loading}
          onStatusChange={handleStatusChange}
          statusChangeLoading={statusChangeLoading}
        />
      </div>
    </div>
  );
}
