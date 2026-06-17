'use client';

import Header from '@/components/layout/Header';
import SavedViewsTabs from '@/features/cases/components/SavedViewsTabs';
import CaseFilters from '@/features/cases/components/CaseFilters';
import CasesTable from '@/features/cases/components/CasesTable';
import CasesStatsBar from '@/features/cases/components/CasesStatsBar';
import { useCases } from '@/features/cases/hooks/useCases';
import { useCasesFilters } from '@/features/cases/hooks/useCasesFilters';
import { Button } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CasosPage() {
  const { view, setView, filters, setFilters, activeFilters, nextPage, prevPage } = useCasesFilters();
  const { data, isLoading, error } = useCases(activeFilters);

  return (
    <>
      <Header title="Casos" subtitle="Listado de incidentes y solicitudes" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <SavedViewsTabs value={view} onValueChange={setView} />

        <CaseFilters filters={filters} onChange={setFilters} />

        <CasesStatsBar total={data?.total ?? 0} showing={data?.casos.length ?? 0} />

        <CasesTable
          data={data?.casos ?? []}
          isLoading={isLoading}
          error={error?.message ?? null}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {data ? `Página ${data.pagina} de ${data.totalPaginas}` : ''}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data || data.pagina <= 1}
              onClick={prevPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data || data.pagina >= data.totalPaginas}
              onClick={nextPage}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
