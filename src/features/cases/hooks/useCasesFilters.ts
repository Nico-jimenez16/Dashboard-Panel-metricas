'use client';

import { useState } from 'react';
import type { CasesFilters } from '@/types/domain';

export function useCasesFilters() {
  const [view, setViewState] = useState('todos');
  const [filters, setFiltersState] = useState<CasesFilters>({ pagina: 1, porPagina: 20 });

  const activeFilters: CasesFilters = {
    ...filters,
    status: view !== 'todos' ? view : undefined,
  };

  function setView(v: string) {
    setViewState(v);
    setFiltersState((f) => ({ ...f, pagina: 1 }));
  }

  function setFilters(f: CasesFilters) {
    setFiltersState(f);
  }

  function nextPage() {
    setFiltersState((f) => ({ ...f, pagina: (f.pagina ?? 1) + 1 }));
  }

  function prevPage() {
    setFiltersState((f) => ({ ...f, pagina: (f.pagina ?? 1) - 1 }));
  }

  return { view, setView, filters, setFilters, activeFilters, nextPage, prevPage };
}
