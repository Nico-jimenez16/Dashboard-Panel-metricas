import { create } from 'zustand';

interface Note {
  id: string;
  caseId: string;
  texto: string;
  autor: string;
  creadoEn: string;
}

interface NotesStore {
  notes: Note[];
  addNote: (caseId: string, texto: string) => void;
  getNotesByCaseId: (caseId: string) => Note[];
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],

  addNote(caseId, texto) {
    const note: Note = {
      id: Date.now().toString(),
      caseId,
      texto,
      autor: 'Usuario actual',
      creadoEn: new Date().toISOString(),
    };
    set((state) => ({ notes: [...state.notes, note] }));
  },

  getNotesByCaseId(caseId) {
    return get().notes.filter((n) => n.caseId === caseId);
  },
}));
