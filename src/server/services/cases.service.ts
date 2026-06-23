import { getAllCases, createCaseInGestar } from '@/server/gestar/client';
import { cacheGetOrSet, cacheDelete } from '@/server/cache/memory-cache';
import { CACHE_KEYS } from '@/server/cache/keys';
import { NotFoundError } from '@/server/errors';
import { buildPredicates } from '@/server/services/caseFilters';
import type { Case, CasesFilters, CasesListResponse } from '@/types/domain';

async function getCases(): Promise<Case[]> {
  return cacheGetOrSet(CACHE_KEYS.allCases, getAllCases);
}

export async function listCases(filters: CasesFilters): Promise<CasesListResponse> {
  const all = await getCases();
  const predicates = buildPredicates(filters);
  const filtered = all.filter((c) => predicates.every((p) => p(c)));

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

export async function createCase(payload: unknown): Promise<{ id: number }> {
  const result = await createCaseInGestar(payload);
  cacheDelete(CACHE_KEYS.allCases);
  cacheDelete(CACHE_KEYS.dashboardMetrics);
  return result;
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
