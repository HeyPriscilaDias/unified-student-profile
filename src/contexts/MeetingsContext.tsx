'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Meeting, AgendaItem } from '@/types/student';

interface NewMeetingData {
  studentId: string;
  title: string;
  scheduledDate: string;
  duration: number;
  agenda: AgendaItem[];
  notes?: string;
}

interface UpdateMeetingData {
  id: string;
  studentId: string;
  title?: string;
  scheduledDate?: string;
  duration?: number;
  agenda?: AgendaItem[];
  notes?: string;
}

interface MeetingsContextType {
  meetings: Map<string, Meeting[]>; // studentId -> meetings
  getMeetingsForStudent: (studentId: string) => Meeting[];
  addMeeting: (data: NewMeetingData) => Meeting;
  updateMeeting: (data: UpdateMeetingData) => Meeting | null;
  updateMeetingNotes: (studentId: string, meetingId: string, notes: string) => void;
  completeMeeting: (studentId: string, meetingId: string, notes?: string) => void;
  initializeMeetings: (studentId: string, meetings: Meeting[]) => void;
}

const MeetingsContext = createContext<MeetingsContextType | null>(null);

export function MeetingsProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Map<string, Meeting[]>>(new Map());
  const [initialized, setInitialized] = useState<Set<string>>(new Set());

  const getMeetingsForStudent = useCallback((studentId: string): Meeting[] => {
    return meetings.get(studentId) || [];
  }, [meetings]);

  const initializeMeetings = useCallback((studentId: string, initialMeetings: Meeting[]) => {
    if (initialized.has(studentId)) return;

    setMeetings(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, initialMeetings);
      return newMap;
    });
    setInitialized(prev => new Set(prev).add(studentId));
  }, [initialized]);

  const addMeeting = useCallback((data: NewMeetingData): Meeting => {
    const newMeeting: Meeting = {
      id: `meeting-new-${Date.now()}`,
      studentId: data.studentId,
      counselorId: 'counselor-1',
      counselorName: 'Ms. Rodriguez',
      title: data.title,
      scheduledDate: data.scheduledDate,
      duration: data.duration,
      status: 'scheduled',
      agenda: data.agenda,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMeetings(prev => {
      const newMap = new Map(prev);
      const studentMeetings = newMap.get(data.studentId) || [];
      newMap.set(data.studentId, [...studentMeetings, newMeeting]);
      return newMap;
    });

    return newMeeting;
  }, []);

  const updateMeeting = useCallback((data: UpdateMeetingData): Meeting | null => {
    let updatedMeeting: Meeting | null = null;

    setMeetings(prev => {
      const newMap = new Map(prev);
      const studentMeetings = newMap.get(data.studentId) || [];
      const meetingIndex = studentMeetings.findIndex(m => m.id === data.id);

      if (meetingIndex === -1) return prev;

      const existingMeeting = studentMeetings[meetingIndex];
      updatedMeeting = {
        ...existingMeeting,
        ...(data.title !== undefined && { title: data.title }),
        ...(data.scheduledDate !== undefined && { scheduledDate: data.scheduledDate }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.agenda !== undefined && { agenda: data.agenda }),
        ...(data.notes !== undefined && { notes: data.notes }),
        updatedAt: new Date().toISOString(),
      };

      const newStudentMeetings = [...studentMeetings];
      newStudentMeetings[meetingIndex] = updatedMeeting;
      newMap.set(data.studentId, newStudentMeetings);

      return newMap;
    });

    return updatedMeeting;
  }, []);

  const updateMeetingNotes = useCallback((studentId: string, meetingId: string, notes: string) => {
    setMeetings(prev => {
      const newMap = new Map(prev);
      const studentMeetings = newMap.get(studentId) || [];
      const meetingIndex = studentMeetings.findIndex(m => m.id === meetingId);

      if (meetingIndex === -1) return prev;

      const existingMeeting = studentMeetings[meetingIndex];
      const updatedMeeting = {
        ...existingMeeting,
        notes,
        updatedAt: new Date().toISOString(),
      };

      const newStudentMeetings = [...studentMeetings];
      newStudentMeetings[meetingIndex] = updatedMeeting;
      newMap.set(studentId, newStudentMeetings);

      return newMap;
    });
  }, []);

  const completeMeeting = useCallback((studentId: string, meetingId: string, notes?: string) => {
    setMeetings(prev => {
      const newMap = new Map(prev);
      const studentMeetings = newMap.get(studentId) || [];
      const meetingIndex = studentMeetings.findIndex(m => m.id === meetingId);

      if (meetingIndex === -1) return prev;

      const existingMeeting = studentMeetings[meetingIndex];
      const updatedMeeting = {
        ...existingMeeting,
        status: 'completed' as const,
        ...(notes !== undefined && { notes }),
        updatedAt: new Date().toISOString(),
      };

      const newStudentMeetings = [...studentMeetings];
      newStudentMeetings[meetingIndex] = updatedMeeting;
      newMap.set(studentId, newStudentMeetings);

      return newMap;
    });
  }, []);

  return (
    <MeetingsContext.Provider value={{ meetings, getMeetingsForStudent, addMeeting, updateMeeting, updateMeetingNotes, completeMeeting, initializeMeetings }}>
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetingsContext() {
  const context = useContext(MeetingsContext);
  if (!context) {
    throw new Error('useMeetingsContext must be used within a MeetingsProvider');
  }
  return context;
}

/**
 * Hook to get meetings for a student, merging context state with initial data
 */
export function useMeetings(studentId: string, initialMeetings: Meeting[]): Meeting[] {
  const { getMeetingsForStudent, initializeMeetings } = useMeetingsContext();

  // Initialize meetings from mock data on first render
  useEffect(() => {
    initializeMeetings(studentId, initialMeetings);
  }, [studentId, initialMeetings, initializeMeetings]);

  return getMeetingsForStudent(studentId);
}
