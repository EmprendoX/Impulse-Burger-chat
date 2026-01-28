import { formatDistanceToNow, format } from 'date-fns';

export function formatTimeAgo(date: string): string {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  } catch {
    return 'Fecha inválida';
  }
}

export function formatTime(date: string): string {
  try {
    return format(new Date(date), 'HH:mm');
  } catch {
    return '--:--';
  }
}

export function formatCurrency(amount: string): string {
  return `$${parseFloat(amount).toLocaleString('es-MX')}`;
}
