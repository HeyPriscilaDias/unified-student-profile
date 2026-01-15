'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, TextField, InputAdornment, Checkbox, Button, FormControlLabel, Tooltip, Avatar } from '@mui/material';
import { RotateCcw, History, Sparkles, ChevronDown, ChevronUp, Info, Send, Plus, Check, X, Lock, Globe } from 'lucide-react';
import { SubTabNavigation, AIReviewBadge } from '@/components/shared';
import type { Task, SuggestedAction } from '@/types/student';

type TabType = 'alma' | 'tasks' | 'notes';

interface Note {
  id: string;
  content: string;
  visibility: 'public' | 'private';
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}

interface AlmaChatPanelProps {
  studentFirstName: string;
  tasks: Task[];
  suggestedActions: SuggestedAction[];
  onTaskToggle?: (task: Task) => void;
  onNewTask?: (title: string) => void;
  onTaskEdit?: (taskId: string, newTitle: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onActionAccept?: (action: SuggestedAction) => void;
  onActionDismiss?: (action: SuggestedAction) => void;
}

const INITIAL_SUGGESTIONS = [
  'How to choose the best college for me?',
  'How to choose a major?',
];

const MORE_SUGGESTIONS = [
  'What scholarships am I eligible for?',
  'How do I write a strong personal statement?',
  'What extracurriculars should I focus on?',
];

function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle?: () => void;
  onEdit?: (newTitle: string) => void;
  onDelete?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== task.title) {
      onEdit?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.5,
        borderBottom: '1px solid #E5E7EB',
        '&:last-child': {
          borderBottom: 'none',
        },
        '&:hover .task-actions': {
          opacity: 1,
        },
      }}
    >
      <Checkbox
        checked={task.status === 'completed'}
        onChange={onToggle}
        size="small"
        sx={{
          padding: 0,
          marginTop: '2px',
          '&.Mui-checked': {
            color: '#22C55E',
          },
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#062F29',
                },
              },
            }}
          />
        ) : (
          <Typography
            onClick={() => setIsEditing(true)}
            sx={{
              fontSize: '14px',
              color: task.status === 'completed' ? '#9CA3AF' : '#062F29',
              textDecoration: task.status === 'completed' ? 'line-through' : 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#F9FAFB',
                borderRadius: '4px',
                mx: -0.5,
                px: 0.5,
              },
            }}
          >
            {task.title}
          </Typography>
        )}
      </Box>
      {!isEditing && (
        <Box
          className="task-actions"
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
            onClick={onDelete}
            sx={{
              color: '#9CA3AF',
              padding: '2px',
              '&:hover': {
                color: '#EF4444',
                backgroundColor: '#FEE2E2',
              },
            }}
          >
            <X size={14} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

function ActionItem({
  action,
  onAccept,
  onDismiss,
}: {
  action: SuggestedAction;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderRadius: '8px',
        background: 'linear-gradient(to right, #FFFBEB, #F0FDF4)',
        border: '1px solid #FDE68A',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 500,
            color: '#062F29',
            fontSize: '14px',
            mb: 0.5,
          }}
        >
          {action.title}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: '#4B5563' }}>
          {action.description}
        </Typography>
        {action.sourceDate && (
          <Typography sx={{ fontSize: '12px', color: '#6B7280', mt: 0.5 }}>
            From {action.source === 'meeting_notes' ? 'meeting notes' : 'Alma snapshot'} - {action.sourceDate}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={onAccept}
          sx={{
            color: '#16A34A',
            '&:hover': {
              backgroundColor: '#DCFCE7',
            },
          }}
        >
          <Check size={18} />
        </IconButton>
        <IconButton
          size="small"
          onClick={onDismiss}
          sx={{
            color: '#9CA3AF',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          <X size={18} />
        </IconButton>
      </Box>
    </Box>
  );
}

function TabButton({
  label,
  isActive,
  onClick
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        py: 1,
        textAlign: 'center',
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid #062F29' : '2px solid transparent',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: isActive ? 'transparent' : '#F9FAFB',
        },
      }}
    >
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#062F29' : '#6B7280',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function NoteItem({ note }: { note: Note }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        py: 2,
        borderBottom: '1px solid #E5E7EB',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {/* Author info and date */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Avatar
          src={note.authorAvatar}
          sx={{ width: 28, height: 28, fontSize: '12px', bgcolor: '#062F29' }}
        >
          {note.authorName.split(' ').map(n => n[0]).join('')}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
            {note.authorName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
              {formatDate(note.createdAt)}
            </Typography>
            {note.visibility === 'private' ? (
              <Lock size={12} style={{ color: '#6B7280' }} />
            ) : (
              <Globe size={12} style={{ color: '#6B7280' }} />
            )}
          </Box>
        </Box>
      </Box>
      {/* Note content */}
      <Typography sx={{ fontSize: '14px', color: '#374151', lineHeight: 1.5, pl: 5.5 }}>
        {note.content}
      </Typography>
    </Box>
  );
}

export function AlmaChatPanel({ studentFirstName, tasks, suggestedActions, onTaskToggle, onNewTask, onTaskEdit, onTaskDelete, onActionAccept, onActionDismiss }: AlmaChatPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('alma');
  const [message, setMessage] = useState('');
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'open' | 'completed'>('open');

  // New task input state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Notes state
  const [noteText, setNoteText] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<'private' | 'public'>('private');
  const [notes, setNotes] = useState<Note[]>([]);

  const filteredTasks = tasks.filter((t) => t.status === taskFilter);
  const openCount = tasks.filter((t) => t.status === 'open').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingActions = suggestedActions.filter((a) => a.status === 'pending');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
  };

  const handleReset = () => {
    console.log('Reset chat');
  };

  const handleHistory = () => {
    console.log('View history');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSubmitNote = () => {
    if (noteText.trim()) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        content: noteText.trim(),
        visibility: noteVisibility,
        authorName: 'Ms. Rodriguez',
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      setNoteText('');
    }
  };

  const handleSubmitNewTask = () => {
    if (newTaskTitle.trim()) {
      onNewTask?.(newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleNewTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitNewTask();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <Box
      sx={{
        width: '420px',
        height: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,
        backgroundColor: '#fff',
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tab Navigation */}
      <Box
        sx={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <TabButton
          label="Alma"
          isActive={activeTab === 'alma'}
          onClick={() => setActiveTab('alma')}
        />
        <TabButton
          label="Tasks"
          isActive={activeTab === 'tasks'}
          onClick={() => setActiveTab('tasks')}
        />
        <TabButton
          label="Notes"
          isActive={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
        />
      </Box>

      {/* Alma Tab Content */}
      {activeTab === 'alma' && (
        <>
          {/* Alma Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#12B76A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="#fff" />
            </Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#111827',
                flex: 1,
              }}
            >
              Alma AI Coach
            </Typography>
            <IconButton
              size="small"
              onClick={handleReset}
              sx={{
                color: '#6B7280',
                fontSize: '13px',
                gap: 0.5,
                borderRadius: '6px',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <RotateCcw size={14} />
              <Typography component="span" sx={{ fontSize: '13px' }}>
                Reset
              </Typography>
            </IconButton>
            <IconButton
              size="small"
              onClick={handleHistory}
              sx={{
                color: '#6B7280',
                fontSize: '13px',
                gap: 0.5,
                borderRadius: '6px',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <History size={14} />
              <Typography component="span" sx={{ fontSize: '13px' }}>
                History
              </Typography>
            </IconButton>
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
            {/* Welcome Message */}
            <Typography
              sx={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: 1.5,
              }}
            >
              Hey Sarah, how can I help you support {studentFirstName} today?
            </Typography>
          </Box>

          {/* Suggestions & Input */}
          <Box
            sx={{
              borderTop: '1px solid #E5E7EB',
              px: 2,
              py: 2,
            }}
          >
            {/* Suggestions */}
            <Box sx={{ mb: 2 }}>
              {INITIAL_SUGGESTIONS.map((suggestion) => (
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
                  <Sparkles size={16} color="#12B76A" style={{ marginTop: 2, flexShrink: 0 }} />
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

              {showMoreSuggestions &&
                MORE_SUGGESTIONS.map((suggestion) => (
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
                    <Sparkles size={16} color="#12B76A" style={{ marginTop: 2, flexShrink: 0 }} />
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

              {/* More suggestions toggle */}
              <Box
                onClick={() => setShowMoreSuggestions(!showMoreSuggestions)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  pt: 0.5,
                  cursor: 'pointer',
                  color: '#6B7280',
                  '&:hover': { color: '#374151' },
                }}
              >
                {showMoreSuggestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <Typography sx={{ fontSize: '13px' }}>
                  {showMoreSuggestions ? 'Less suggestions' : 'More suggestions'}
                </Typography>
              </Box>
            </Box>

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
                      <IconButton size="small" sx={{ color: '#9CA3AF' }}>
                        <Info size={18} />
                      </IconButton>
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
        </>
      )}

      {/* Tasks Tab Content */}
      {activeTab === 'tasks' && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Suggested Actions Section */}
          {pendingActions.length > 0 && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                <Sparkles size={18} style={{ color: '#F59E0B' }} />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Suggested Actions
                </Typography>
                <AIReviewBadge />
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                {pendingActions.map((action) => (
                  <ActionItem
                    key={action.id}
                    action={action}
                    onAccept={() => onActionAccept?.(action)}
                    onDismiss={() => onActionDismiss?.(action)}
                  />
                ))}
              </Box>
            </>
          )}

          {/* Tasks Filter */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <SubTabNavigation
              options={[
                { value: 'open', label: `Open (${openCount})` },
                { value: 'completed', label: `Completed (${completedCount})` },
              ]}
              value={taskFilter}
              onChange={(v) => setTaskFilter(v as 'open' | 'completed')}
            />
          </Box>

          {/* Tasks list */}
          <Box sx={{ flex: 1, px: 2, py: 1, overflowY: 'auto' }}>
            {/* New task input - shown at top when adding */}
            {isAddingTask && taskFilter === 'open' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                <Checkbox disabled size="small" sx={{ padding: 0, marginTop: '2px' }} />
                <TextField
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={handleNewTaskKeyDown}
                  onBlur={() => {
                    if (!newTaskTitle.trim()) {
                      setIsAddingTask(false);
                    }
                  }}
                  placeholder="Enter task title..."
                  autoFocus
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: '#E5E7EB',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#062F29',
                      },
                    },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleSubmitNewTask}
                  disabled={!newTaskTitle.trim()}
                  sx={{
                    color: newTaskTitle.trim() ? '#16A34A' : '#9CA3AF',
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: '#DCFCE7',
                    },
                  }}
                >
                  <Check size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setNewTaskTitle('');
                    setIsAddingTask(false);
                  }}
                  sx={{
                    color: '#9CA3AF',
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                    },
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Box>
            )}

            {filteredTasks.length === 0 && !isAddingTask ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: '#6B7280',
                    mb: 2,
                  }}
                >
                  {taskFilter === 'open' ? 'No open tasks' : 'No completed tasks'}
                </Typography>
                {taskFilter === 'open' && (
                  <Button
                    variant="text"
                    startIcon={<Plus size={16} />}
                    onClick={() => setIsAddingTask(true)}
                    sx={{
                      textTransform: 'none',
                      color: '#4B5563',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#062F29',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    New task
                  </Button>
                )}
              </Box>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onTaskToggle?.(task)}
                  onEdit={(newTitle) => onTaskEdit?.(task.id, newTitle)}
                  onDelete={() => onTaskDelete?.(task.id)}
                />
              ))
            )}
          </Box>

          {/* New task button */}
          {taskFilter === 'open' && filteredTasks.length > 0 && !isAddingTask && (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderTop: '1px solid #E5E7EB',
              }}
            >
              <Button
                variant="text"
                startIcon={<Plus size={16} />}
                onClick={() => setIsAddingTask(true)}
                sx={{
                  textTransform: 'none',
                  padding: 0,
                  color: '#4B5563',
                  fontSize: '14px',
                  '&:hover': {
                    color: '#062F29',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                New task
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Notes Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Personal Notes
            </Typography>
          </Box>

          {/* Note Input Form */}
          <Box
            sx={{
              px: 2,
              py: 2,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            {/* Multi-line text input */}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Add a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
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
            />

            {/* Visibility controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noteVisibility === 'private'}
                    onChange={() => setNoteVisibility('private')}
                    size="small"
                  />
                }
                label={
                  <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                    Private
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noteVisibility === 'public'}
                    onChange={() => setNoteVisibility('public')}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                      Public
                    </Typography>
                    <Tooltip title="Visible to other staff only, not students or mentors" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
                        <Info size={14} style={{ color: '#6B7280' }} />
                      </Box>
                    </Tooltip>
                  </Box>
                }
              />
            </Box>

            {/* Submit button */}
            <Button
              variant="contained"
              onClick={handleSubmitNote}
              disabled={!noteText.trim()}
              sx={{
                textTransform: 'none',
                backgroundColor: '#062F29',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#2B4C46',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              Submit Note
            </Button>
          </Box>

          {/* Notes list */}
          <Box sx={{ flex: 1, px: 2, py: 2, overflowY: 'auto' }}>
            {notes.length === 0 ? (
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#6B7280',
                  textAlign: 'center',
                  py: 4,
                }}
              >
                No notes yet. Add your first note about {studentFirstName}.
              </Typography>
            ) : (
              notes.map((note) => <NoteItem key={note.id} note={note} />)
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default AlmaChatPanel;
