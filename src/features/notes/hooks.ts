import { useNotesStore } from './store';

export function useNotes(caseId: string) {
  const allNotes = useNotesStore((s) => s.notes);
  const addNote  = useNotesStore((s) => s.addNote);
  const notes    = allNotes.filter((n) => n.caseId === caseId);

  return {
    notes,
    addNote: (texto: string) => addNote(caseId, texto),
  };
}
