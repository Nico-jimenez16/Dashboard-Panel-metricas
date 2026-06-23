import { elapsedHours } from '@/lib/formatters';

export function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function elapsedLabel(createdAt: string, solvedAt: string | null): string {
  const hours = elapsedHours(createdAt, solvedAt);
  if (hours < 1) return 'menos de 1 hora';
  if (hours < 24) return `${hours} h transcurridas`;
  const days = Math.floor(hours / 24);
  return `${days} día${days !== 1 ? 's' : ''} transcurrido${days !== 1 ? 's' : ''}`;
}
