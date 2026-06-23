import type {
  Case,
  CasesFilters,
  CasesListResponse,
  DashboardMetrics,
} from '@/types/domain';
import type { CreateCasePayload } from '@/components/ui/forms/CreateCaseForm/CreateCaseForm.schema';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error(b.error ?? `Error ${res.status}`);
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

  async login(loginName: string, password: string): Promise<{ token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginName, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Error ${res.status}`);
    }
    return res.json() as Promise<{ token: string }>;
  },

  createCase(payload: CreateCasePayload): Promise<{ id: number }> {
    return apiPost<{ id: number }>('/casos', payload);
  },
};
