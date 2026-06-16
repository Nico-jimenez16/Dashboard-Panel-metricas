import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(iso: string): string {
  return format(new Date(iso), 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: es });
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });
}

export function formatMonth(iso: string): string {
  return format(new Date(iso), 'MMM yyyy', { locale: es });
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-AR').format(n);
}

export function formatPercent(n: number): string {
  return `${n}%`;
}
