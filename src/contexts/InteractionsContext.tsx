'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Interaction, InteractionRecommendedAction } from '@/types/student';

interface NewInteractionData {
  studentId: string;
  title: string;
  interactionDate: string; // YYYY-MM-DD format
  summary?: string;
}

interface UpdateInteractionData {
  id: string;
  studentId: string;
  title?: string;
  interactionDate?: string;
  summary?: string;
}

interface RecordingData {
  summary: string;
  transcript: string;
  actionItems: InteractionRecommendedAction[];
}

interface InteractionsContextType {
  interactions: Map<string, Interaction[]>; // studentId -> interactions
  getInteractionsForStudent: (studentId: string) => Interaction[];
  addInteraction: (data: NewInteractionData) => Interaction;
  updateInteraction: (data: UpdateInteractionData) => Interaction | null;
  updateInteractionTalkingPoints: (studentId: string, interactionId: string, talkingPoints: string) => void;
  updateInteractionSummary: (studentId: string, interactionId: string, summary: string) => void;
  updateInteractionWithRecording: (studentId: string, interactionId: string, data: RecordingData) => void;
  updateInteractionActionItems: (studentId: string, interactionId: string, actionItems: InteractionRecommendedAction[]) => void;
  markInteractionComplete: (studentId: string, interactionId: string) => void;
  deleteInteraction: (studentId: string, interactionId: string) => void;
  initializeInteractions: (studentId: string, interactions: Interaction[]) => void;
}

const InteractionsContext = createContext<InteractionsContextType | null>(null);

export function InteractionsProvider({ children }: { children: ReactNode }) {
  const [interactions, setInteractions] = useState<Map<string, Interaction[]>>(new Map());
  const [initialized, setInitialized] = useState<Set<string>>(new Set());

  const getInteractionsForStudent = useCallback((studentId: string): Interaction[] => {
    return interactions.get(studentId) || [];
  }, [interactions]);

  const initializeInteractions = useCallback((studentId: string, initialInteractions: Interaction[]) => {
    if (initialized.has(studentId)) return;

    setInteractions(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, initialInteractions);
      return newMap;
    });
    setInitialized(prev => new Set(prev).add(studentId));
  }, [initialized]);

  const addInteraction = useCallback((data: NewInteractionData): Interaction => {
    const newInteraction: Interaction = {
      id: `interaction-new-${Date.now()}`,
      studentId: data.studentId,
      counselorId: 'counselor-1',
      counselorName: 'Ms. Rodriguez',
      title: data.title,
      interactionDate: data.interactionDate,
      status: 'planned',
      summary: data.summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(data.studentId) || [];
      newMap.set(data.studentId, [...studentInteractions, newInteraction]);
      return newMap;
    });

    return newInteraction;
  }, []);

  const updateInteraction = useCallback((data: UpdateInteractionData): Interaction | null => {
    let updatedInteraction: Interaction | null = null;

    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(data.studentId) || [];
      const interactionIndex = studentInteractions.findIndex(m => m.id === data.id);

      if (interactionIndex === -1) return prev;

      const existingInteraction = studentInteractions[interactionIndex];
      updatedInteraction = {
        ...existingInteraction,
        ...(data.title !== undefined && { title: data.title }),
        ...(data.interactionDate !== undefined && { interactionDate: data.interactionDate }),
        ...(data.summary !== undefined && { summary: data.summary }),
        updatedAt: new Date().toISOString(),
      };

      const newStudentInteractions = [...studentInteractions];
      newStudentInteractions[interactionIndex] = updatedInteraction;
      newMap.set(data.studentId, newStudentInteractions);

      return newMap;
    });

    return updatedInteraction;
  }, []);

  const updateInteractionTalkingPoints = useCallback((studentId: string, interactionId: string, talkingPoints: string) => {
    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(studentId) || [];
      const interactionIndex = studentInteractions.findIndex(m => m.id === interactionId);

      if (interactionIndex === -1) return prev;

      const existingInteraction = studentInteractions[interactionIndex];
      const updatedInteraction = {
        ...existingInteraction,
        talkingPoints,
        updatedAt: new Date().toISOString(),
      };

      const newStudentInteractions = [...studentInteractions];
      newStudentInteractions[interactionIndex] = updatedInteraction;
      newMap.set(studentId, newStudentInteractions);

      return newMap;
    });
  }, []);

  const updateInteractionSummary = useCallback((studentId: string, interactionId: string, summary: string) => {
    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(studentId) || [];
      const interactionIndex = studentInteractions.findIndex(m => m.id === interactionId);

      if (interactionIndex === -1) return prev;

      const existingInteraction = studentInteractions[interactionIndex];
      const updatedInteraction = {
        ...existingInteraction,
        summary,
        updatedAt: new Date().toISOString(),
      };

      const newStudentInteractions = [...studentInteractions];
      newStudentInteractions[interactionIndex] = updatedInteraction;
      newMap.set(studentId, newStudentInteractions);

      return newMap;
    });
  }, []);

  const updateInteractionWithRecording = useCallback((studentId: string, interactionId: string, data: RecordingData) => {
    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(studentId) || [];
      const interactionIndex = studentInteractions.findIndex(m => m.id === interactionId);

      if (interactionIndex === -1) return prev;

      const existingInteraction = studentInteractions[interactionIndex];
      const updatedInteraction: Interaction = {
        ...existingInteraction,
        summary: data.summary,
        transcript: data.transcript,
        aiSummary: {
          overview: data.summary,
          keyPoints: [],
          recommendedActions: data.actionItems,
          generatedAt: new Date().toISOString(),
        },
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };

      const newStudentInteractions = [...studentInteractions];
      newStudentInteractions[interactionIndex] = updatedInteraction;
      newMap.set(studentId, newStudentInteractions);

      return newMap;
    });
  }, []);

  const updateInteractionActionItems = useCallback((studentId: string, interactionId: string, actionItems: InteractionRecommendedAction[]) => {
    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(studentId) || [];
      const interactionIndex = studentInteractions.findIndex(m => m.id === interactionId);

      if (interactionIndex === -1) return prev;

      const existingInteraction = studentInteractions[interactionIndex];
      const updatedInteraction: Interaction = {
        ...existingInteraction,
        aiSummary: {
          ...existingInteraction.aiSummary,
          overview: existingInteraction.aiSummary?.overview || existingInteraction.summary || '',
          keyPoints: existingInteraction.aiSummary?.keyPoints || [],
          recommendedActions: actionItems,
          generatedAt: existingInteraction.aiSummary?.generatedAt || new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      const newStudentInteractions = [...studentInteractions];
      newStudentInteractions[interactionIndex] = updatedInteraction;
      newMap.set(studentId, newStudentInteractions);

      return newMap;
    });
  }, []);

  const markInteractionComplete = useCallback((studentId: string, interactionId: string) => {
    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(studentId) || [];
      const interactionIndex = studentInteractions.findIndex(m => m.id === interactionId);

      if (interactionIndex === -1) return prev;

      const existingInteraction = studentInteractions[interactionIndex];
      const updatedInteraction = {
        ...existingInteraction,
        status: 'completed' as const,
        updatedAt: new Date().toISOString(),
      };

      const newStudentInteractions = [...studentInteractions];
      newStudentInteractions[interactionIndex] = updatedInteraction;
      newMap.set(studentId, newStudentInteractions);

      return newMap;
    });
  }, []);

  const deleteInteraction = useCallback((studentId: string, interactionId: string) => {
    setInteractions(prev => {
      const newMap = new Map(prev);
      const studentInteractions = newMap.get(studentId) || [];
      const filteredInteractions = studentInteractions.filter(m => m.id !== interactionId);
      newMap.set(studentId, filteredInteractions);
      return newMap;
    });
  }, []);

  return (
    <InteractionsContext.Provider value={{
      interactions,
      getInteractionsForStudent,
      addInteraction,
      updateInteraction,
      updateInteractionTalkingPoints,
      updateInteractionSummary,
      updateInteractionWithRecording,
      updateInteractionActionItems,
      markInteractionComplete,
      deleteInteraction,
      initializeInteractions
    }}>
      {children}
    </InteractionsContext.Provider>
  );
}

export function useInteractionsContext() {
  const context = useContext(InteractionsContext);
  if (!context) {
    throw new Error('useInteractionsContext must be used within an InteractionsProvider');
  }
  return context;
}

/**
 * Hook to get interactions for a student, merging context state with initial data
 */
export function useInteractions(studentId: string, initialInteractions: Interaction[]): Interaction[] {
  const { getInteractionsForStudent, initializeInteractions } = useInteractionsContext();

  // Initialize interactions from mock data on first render
  useEffect(() => {
    initializeInteractions(studentId, initialInteractions);
  }, [studentId, initialInteractions, initializeInteractions]);

  return getInteractionsForStudent(studentId);
}
