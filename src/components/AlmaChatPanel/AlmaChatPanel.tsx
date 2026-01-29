'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { Send, ChevronDown, Plus, Pencil, Trash2, MessageSquare, Check, X } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
import { useAlmaChatContext, type ChatMessage } from '@/contexts/AlmaChatContext';

interface AlmaChatPanelProps {
  studentFirstName?: string;
}

function generateContextAwareSuggestions(studentFirstName?: string): string[] {
  if (!studentFirstName) {
    return [
      'How to choose the best college for a student?',
      'What are the key milestones for college readiness?',
    ];
  }

  return [
    `What colleges might be a good fit for ${studentFirstName}?`,
    `How can I help ${studentFirstName} explore career options?`,
  ];
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          maxWidth: '85%',
          px: 2,
          py: 1.5,
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isUser ? '#062F29' : '#F3F4F6',
          color: isUser ? '#fff' : '#374151',
        }}
      >
        <Typography sx={{ fontSize: '14px', lineHeight: 1.5 }}>
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
}

export function AlmaChatPanel({ studentFirstName }: AlmaChatPanelProps) {
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    activeChatId,
    activeChat,
    createChat,
    deleteChat,
    renameChat,
    setActiveChat,
    addMessage,
  } = useAlmaChatContext();

  const menuOpen = Boolean(anchorEl);

  // Generate suggestions based on current page context (not chat context)
  const suggestions = generateContextAwareSuggestions(studentFirstName);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    // If no active chat, create one first
    const chatId = activeChatId || createChat();
    const messageContent = message.trim();

    // Add user message
    addMessage({ role: 'user', content: messageContent }, chatId);

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `I understand you're asking about "${messageContent.substring(0, 50)}...". This is a simulated response for the prototype.`,
      }, chatId);
    }, 500);

    setMessage('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    // If no active chat, create one first
    const chatId = activeChatId || createChat();

    addMessage({ role: 'user', content: suggestion }, chatId);

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `Great question! Here's information about "${suggestion.substring(0, 40)}...". This is a simulated response for the prototype.`,
      }, chatId);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditingChatId(null);
  };

  const handleNewChat = () => {
    createChat();
    handleMenuClose();
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    handleMenuClose();
  };

  const handleStartRename = (e: React.MouseEvent, chatId: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (chatId: string) => {
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const currentTitle = activeChat?.title || 'New chat';
  const hasMessages = activeChat && activeChat.messages.length > 0;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Chat Selector */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
        }}
      >
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              '& .chat-title': {
                color: '#062F29',
              },
            },
          }}
        >
          <MessageSquare size={16} color="#6B7280" />
          <Typography
            className="chat-title"
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentTitle}
          </Typography>
          <ChevronDown size={16} color="#6B7280" />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                width: 280,
                maxHeight: 400,
                mt: 0.5,
              },
            },
          }}
        >
          {/* New Chat Button */}
          <MenuItem onClick={handleNewChat}>
            <ListItemIcon>
              <Plus size={18} />
            </ListItemIcon>
            <ListItemText
              primary="New chat"
              primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
            />
          </MenuItem>

          {chats.length > 0 && <Divider />}

          {/* Chat List */}
          {chats.map((chat) => (
            <MenuItem
              key={chat.id}
              selected={chat.id === activeChatId}
              onClick={() => handleSelectChat(chat.id)}
              sx={{
                '&:hover .chat-actions': {
                  opacity: 1,
                },
              }}
            >
              {editingChatId === chat.id ? (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    size="small"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveRename(chat.id);
                      } else if (e.key === 'Escape') {
                        handleCancelRename();
                      }
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&.Mui-focused fieldset': { borderColor: '#062F29' },
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleSaveRename(chat.id)}
                    sx={{ color: '#22C55E' }}
                  >
                    <Check size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleCancelRename}
                    sx={{ color: '#6B7280' }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <ListItemIcon>
                    <MessageSquare size={16} />
                  </ListItemIcon>
                  <ListItemText
                    primary={chat.title}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  />
                  <Box
                    className="chat-actions"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      opacity: 0,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleStartRename(e, chat.id, chat.title)}
                      sx={{
                        color: '#6B7280',
                        padding: '4px',
                        '&:hover': { color: '#062F29', backgroundColor: '#F3F4F6' },
                      }}
                    >
                      <Pencil size={14} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      sx={{
                        color: '#6B7280',
                        padding: '4px',
                        '&:hover': { color: '#EF4444', backgroundColor: '#FEE2E2' },
                      }}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Box>
                </>
              )}
            </MenuItem>
          ))}

          {chats.length === 0 && (
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                No chats yet. Start a new conversation!
              </Typography>
            </Box>
          )}
        </Menu>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
        }}
      >
        {hasMessages ? (
          <>
            {activeChat.messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <Typography
            sx={{
              fontSize: '14px',
              color: '#374151',
              lineHeight: 1.5,
            }}
          >
            Hey Sarah, how can I help you today?
          </Typography>
        )}
      </Box>

      {/* Suggestions & Input */}
      <Box
        sx={{
          borderTop: '1px solid #E5E7EB',
          px: 2,
          py: 2,
        }}
      >
        {/* Suggestions - only show when no messages */}
        {!hasMessages && (
          <Box sx={{ mb: 2 }}>
            {suggestions.map((suggestion) => (
              <Box
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  py: 0.75,
                  cursor: 'pointer',
                  '&:hover': {
                    '& .suggestion-text': {
                      color: '#062F29',
                    },
                  },
                }}
              >
                <Alma size={16} color="#12B76A" style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography
                  className="suggestion-text"
                  sx={{
                    fontSize: '13px',
                    color: '#374151',
                    lineHeight: 1.4,
                  }}
                >
                  {suggestion}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Input */}
        <TextField
          fullWidth
          placeholder="Message Alma..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: '#F9FAFB',
              fontSize: '14px',
              '& fieldset': {
                borderColor: '#E5E7EB',
              },
              '&:hover fieldset': {
                borderColor: '#D1D5DB',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#062F29',
              },
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={handleSend}
                    sx={{
                      backgroundColor: '#062F29',
                      color: '#fff',
                      width: 28,
                      height: 28,
                      '&:hover': {
                        backgroundColor: '#2B4C46',
                      },
                    }}
                  >
                    <Send size={14} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default AlmaChatPanel;
