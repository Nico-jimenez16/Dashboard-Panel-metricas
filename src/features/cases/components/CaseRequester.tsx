'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import type { Case } from '@/types/domain';

interface CaseRequesterProps {
  caso: Case;
}

function initials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function CaseRequester({ caso }: CaseRequesterProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Solicitante
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-[#0F4C3A] flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-white">
              {initials(caso.requester)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {caso.requester ?? '—'}
            </p>
            <p className="text-xs text-gray-400">Usuario</p>
          </div>
        </div>

        {caso.requesterEmail && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <a
              href={`mailto:${caso.requesterEmail}`}
              className="truncate hover:text-[#0F4C3A] hover:underline"
            >
              {caso.requesterEmail}
            </a>
          </div>
        )}

        {caso.requesterPhone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>{caso.requesterPhone}</span>
          </div>
        )}

        {!caso.requesterEmail && !caso.requesterPhone && (
          <p className="text-xs text-gray-400">Sin datos de contacto</p>
        )}
      </CardContent>
    </Card>
  );
}
