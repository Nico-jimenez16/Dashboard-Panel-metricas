'use client';

import { Card, CardContent } from '@/components/ui';
import { STATUS_LABEL } from '@/features/cases/constants';
import { elapsedHours } from '@/lib/formatters';
import type { Case } from '@/types/domain';

interface CaseMetricsCardProps {
  caso: Case;
  noteCount: number;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}

function elapsedLabel(createdAt: string, solvedAt: string | null): string {
  const hours = elapsedHours(createdAt, solvedAt);
  if (hours < 1) return '< 1 h';
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return rem > 0 ? `${days} d ${rem} h` : `${days} d`;
}

export default function CaseMetricsCard({ caso, noteCount }: CaseMetricsCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Resumen
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Metric
            label="Tiempo abierto"
            value={elapsedLabel(caso.createdAt, caso.solvedAt)}
          />
          <Metric
            label="Notas agregadas"
            value={noteCount}
          />
          <Metric
            label="Estado actual"
            value={STATUS_LABEL[caso.status] ?? caso.status}
          />
          <Metric
            label="Área SLA"
            value={caso.slaArea ?? '—'}
          />
        </div>
      </CardContent>
    </Card>
  );
}
