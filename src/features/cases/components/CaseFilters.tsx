'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { CasesFilters } from '@/types/domain';

interface CaseFiltersProps {
  filters: CasesFilters;
  onChange: (filters: CasesFilters) => void;
}

const PRIORIDADES = [
  { value: '', label: 'Prioridad' },
  { value: 'critica', label: 'Crítica' },
  { value: 'alta',    label: 'Alta' },
  { value: 'media',   label: 'Media' },
  { value: 'baja',    label: 'Baja' },
];

const TIPOS = [
  { value: '', label: 'Tipo' },
  { value: 'incidente', label: 'Incidente' },
  { value: 'solicitud', label: 'Solicitud' },
  { value: 'problema',  label: 'Problema' },
  { value: 'cambio',    label: 'Cambio' },
];

export default function CaseFilters({ filters, onChange }: CaseFiltersProps) {
  const hasFilters = filters.busqueda || filters.prioridad || filters.tipo || filters.area;

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
        value={filters.prioridad ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            prioridad: (e.target.value as CasesFilters['prioridad']) || undefined,
            pagina: 1,
          })
        }
      >
        {PRIORIDADES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <select
        className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]"
        value={filters.tipo ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            tipo: (e.target.value as CasesFilters['tipo']) || undefined,
            pagina: 1,
          })
        }
      >
        {TIPOS.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
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
