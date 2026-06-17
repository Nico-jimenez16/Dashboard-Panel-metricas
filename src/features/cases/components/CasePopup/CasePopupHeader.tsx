import { Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui';
import { formatDateTime, formatRelative, elapsedHours } from '@/lib/formatters';
import { STATUS_VARIANT, STATUS_LABEL, PRIORITY_VARIANT } from '@/features/cases/constants';
import type { Case } from '@/types/domain';

function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function elapsedLabel(createdAt: string, solvedAt: string | null): string {
  const hours = elapsedHours(createdAt, solvedAt);
  if (hours < 1) return 'menos de 1 hora';
  if (hours < 24) return `${hours} h transcurridas`;
  const days = Math.floor(hours / 24);
  return `${days} día${days !== 1 ? 's' : ''} transcurrido${days !== 1 ? 's' : ''}`;
}

interface SummaryItemProps {
  label: string;
  value: React.ReactNode;
  large?: boolean;
}

function SummaryItem({ label, value, large }: SummaryItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      {large ? (
        <span className="text-2xl font-bold text-gray-900 leading-none">{value}</span>
      ) : (
        <span className="text-sm text-gray-700 font-medium truncate">{value ?? '—'}</span>
      )}
    </div>
  );
}

interface CasePopupHeaderProps {
  caso: Case;
}

export default function CasePopupHeader({ caso }: CasePopupHeaderProps) {
  const isOpen = !caso.isClosed;
  const bannerColor = caso.isClosed
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const bannerIcon = caso.isClosed ? 'text-green-500' : 'text-amber-500';

  const hours = elapsedHours(caso.createdAt, caso.solvedAt);
  const timeOpen = hours < 24
    ? `${hours}h`
    : `${Math.floor(hours / 24)}d`;

  return (
    <div className="border-b border-[#ECECE6] bg-white">
      {/* Two-column header */}
      <div className="grid grid-cols-[1fr_auto] gap-0 divide-x divide-[#ECECE6]">
        {/* Left panel */}
        <div className="px-6 py-5 space-y-3">
          {/* ID pill */}
          <span className="inline-block font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            CASO #{caso.caseNumber}
            {caso.typeCode ? ` · ${caso.typeCode}` : ''}
          </span>

          {/* Title */}
          <h2 className="text-[22px] font-semibold text-gray-900 leading-snug">
            {caso.subject ?? '—'}
          </h2>

          {/* Badges + meta */}
          <div className="flex items-center gap-2 flex-wrap">
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

          {/* Requester */}
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Right panel — summary */}
        <div className="w-72 shrink-0 px-5 py-5 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Resumen del caso
          </span>

          {/* 2×3 grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SummaryItem label="Tiempo abierto" value={timeOpen} large />
            <SummaryItem label="Estado actual" value={STATUS_LABEL[caso.status] ?? caso.status} />
            <SummaryItem
              label="Asignado a"
              value={
                caso.assignee ? (
                  <span className="flex items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 rounded-full bg-gray-200 items-center justify-center text-[9px] font-bold text-gray-600 shrink-0">
                      {initials(caso.assignee)}
                    </span>
                    <span className="truncate">{caso.assignee}</span>
                  </span>
                ) : '—'
              }
            />
            <SummaryItem label="Equipo" value={caso.team} />
            <SummaryItem label="Área SLA" value={caso.slaArea} />
            <SummaryItem label="Servicio" value={caso.service} />
          </div>
        </div>
      </div>

      {/* SLA Banner */}
      <div className={`flex items-center gap-2 border-t px-6 py-2.5 text-sm ${bannerColor}`}>
        {isOpen
          ? <AlertCircle className={`h-4 w-4 shrink-0 ${bannerIcon}`} />
          : <Clock className={`h-4 w-4 shrink-0 ${bannerIcon}`} />
        }
        <span>
          <span className="font-medium">SLA:</span>{' '}
          {caso.isClosed
            ? `Caso cerrado — ${elapsedLabel(caso.createdAt, caso.solvedAt)}.`
            : `Caso abierto — ${elapsedLabel(caso.createdAt, null)}.`
          }
        </span>
      </div>
    </div>
  );
}
