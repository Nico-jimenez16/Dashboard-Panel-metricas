'use client';

import { Card, CardContent } from '@/components/ui/card';
import CaseTimeline from './CaseTimeline';
import CaseProperties from './CaseProperties';
import CaseRequester from './CaseRequester';
import CaseMetricsCard from './CaseMetricsCard';
import CaseRelated from './CaseRelated';
import { useNotes } from '@/features/notes/hooks';
import type { Case } from '@/types/domain';

interface CaseBodyLayoutProps {
  caso: Case;
}

export default function CaseBodyLayout({ caso }: CaseBodyLayoutProps) {
  const { notes } = useNotes(String(caso.id));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      {/* Left column */}
      <div className="space-y-6">
        {/* Description */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Descripción</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {caso.description ?? 'Sin descripción.'}
            </p>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardContent className="p-6">
            <CaseTimeline caso={caso} />
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <CaseMetricsCard caso={caso} noteCount={notes.length} />
        <CaseProperties caso={caso} />
        <CaseRequester caso={caso} />
        <CaseRelated caseId={String(caso.id)} />
      </div>
    </div>
  );
}
