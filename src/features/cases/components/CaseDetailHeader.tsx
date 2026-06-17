import Link from 'next/link';
import { ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { formatDateTime, formatRelative, elapsedHours } from '@/lib/formatters';
import { STATUS_VARIANT, STATUS_LABEL, PRIORITY_VARIANT } from '@/features/cases/constants';
import type { Case } from '@/types/domain';

interface CaseDetailHeaderProps {
  caso: Case;
}

function elapsedLabel(createdAt: string, solvedAt: string | null): string {
  const hours = elapsedHours(createdAt, solvedAt);
  if (hours < 1) return 'menos de 1 hora';
  if (hours < 24) return `${hours} h transcurridas`;
  const days = Math.floor(hours / 24);
  return `${days} día${days !== 1 ? 's' : ''} transcurrido${days !== 1 ? 's' : ''}`;
}

export default function CaseDetailHeader({ caso }: CaseDetailHeaderProps) {
  const isOpen = !caso.isClosed;
  const bannerColor = caso.isClosed
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const bannerIcon = caso.isClosed
    ? 'text-green-500'
    : 'text-amber-500';

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-5 space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/casos" className="hover:text-gray-700 transition-colors">
          Casos
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {caso.branchOffice && (
          <>
            <span>{caso.branchOffice}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="font-mono text-gray-600">#{caso.caseNumber}</span>
      </nav>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              CASO #{caso.caseNumber}
              {caso.typeCode ? ` · ${caso.typeCode}` : ''}
            </span>
          </div>

          <h1 className="text-[22px] font-semibold text-gray-900 leading-snug mb-2">
            {caso.subject ?? '—'}
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={STATUS_VARIANT[caso.status] ?? 'secondary'}>
              {STATUS_LABEL[caso.status] ?? caso.status}
            </Badge>
            {caso.priorityLevel && (
              <Badge variant={PRIORITY_VARIANT[caso.priorityLevel] ?? 'outline'}>
                {caso.priority ?? caso.priorityLevel}
              </Badge>
            )}
            <span className="text-xs text-gray-400">
              Abierto {formatDateTime(caso.createdAt)} · {formatRelative(caso.createdAt)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <Button variant="outline" size="sm" disabled title="Próximamente">
            Reasignar
          </Button>
          <Button variant="outline" size="sm" disabled title="Próximamente">
            Cambiar estado
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            title="Próximamente"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Escalar
          </Button>
          <Button
            variant="success"
            size="sm"
            disabled
            title="Próximamente"
          >
            Cerrar caso
          </Button>
        </div>
      </div>

      {/* SLA info banner */}
      <div className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${bannerColor}`}>
        {isOpen
          ? <AlertCircle className={`h-4 w-4 shrink-0 ${bannerIcon}`} />
          : <Clock className={`h-4 w-4 shrink-0 ${bannerIcon}`} />
        }
        <span>
          <span className="font-medium">SLA:</span>{' '}
          {caso.isClosed
            ? `Caso cerrado — ${elapsedLabel(caso.createdAt, caso.solvedAt)}.`
            : `Caso abierto — ${elapsedHours(caso.createdAt, null)}. Gestar no expone fecha de vencimiento SLA.`
          }
        </span>
      </div>
    </div>
  );
}
