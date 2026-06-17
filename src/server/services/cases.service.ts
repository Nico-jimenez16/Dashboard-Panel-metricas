import { getAllCases } from '@/server/gestar/client';
import { cacheGetOrSet } from '@/server/cache/memory-cache';
import { NotFoundError } from '@/server/errors';
import type { Case, CasesFilters, CasesListResponse } from '@/types/domain';

async function getCases(): Promise<Case[]> {
  return cacheGetOrSet('all_cases', getAllCases);
}

export async function listCases(filters: CasesFilters): Promise<CasesListResponse> {
  const all = await getCases();

  let filtered = all;

  if (filters.status) {
    const s = filters.status.toLowerCase();
    filtered = filtered.filter((c) => c.status.toLowerCase() === s);
  }
  if (filters.priority) {
    const p = filters.priority.toLowerCase();
    filtered = filtered.filter((c) => c.priority?.toLowerCase() === p);
  }
  if (filters.slaArea) {
    filtered = filtered.filter((c) =>
      c.slaArea?.toLowerCase().includes(filters.slaArea!.toLowerCase()),
    );
  }
  if (filters.busqueda) {
    const q = filters.busqueda.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.subject?.toLowerCase().includes(q) ||
        String(c.caseNumber).includes(q) ||
        c.description?.toLowerCase().includes(q),
    );
  }

  const pagina = filters.pagina ?? 1;
  const porPagina = filters.porPagina ?? 20;
  const total = filtered.length;
  const totalPaginas = Math.ceil(total / porPagina);
  const start = (pagina - 1) * porPagina;
  const casos = filtered.slice(start, start + porPagina);

  return { casos, total, pagina, porPagina, totalPaginas };
}

export async function getCaseById(id: string): Promise<Case> {
  const all = await getCases();
  const caso = all.find((c) => String(c.id) === id);
  if (!caso) throw new NotFoundError('Caso', id);
  return caso;
}

export async function getRelatedCases(id: string, limit = 5): Promise<Case[]> {
  const all = await getCases();
  const caso = all.find((c) => String(c.id) === id);
  if (!caso) return [];
  return all
    .filter(
      (c) =>
        String(c.id) !== id &&
        c.slaArea === caso.slaArea &&
        c.branchOffice === caso.branchOffice,
    )
    .slice(0, limit);
}
