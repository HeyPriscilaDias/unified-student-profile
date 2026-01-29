'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Note {
  id: string;
  content: string;
  visibility: 'private' | 'public';
  createdAt: string;
  authorId?: string;
  authorName?: string;
}

interface NotesContextType {
  notes: Map<string, Note[]>; // studentId -> notes
  getNotesForStudent: (studentId: string) => Note[];
  addNote: (studentId: string, content: string, visibility: 'private' | 'public') => Note;
  deleteNote: (studentId: string, noteId: string) => void;
  updateNote: (studentId: string, noteId: string, updates: Partial<Pick<Note, 'content' | 'visibility'>>) => void;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Map<string, Note[]>>(new Map());

  const getNotesForStudent = useCallback((studentId: string): Note[] => {
    return notes.get(studentId) || [];
  }, [notes]);

  const addNote = useCallback((studentId: string, content: string, visibility: 'private' | 'public'): Note => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      visibility,
      createdAt: new Date().toISOString(),
    };

    setNotes(prev => {
      const newMap = new Map(prev);
      const existingNotes = newMap.get(studentId) || [];
      // Add new note at the beginning (most recent first)
      newMap.set(studentId, [newNote, ...existingNotes]);
      return newMap;
    });

    return newNote;
  }, []);

  const deleteNote = useCallback((studentId: string, noteId: string) => {
    setNotes(prev => {
      const newMap = new Map(prev);
      const existingNotes = newMap.get(studentId) || [];
      const filteredNotes = existingNotes.filter(n => n.id !== noteId);
      newMap.set(studentId, filteredNotes);
      return newMap;
    });
  }, []);

  const updateNote = useCallback((studentId: string, noteId: string, updates: Partial<Pick<Note, 'content' | 'visibility'>>) => {
    setNotes(prev => {
      const newMap = new Map(prev);
      const existingNotes = newMap.get(studentId) || [];
      const noteIndex = existingNotes.findIndex(n => n.id === noteId);

      if (noteIndex === -1) return prev;

      const existingNote = existingNotes[noteIndex];
      const updatedNote = {
        ...existingNote,
        ...updates,
      };

      const newNotes = [...existingNotes];
      newNotes[noteIndex] = updatedNote;
      newMap.set(studentId, newNotes);

      return newMap;
    });
  }, []);

  return (
    <NotesContext.Provider value={{
      notes,
      getNotesForStudent,
      addNote,
      deleteNote,
      updateNote,
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotesContext() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
}

/**
 * Hook to get notes for a specific student
 */
export function useNotes(studentId: string): Note[] {
  const { getNotesForStudent } = useNotesContext();
  return getNotesForStudent(studentId);
}
