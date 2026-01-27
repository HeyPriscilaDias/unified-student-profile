'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StudentContextInfo {
  id: string;
  firstName: string;
  lastName: string;
}

interface AlmaChatContextType {
  // UI State
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;

  // Context State
  currentStudent: StudentContextInfo | null;
  setCurrentStudent: (student: StudentContextInfo | null) => void;

  // Thread Management
  threads: Map<string, ChatMessage[]>;
  getActiveThread: () => ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearThread: (threadId?: string) => void;

  // Active thread ID helper
  activeThreadId: string;
}

const AlmaChatContext = createContext<AlmaChatContextType | null>(null);

const GENERAL_THREAD_ID = 'general';

export function AlmaChatProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentContextInfo | null>(null);
  const [threads, setThreads] = useState<Map<string, ChatMessage[]>>(new Map());

  // Determine active thread based on current student (location-based)
  const activeThreadId = currentStudent ? currentStudent.id : GENERAL_THREAD_ID;

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const getActiveThread = useCallback((): ChatMessage[] => {
    return threads.get(activeThreadId) || [];
  }, [threads, activeThreadId]);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    setThreads(prev => {
      const newMap = new Map(prev);
      const currentMessages = newMap.get(activeThreadId) || [];
      newMap.set(activeThreadId, [...currentMessages, newMessage]);
      return newMap;
    });
  }, [activeThreadId]);

  const clearThread = useCallback((threadId?: string) => {
    const targetThreadId = threadId ?? activeThreadId;
    setThreads(prev => {
      const newMap = new Map(prev);
      newMap.set(targetThreadId, []);
      return newMap;
    });
  }, [activeThreadId]);

  // Load expanded state from localStorage on mount
  useEffect(() => {
    const savedExpanded = localStorage.getItem('alma-chat-expanded');
    if (savedExpanded !== null) {
      setIsExpanded(savedExpanded === 'true');
    }
  }, []);

  // Save expanded state to localStorage
  useEffect(() => {
    localStorage.setItem('alma-chat-expanded', String(isExpanded));
  }, [isExpanded]);

  return (
    <AlmaChatContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        toggleExpanded,
        currentStudent,
        setCurrentStudent,
        threads,
        getActiveThread,
        addMessage,
        clearThread,
        activeThreadId,
      }}
    >
      {children}
    </AlmaChatContext.Provider>
  );
}

export function useAlmaChatContext() {
  const context = useContext(AlmaChatContext);
  if (!context) {
    throw new Error('useAlmaChatContext must be used within an AlmaChatProvider');
  }
  return context;
}
