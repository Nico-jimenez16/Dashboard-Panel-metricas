'use client';

import { Input, Button } from '@/components/ui';
import { Search, X } from 'lucide-react';
import type { CasesFilters } from '@/types/domain';

interface CaseFiltersProps {
  filters: CasesFilters;
  onChange: (filters: CasesFilters) => void;
}

const PRIORIDADES = [
  { value: '',  label: 'Prioridad' },
  { value: '1', label: 'Crítica' },
  { value: '2', label: 'Alta' },
  { value: '3', label: 'Media' },
  { value: '4', label: 'Baja' },
];

export default function CaseFilters({ filters, onChange }: CaseFiltersProps) {
  const hasFilters = filters.busqueda || filters.priority || filters.slaArea;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar casos..."
          className="pl-8"
          value={filters.busqueda ?? ''}
          onChange={(e) => onChange({ ...filters, busqueda: e.target.value || undefined, pagina: 1 })}
        />
      </div>

      <select
        className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]"
        value={filters.priority ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: e.target.value || undefined,
            pagina: 1,
          })
        }
      >
        {PRIORIDADES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ pagina: 1, porPagina: filters.porPagina })}
        >
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
