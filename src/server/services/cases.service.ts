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

  if (filters.estado) {
    filtered = filtered.filter((c) => c.estado === filters.estado);
  }
  if (filters.prioridad) {
    filtered = filtered.filter((c) => c.prioridad === filters.prioridad);
  }
  if (filters.tipo) {
    filtered = filtered.filter((c) => c.tipo === filters.tipo);
  }
  if (filters.area) {
    filtered = filtered.filter((c) =>
      c.area.toLowerCase().includes(filters.area!.toLowerCase()),
    );
  }
  if (filters.busqueda) {
    const q = filters.busqueda.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.titulo.toLowerCase().includes(q) ||
        c.numero.toLowerCase().includes(q) ||
        c.descripcion.toLowerCase().includes(q),
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
  const caso = all.find((c) => c.id === id);
  if (!caso) throw new NotFoundError('Caso', id);
  return caso;
}
