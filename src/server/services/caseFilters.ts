import type { Case, CasesFilters } from '@/types/domain';

export function byStatus(filters: CasesFilters): (c: Case) => boolean {
  if (!filters.status) return () => true;
  const s = filters.status.toLowerCase();
  return (c) => c.status.toLowerCase() === s;
}

export function byPriority(filters: CasesFilters): (c: Case) => boolean {
  if (!filters.priority) return () => true;
  return (c) => c.priorityLevel === filters.priority;
}

export function bySlaArea(filters: CasesFilters): (c: Case) => boolean {
  if (!filters.slaArea) return () => true;
  const a = filters.slaArea.toLowerCase();
  return (c) => c.slaArea?.toLowerCase().includes(a) ?? false;
}

export function bySearch(filters: CasesFilters): (c: Case) => boolean {
  if (!filters.busqueda) return () => true;
  const q = filters.busqueda.toLowerCase();
  return (c) =>
    (c.subject?.toLowerCase().includes(q) ?? false) ||
    String(c.caseNumber).includes(q) ||
    (c.description?.toLowerCase().includes(q) ?? false);
}

export function buildPredicates(filters: CasesFilters): Array<(c: Case) => boolean> {
  return [byStatus(filters), byPriority(filters), bySlaArea(filters), bySearch(filters)];
}
