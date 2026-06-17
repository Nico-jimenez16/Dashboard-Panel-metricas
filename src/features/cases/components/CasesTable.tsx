'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/formatters';
import type { Case } from '@/types/domain';

const STATUS_VARIANT: Record<string, 'info' | 'warning' | 'success' | 'secondary'> = {
  Atendido:              'info',
  Cerrado:               'success',
  Derivado:              'secondary',
  'Derivado a proveedor': 'secondary',
  'Devuelto al usuario': 'warning',
  Suspendido:            'secondary',
};

const STATUS_LABEL: Record<string, string> = {
  Atendido:              'Atendido',
  Cerrado:               'Cerrado',
  Derivado:              'Derivado',
  'Derivado a proveedor': 'Derivado a Proveedor',
  'Devuelto al usuario': 'Devuelto al Usuario',
  Suspendido:            'Suspendido',
};

const PRIORITY_VARIANT: Record<string, 'destructive' | 'warning' | 'secondary' | 'outline'> = {
  '1': 'destructive',
  '2': 'warning',
  '3': 'secondary',
  '4': 'outline',
};

const col = createColumnHelper<Case>();

const columns = [
  col.accessor('caseNumber', {
    header: 'Número',
    cell: (info) => (
      <Link
        href={`/casos/${info.row.original.id}`}
        className="flex items-center gap-1 font-mono text-xs font-medium text-[#0F4C3A] hover:underline"
      >
        {String(info.getValue())}
        <ExternalLink className="h-3 w-3 opacity-60" />
      </Link>
    ),
  }),
  col.accessor('subject', {
    header: 'Título',
    cell: (info) => (
      <span className="line-clamp-1 max-w-xs text-gray-900">{info.getValue() ?? '—'}</span>
    ),
  }),
  col.accessor('status', {
    header: 'Estado',
    cell: (info) => {
      const s = info.getValue();
      return (
        <Badge variant={STATUS_VARIANT[s] ?? 'secondary'}>
          {STATUS_LABEL[s] ?? s}
        </Badge>
      );
    },
  }),
  col.accessor('priorityLevel', {
    header: 'Prioridad',
    cell: (info) => {
      const level = info.getValue();
      const label = info.row.original.priority;
      return (
        <Badge variant={PRIORITY_VARIANT[level ?? ''] ?? 'outline'}>
          {label ?? level ?? '—'}
        </Badge>
      );
    },
  }),
  col.accessor('slaArea', {
    header: 'Área SLA',
    cell: (info) => <span className="text-gray-600 text-xs">{info.getValue() ?? '—'}</span>,
  }),
  col.accessor('assignee', {
    header: 'Asignado a',
    cell: (info) => <span className="text-gray-600 text-sm">{info.getValue() ?? '—'}</span>,
  }),
  col.accessor('createdAt', {
    header: 'Creado',
    cell: (info) => (
      <span className="text-gray-500 text-xs">{formatDate(info.getValue())}</span>
    ),
  }),
];

interface CasesTableProps {
  data: Case[];
}

export default function CasesTable({ data }: CasesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-100 bg-gray-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap select-none"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  <span className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <>
                        {header.column.getIsSorted() === 'asc'  && <ArrowUp   className="h-3 w-3" />}
                        {header.column.getIsSorted() === 'desc' && <ArrowDown  className="h-3 w-3" />}
                        {!header.column.getIsSorted()           && <ArrowUpDown className="h-3 w-3 opacity-40" />}
                      </>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-50">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="flex items-center justify-center py-16 text-gray-400">
          No se encontraron casos con los filtros aplicados.
        </div>
      )}
    </div>
  );
}
