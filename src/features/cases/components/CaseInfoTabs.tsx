'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardContent, Button } from '@/components/ui';
import { formatDateTime, formatRelative } from '@/lib/formatters';
import { useNotes } from '@/features/notes/hooks';
import type { Case } from '@/types/domain';

interface CaseInfoTabsProps {
  caso: Case;
}

export default function CaseInfoTabs({ caso }: CaseInfoTabsProps) {
  const [activeTab, setActiveTab] = useState('detalles');
  const [noteText, setNoteText]   = useState('');
  const { notes, addNote }        = useNotes(String(caso.id));

  function handleAddNote() {
    const text = noteText.trim();
    if (!text) return;
    addNote(text);
    setNoteText('');
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="detalles">Detalles</TabsTrigger>
        <TabsTrigger value="notas">
          Notas {notes.length > 0 && `(${notes.length})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="detalles">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Descripción</h3>
              <p className="text-gray-700">{caso.description ?? '—'}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-400">Tipo</p>
                <p className="mt-1 font-medium">{caso.typeCode ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Servicio</p>
                <p className="mt-1 font-medium">{caso.service ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Equipo responsable</p>
                <p className="mt-1 font-medium">{caso.team ?? '—'}</p>
              </div>
              {caso.solvedAt && (
                <div>
                  <p className="text-xs text-gray-400">Cerrado</p>
                  <p className="mt-1 font-medium">{formatDateTime(caso.solvedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notas">
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Add note */}
            <div className="flex gap-3">
              <textarea
                className="flex-1 min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]"
                placeholder="Agregar una nota..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                Agregar
              </Button>
            </div>

            {/* Notes list */}
            {notes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No hay notas para este caso.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{note.autor}</span>
                      <span className="text-xs text-gray-400">{formatRelative(note.creadoEn)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
