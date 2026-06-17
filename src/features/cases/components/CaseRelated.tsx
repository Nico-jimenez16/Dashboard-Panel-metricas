'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink } from 'lucide-react';
import { useRelatedCases } from '@/features/cases/hooks/useRelatedCases';
import { STATUS_VARIANT, STATUS_LABEL } from '@/features/cases/constants';
import { formatDate } from '@/lib/formatters';

interface CaseRelatedProps {
  caseId: string;
}

export default function CaseRelated({ caseId }: CaseRelatedProps) {
  const { data: related, isLoading } = useRelatedCases(caseId);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Casos relacionados
        </h3>

        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && (!related || related.length === 0) && (
          <p className="text-xs text-gray-400 text-center py-3">
            No hay casos relacionados.
          </p>
        )}

        {!isLoading && related && related.length > 0 && (
          <div className="space-y-2">
            {related.map((c) => (
              <Link
                key={c.id}
                href={`/casos/${c.id}`}
                className="flex items-start gap-2 rounded-lg p-2.5 hover:bg-gray-50 transition-colors group"
              >
                <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#0F4C3A] mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-mono text-xs text-gray-500">
                      #{c.caseNumber}
                    </span>
                    <Badge variant={STATUS_VARIANT[c.status] ?? 'secondary'} className="text-[10px] px-1.5 py-0">
                      {STATUS_LABEL[c.status] ?? c.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-700 truncate">{c.subject ?? '—'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(c.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
