import type {
  Case,
  CasesFilters,
  CasesListResponse,
  DashboardMetrics,
} from '@/types/domain';

const BASE = '/api';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const apiClient = {
  getCases(filters: CasesFilters = {}): Promise<CasesListResponse> {
    const qs = buildQuery({
      status:    filters.status,
      priority:  filters.priority,
      slaArea:   filters.slaArea,
      busqueda:  filters.busqueda,
      pagina:    filters.pagina,
      porPagina: filters.porPagina,
    });
    return apiFetch<CasesListResponse>(`/casos${qs}`);
  },

  getCase(id: string): Promise<Case> {
    return apiFetch<Case>(`/casos/${id}`);
  },

  getDashboardMetrics(): Promise<DashboardMetrics> {
    return apiFetch<DashboardMetrics>('/metricas/dashboard');
  },
};
