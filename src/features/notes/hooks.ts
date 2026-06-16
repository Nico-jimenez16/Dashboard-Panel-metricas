import { useNotesStore } from './store';

export function useNotes(caseId: string) {
  const notes     = useNotesStore((s) => s.getNotesByCaseId(caseId));
  const addNote   = useNotesStore((s) => s.addNote);

  return {
    notes,
    addNote: (texto: string) => addNote(caseId, texto),
  };
}
