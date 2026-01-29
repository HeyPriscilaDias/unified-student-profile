'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface AlmaChatContextType {
  // UI State
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;

  // Chat Management
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | null;

  // Actions
  createChat: () => string;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  setActiveChat: (chatId: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>, chatId?: string) => void;
}

const AlmaChatContext = createContext<AlmaChatContextType | null>(null);

function generateChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateTitleFromMessage(content: string): string {
  // Take first ~40 chars of the message, cut at word boundary
  const maxLength = 40;
  if (content.length <= maxLength) {
    return content;
  }
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 20) {
    return truncated.substring(0, lastSpace) + '...';
  }
  return truncated + '...';
}

export function AlmaChatProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const createChat = useCallback((): string => {
    const newChat: Chat = {
      id: generateChatId(),
      title: 'New chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      // If we're deleting the active chat, switch to most recent or null
      if (chatId === activeChatId) {
        const nextChat = filtered[0];
        setActiveChatId(nextChat?.id || null);
      }
      return filtered;
    });
  }, [activeChatId]);

  const renameChat = useCallback((chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, title: newTitle, updatedAt: new Date().toISOString() }
        : chat
    ));
  }, []);

  const setActiveChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>, chatId?: string) => {
    const targetChatId = chatId || activeChatId;
    if (!targetChatId) return;

    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date().toISOString(),
    };

    setChats(prev => prev.map(chat => {
      if (chat.id !== targetChatId) return chat;

      const updatedMessages = [...chat.messages, newMessage];

      // Auto-generate title from first user message if title is still "New chat"
      let newTitle = chat.title;
      if (chat.title === 'New chat' && message.role === 'user') {
        newTitle = generateTitleFromMessage(message.content);
      }

      return {
        ...chat,
        title: newTitle,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [activeChatId]);

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
        chats,
        activeChatId,
        activeChat,
        createChat,
        deleteChat,
        renameChat,
        setActiveChat,
        addMessage,
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
