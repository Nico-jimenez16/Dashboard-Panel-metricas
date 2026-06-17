'use client';

import { Card, CardContent, Badge } from '@/components/ui';
import { formatDateTime } from '@/lib/formatters';
import { STATUS_VARIANT, STATUS_LABEL, PRIORITY_VARIANT } from '@/features/cases/constants';
import type { Case } from '@/types/domain';

interface CasePropertiesProps {
  caso: Case;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">{children}</span>
    </div>
  );
}

export default function CaseProperties({ caso }: CasePropertiesProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Propiedades
        </h3>

        <Row label="Estado">
          <Badge variant={STATUS_VARIANT[caso.status] ?? 'secondary'}>
            {STATUS_LABEL[caso.status] ?? caso.status}
          </Badge>
        </Row>

        {caso.priorityLevel && (
          <Row label="Prioridad">
            <Badge variant={PRIORITY_VARIANT[caso.priorityLevel] ?? 'outline'}>
              {caso.priority ?? caso.priorityLevel}
            </Badge>
          </Row>
        )}

        <Row label="Asignado a">
          {caso.assignee ?? '—'}
        </Row>

        <Row label="Equipo">
          {caso.team ?? '—'}
        </Row>

        <Row label="Tipo">
          {caso.typeCode ?? '—'}
        </Row>

        <Row label="Servicio">
          {caso.service ?? '—'}
        </Row>

        <Row label="Área SLA">
          {caso.slaArea ?? '—'}
        </Row>

        <Row label="Sucursal">
          {caso.branchOffice ?? '—'}
        </Row>

        <Row label="Apertura">
          {formatDateTime(caso.createdAt)}
        </Row>

        <Row label="Resolución">
          {caso.solvedAt ? formatDateTime(caso.solvedAt) : '—'}
        </Row>
      </CardContent>
    </Card>
  );
}
