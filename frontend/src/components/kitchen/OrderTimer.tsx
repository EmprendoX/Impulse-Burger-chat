import { useEffect, useState } from 'react';
import { formatTimeAgo } from '../../utils/format';
import { Clock } from 'lucide-react';

interface OrderTimerProps {
  createdAt: string;
}

export function OrderTimer({ createdAt }: OrderTimerProps) {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">{timeAgo}</span>
    </div>
  );
}
