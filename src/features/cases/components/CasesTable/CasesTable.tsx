'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { Table, Badge } from '@/components/ui';
import { formatDate } from '@/lib/formatters';
import { STATUS_VARIANT, STATUS_LABEL, PRIORITY_VARIANT } from '@/features/cases/constants';
import type { Case } from '@/types/domain';
import type { CasesTableProps } from './CasesTable.types';

const col = createColumnHelper<Case>();

const caseColumns = [
  col.accessor('caseNumber', {
    header: 'Número',
    cell: (info) => (
      <div className="flex items-center gap-1">
        <Link
          href={`/casos/${info.row.original.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-xs font-medium text-gray-700 hover:underline"
          title="Abrir página completa"
        >
          {String(info.getValue())}
        </Link>
        <Link
          href={`/casos/${info.row.original.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[#0F4C3A] hover:text-[#0F4C3A]/70"
          title="Abrir página completa"
        >
          <ExternalLink className="h-3 w-3 opacity-60" />
        </Link>
      </div>
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

export default function CasesTable({ data, isLoading, error, onRowClick }: CasesTableProps) {
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <Table
      data={data}
      columns={caseColumns}
      getRowId={(c) => String(c.id)}
      emptyMessage="No se encontraron casos."
      loading={isLoading}
      onRowClick={onRowClick}
    />
  );
}
