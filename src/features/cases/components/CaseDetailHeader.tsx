import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/formatters';
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

interface CaseDetailHeaderProps {
  caso: Case;
}

export default function CaseDetailHeader({ caso }: CaseDetailHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-5">
      <div className="mb-3">
        <Link href="/casos">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ChevronLeft className="h-4 w-4" />
            Volver a casos
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-gray-400">{String(caso.caseNumber)}</span>
            <Badge variant={STATUS_VARIANT[caso.status] ?? 'secondary'}>
              {STATUS_LABEL[caso.status] ?? caso.status}
            </Badge>
            {caso.priorityLevel && (
              <Badge variant={PRIORITY_VARIANT[caso.priorityLevel] ?? 'outline'}>
                {caso.priority ?? caso.priorityLevel}
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{caso.subject ?? '—'}</h1>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-400">Área SLA</p>
          <p className="font-medium text-gray-900">{caso.slaArea ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Asignado a</p>
          <p className="font-medium text-gray-900">{caso.assignee ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Creado</p>
          <p className="font-medium text-gray-900">{formatDateTime(caso.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Resolución</p>
          <p className="font-medium text-gray-900">
            {caso.solvedAt ? formatDateTime(caso.solvedAt) : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
