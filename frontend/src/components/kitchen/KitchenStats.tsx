import { useEffect, useState } from 'react';
import type { KitchenStats as KitchenStatsType } from '../../types/order.types';
import { orderService } from '../../services/orderService';
import { Card } from '../ui/Card';
import { Package, ChefHat, CheckCircle, Truck } from 'lucide-react';

export function KitchenStats() {
  const [stats, setStats] = useState<KitchenStatsType>({
    pending: 0,
    preparing: 0,
    ready: 0,
    onTheWay: 0,
    averagePrepTime: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await orderService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Pendientes', value: stats.pending, icon: Package, color: 'text-blue-600' },
    { label: 'En Preparación', value: stats.preparing, icon: ChefHat, color: 'text-yellow-600' },
    { label: 'Listos', value: stats.ready, icon: CheckCircle, color: 'text-green-600' },
    { label: 'En Camino', value: stats.onTheWay, icon: Truck, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
