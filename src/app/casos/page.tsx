'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import SavedViewsTabs from '@/features/cases/components/SavedViewsTabs';
import CaseFilters from '@/features/cases/components/CaseFilters';
import CasesTable from '@/features/cases/components/CasesTable';
import CasesStatsBar from '@/features/cases/components/CasesStatsBar';
import { useCases } from '@/features/cases/hooks/useCases';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { CasesFilters, CaseStatus } from '@/types/domain';

export default function CasosPage() {
  const [view, setView]       = useState('todos');
  const [filters, setFilters] = useState<CasesFilters>({ pagina: 1, porPagina: 20 });

  const activeFilters: CasesFilters = {
    ...filters,
    estado: view !== 'todos' ? (view as CaseStatus) : undefined,
  };

  const { data, isLoading, error } = useCases(activeFilters);

  function handleViewChange(v: string) {
    setView(v);
    setFilters((f) => ({ ...f, pagina: 1 }));
  }

  return (
    <>
      <Header title="Casos" subtitle="Listado de incidentes y solicitudes" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <SavedViewsTabs value={view} onValueChange={handleViewChange} />

        <CaseFilters
          filters={filters}
          onChange={(f) => setFilters({ ...f, pagina: 1 })}
        />

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F4C3A]" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 text-sm">
            Error al cargar los casos.
          </div>
        )}

        {data && (
          <>
            <CasesStatsBar total={data.total} showing={data.casos.length} />
            <CasesTable data={data.casos} />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Página {data.pagina} de {data.totalPaginas}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.pagina <= 1}
                  onClick={() => setFilters((f) => ({ ...f, pagina: (f.pagina ?? 1) - 1 }))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.pagina >= data.totalPaginas}
                  onClick={() => setFilters((f) => ({ ...f, pagina: (f.pagina ?? 1) + 1 }))}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
