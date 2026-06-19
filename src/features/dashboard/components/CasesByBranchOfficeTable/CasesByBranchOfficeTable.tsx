'use client';

import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Input, Table } from '@/components/ui';
import type { AreaStats } from '@/types/domain';

interface CasesByBranchOfficeTableProps {
  data: AreaStats[];
}

const columnHelper = createColumnHelper<AreaStats>();

const columns = [
  columnHelper.accessor('area', {
    header: 'Sucursal',
    cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    meta: { align: 'right' as const },
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('cerrados', {
    header: 'Cerrados',
    meta: { align: 'right' as const },
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('tasaCierre', {
    header: 'Tasa cierre',
    meta: { align: 'right' as const },
    cell: (info) => {
      const v = info.getValue();
      return (
        <Badge variant={v >= 70 ? 'success' : v >= 40 ? 'warning' : 'destructive'}>
          {v}%
        </Badge>
      );
    },
  }),
];

export default function CasesByBranchOfficeTable({ data }: CasesByBranchOfficeTableProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = term
      ? data.filter((r) => r.area.toLowerCase().includes(term))
      : data;
    return [...rows].sort((a, b) => b.total - a.total);
  }, [data, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos por Sucursal</CardTitle>
        <div className="relative mt-2 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar sucursal..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto p-2">
          <Table
            data={filtered}
            columns={columns}
            getRowId={(row) => row.area}
            emptyMessage="No se encontraron sucursales."
          />
        </div>
      </CardContent>
    </Card>
  );
}
