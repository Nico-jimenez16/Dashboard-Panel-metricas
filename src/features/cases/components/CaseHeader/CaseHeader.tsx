import Link from 'next/link';
import { ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui';
import { formatDateTime, formatRelative } from '@/lib/formatters';
import { STATUS_VARIANT, STATUS_LABEL, PRIORITY_VARIANT } from '@/features/cases/constants';
import type { Case } from '@/types/domain';
import { initials, elapsedLabel } from './helpers';

interface CaseHeaderProps {
  caso: Case;
  variant: 'page' | 'popup';
}

export default function CaseHeader({ caso, variant }: CaseHeaderProps) {
  const isOpen = !caso.isClosed;
  const bannerColor = caso.isClosed
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const bannerIcon = caso.isClosed ? 'text-green-500' : 'text-amber-500';
  const slaText = caso.isClosed
    ? `Caso cerrado — ${elapsedLabel(caso.createdAt, caso.solvedAt)}.`
    : `Caso abierto — ${elapsedLabel(caso.createdAt, null)}. Gestar no expone fecha de vencimiento SLA.`;

  const idPillLabel = (
    <>
      CASO #{caso.caseNumber}
      {caso.typeCode ? ` · ${caso.typeCode}` : ''}
    </>
  );

  const badges = (
    <>
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
    </>
  );

  const requester = (
    <>
      <div className="h-7 w-7 rounded-full bg-[#0F4C3A] flex items-center justify-center shrink-0">
        <span className="text-[11px] font-semibold text-white leading-none">
          {initials(caso.requester)}
        </span>
      </div>
      <span className="text-sm text-gray-700 font-medium">{caso.requester ?? '—'}</span>
      {caso.requesterEmail && (
        <>
          <span className="text-gray-300">·</span>
          <a
            href={`mailto:${caso.requesterEmail}`}
            className="text-xs text-gray-400 hover:text-[#0F4C3A] hover:underline truncate"
          >
            {caso.requesterEmail}
          </a>
        </>
      )}
    </>
  );

  const slaBanner = (bannerClassName: string) => (
    <div className={`flex items-center gap-2 text-sm ${bannerColor} ${bannerClassName}`}>
      {isOpen
        ? <AlertCircle className={`h-4 w-4 shrink-0 ${bannerIcon}`} />
        : <Clock className={`h-4 w-4 shrink-0 ${bannerIcon}`} />
      }
      <span>
        <span className="font-medium">SLA:</span> {slaText}
      </span>
    </div>
  );

  if (variant === 'page') {
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {idPillLabel}
            </span>
          </div>

          <h1 className="text-[22px] font-semibold text-gray-900 leading-snug mb-2">
            {caso.subject ?? '—'}
          </h1>

          <div className="flex items-center gap-3 flex-wrap">{badges}</div>

          {/* Requester */}
          <div className="flex items-center gap-2 mt-2">{requester}</div>
        </div>

        {/* SLA info banner */}
        {slaBanner('rounded-lg border px-4 py-2.5')}
      </div>
    );
  }

  return (
    <div className="border-b border-[#ECECE6] bg-white">
      <div className="px-6 py-5 space-y-3">
        {/* ID pill */}
        <span className="inline-block font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {idPillLabel}
        </span>

        {/* Title */}
        <h2 className="text-[22px] font-semibold text-gray-900 leading-snug">
          {caso.subject ?? '—'}
        </h2>

        {/* Badges + meta */}
        <div className="flex items-center gap-2 flex-wrap">{badges}</div>

        {/* Requester */}
        <div className="flex items-center gap-2">{requester}</div>
      </div>

      {/* SLA Banner */}
      {slaBanner('border-t px-6 py-2.5')}
    </div>
  );
}
