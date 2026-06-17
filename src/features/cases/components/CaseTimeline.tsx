'use client';

import { useState } from 'react';
import { CheckCircle2, MessageSquare, PlusCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotes } from '@/features/notes/hooks';
import { formatDateTime, formatRelative } from '@/lib/formatters';
import type { Case } from '@/types/domain';

interface CaseTimelineProps {
  caso: Case;
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'note' | 'closed';
  label: string;
  detail?: string;
  date: string;
}

export default function CaseTimeline({ caso }: CaseTimelineProps) {
  const caseId = String(caso.id);
  const { notes, addNote } = useNotes(caseId);
  const [noteText, setNoteText] = useState('');

  const events: TimelineEvent[] = [
    {
      id: 'created',
      type: 'created' as const,
      label: 'Caso creado',
      detail: caso.requester ?? undefined,
      date: caso.createdAt,
    },
    ...notes.map((n) => ({
      id: n.id,
      type: 'note' as const,
      label: `Nota de ${n.autor}`,
      detail: n.texto,
      date: n.creadoEn,
    })),
    ...(caso.isClosed && caso.solvedAt
      ? [
          {
            id: 'closed',
            type: 'closed' as const,
            label: 'Caso resuelto',
            detail: caso.assignee ?? undefined,
            date: caso.solvedAt,
          },
        ]
      : []),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  function handleAddNote() {
    const text = noteText.trim();
    if (!text) return;
    addNote(text);
    setNoteText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddNote();
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividad</h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-5">
          {events.map((ev) => (
            <div key={ev.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white">
                {ev.type === 'created' && (
                  <Clock className="h-3.5 w-3.5 text-[#2563A6]" />
                )}
                {ev.type === 'note' && (
                  <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
                )}
                {ev.type === 'closed' && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6B8E5A]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 pb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">{ev.label}</span>
                  <span className="text-xs text-gray-400">{formatRelative(ev.date)}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{formatDateTime(ev.date)}</span>
                </div>
                {ev.detail && (
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{ev.detail}</p>
                )}
              </div>
            </div>
          ))}

          {/* Add note */}
          <div className="relative flex gap-4">
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white">
              <PlusCircle className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <div className="flex-1 pt-1">
              <textarea
                className="w-full min-h-[72px] rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] focus:border-transparent placeholder:text-gray-400"
                placeholder="Agregar nota interna… (Ctrl+Enter para guardar)"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                >
                  Agregar nota
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
