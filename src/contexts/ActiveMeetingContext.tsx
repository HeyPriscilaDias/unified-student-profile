'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type ActiveMeetingPhase = 'recording' | 'processing' | 'results';

export interface ActiveMeetingState {
  studentId: string;
  studentName: string;
  studentAvatarUrl?: string;
  interactionId: string;
  interactionTitle: string;
  phase: ActiveMeetingPhase;
  startTime: number; // timestamp when recording started
  talkingPoints?: string;
  isPaused: boolean;
  pausedAt?: number; // timestamp when paused
  totalPausedDuration: number; // accumulated paused time in ms
}

interface ActiveMeetingContextType {
  activeMeeting: ActiveMeetingState | null;
  startMeeting: (
    studentId: string,
    studentName: string,
    studentAvatarUrl: string | undefined,
    interactionId: string,
    interactionTitle: string,
    talkingPoints?: string
  ) => void;
  setPhase: (phase: ActiveMeetingPhase) => void;
  updateTalkingPoints: (talkingPoints: string) => void;
  togglePause: () => void;
  endMeeting: () => void;
}

const STORAGE_KEY = 'willow-active-meeting';

const ActiveMeetingContext = createContext<ActiveMeetingContextType | null>(null);

export function ActiveMeetingProvider({ children }: { children: ReactNode }) {
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeetingState | null>(() => {
    // Initialize from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Don't restore 'processing' phase - it shouldn't survive page reloads
          if (parsed.phase === 'processing') {
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }
          return parsed;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Persist to localStorage whenever activeMeeting changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeMeeting) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeMeeting));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [activeMeeting]);

  const startMeeting = useCallback((
    studentId: string,
    studentName: string,
    studentAvatarUrl: string | undefined,
    interactionId: string,
    interactionTitle: string,
    talkingPoints?: string
  ) => {
    setActiveMeeting({
      studentId,
      studentName,
      studentAvatarUrl,
      interactionId,
      interactionTitle,
      phase: 'recording',
      startTime: Date.now(),
      talkingPoints,
      isPaused: false,
      totalPausedDuration: 0,
    });
  }, []);

  const setPhase = useCallback((phase: ActiveMeetingPhase) => {
    setActiveMeeting(prev => {
      if (!prev) return null;
      return { ...prev, phase };
    });
  }, []);

  const updateTalkingPoints = useCallback((talkingPoints: string) => {
    setActiveMeeting(prev => {
      if (!prev) return null;
      return { ...prev, talkingPoints };
    });
  }, []);

  const togglePause = useCallback(() => {
    setActiveMeeting(prev => {
      if (!prev) return null;
      if (prev.isPaused) {
        // Resuming: add the paused duration to total
        const pausedDuration = prev.pausedAt ? Date.now() - prev.pausedAt : 0;
        return {
          ...prev,
          isPaused: false,
          pausedAt: undefined,
          totalPausedDuration: prev.totalPausedDuration + pausedDuration,
        };
      } else {
        // Pausing: record when we paused
        return {
          ...prev,
          isPaused: true,
          pausedAt: Date.now(),
        };
      }
    });
  }, []);

  const endMeeting = useCallback(() => {
    setActiveMeeting(null);
  }, []);

  return (
    <ActiveMeetingContext.Provider value={{
      activeMeeting,
      startMeeting,
      setPhase,
      updateTalkingPoints,
      togglePause,
      endMeeting,
    }}>
      {children}
    </ActiveMeetingContext.Provider>
  );
}

export function useActiveMeetingContext() {
  const context = useContext(ActiveMeetingContext);
  if (!context) {
    throw new Error('useActiveMeetingContext must be used within an ActiveMeetingProvider');
  }
  return context;
}
