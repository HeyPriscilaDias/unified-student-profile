'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { SmartGoal } from '@/types/student';

interface SmartGoalsContextType {
  goals: Map<string, SmartGoal[]>; // studentId -> goals
  getGoalsForStudent: (studentId: string) => SmartGoal[];
  updateGoal: (studentId: string, goalId: string, updates: Partial<SmartGoal>) => void;
  archiveGoal: (studentId: string, goalId: string) => void;
  toggleGoal: (studentId: string, goalId: string) => void;
  initializeGoals: (studentId: string, initialGoals: SmartGoal[]) => void;
}

const SmartGoalsContext = createContext<SmartGoalsContextType | null>(null);

// Store archive callbacks from TasksContext
let archiveTasksCallback: ((studentId: string, goalId: string) => void) | null = null;

export function setArchiveTasksForGoalCallback(callback: (studentId: string, goalId: string) => void) {
  archiveTasksCallback = callback;
}

export function SmartGoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Map<string, SmartGoal[]>>(() => new Map());
  const [initialized, setInitialized] = useState<Set<string>>(() => new Set());

  const getGoalsForStudent = useCallback((studentId: string): SmartGoal[] => {
    return goals.get(studentId) || [];
  }, [goals]);

  const initializeGoals = useCallback((studentId: string, initialGoals: SmartGoal[]) => {
    if (initialized.has(studentId)) return;

    setGoals(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, initialGoals);
      return newMap;
    });
    setInitialized(prev => new Set(prev).add(studentId));
  }, [initialized]);

  const updateGoal = useCallback((studentId: string, goalId: string, updates: Partial<SmartGoal>) => {
    setGoals(prev => {
      const newMap = new Map(prev);
      const existingGoals = newMap.get(studentId) || [];
      const goalIndex = existingGoals.findIndex(g => g.id === goalId);

      if (goalIndex === -1) return prev;

      const existingGoal = existingGoals[goalIndex];
      const updatedGoal = {
        ...existingGoal,
        ...updates,
      };

      const newGoals = [...existingGoals];
      newGoals[goalIndex] = updatedGoal;
      newMap.set(studentId, newGoals);

      return newMap;
    });
  }, []);

  const archiveGoal = useCallback((studentId: string, goalId: string) => {
    // Update the goal status to archived
    updateGoal(studentId, goalId, { status: 'archived' });

    // Archive all linked tasks (callback from TasksContext)
    if (archiveTasksCallback) {
      archiveTasksCallback(studentId, goalId);
    }
  }, [updateGoal]);

  const toggleGoal = useCallback((studentId: string, goalId: string) => {
    setGoals(prev => {
      const newMap = new Map(prev);
      const existingGoals = newMap.get(studentId) || [];
      const goalIndex = existingGoals.findIndex(g => g.id === goalId);

      if (goalIndex === -1) return prev;

      const existingGoal = existingGoals[goalIndex];
      const newStatus = existingGoal.status === 'completed' ? 'active' : 'completed';

      const updatedGoal = {
        ...existingGoal,
        status: newStatus as SmartGoal['status'],
      };

      const newGoals = [...existingGoals];
      newGoals[goalIndex] = updatedGoal;
      newMap.set(studentId, newGoals);

      return newMap;
    });
  }, []);

  return (
    <SmartGoalsContext.Provider value={{
      goals,
      getGoalsForStudent,
      updateGoal,
      archiveGoal,
      toggleGoal,
      initializeGoals,
    }}>
      {children}
    </SmartGoalsContext.Provider>
  );
}

export function useSmartGoalsContext() {
  const context = useContext(SmartGoalsContext);
  if (!context) {
    throw new Error('useSmartGoalsContext must be used within a SmartGoalsProvider');
  }
  return context;
}

/**
 * Hook to get goals for a student, merging context state with initial data
 */
export function useSmartGoals(studentId: string, initialGoals: SmartGoal[]): SmartGoal[] {
  const { getGoalsForStudent, initializeGoals } = useSmartGoalsContext();

  // Initialize goals from mock data on first render
  useEffect(() => {
    initializeGoals(studentId, initialGoals);
  }, [studentId, initialGoals, initializeGoals]);

  return getGoalsForStudent(studentId);
}
