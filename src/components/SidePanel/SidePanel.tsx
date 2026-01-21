'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, TextField, Checkbox, Button, FormControlLabel, Avatar, Fab, useMediaQuery, useTheme } from '@mui/material';
import { Sparkles, Plus, Check, X, Lock, Globe, MessageSquare, Mic, ChevronRight } from 'lucide-react';
import { SubTabNavigation, AIReviewBadge } from '@/components/shared';
import type { Task, SuggestedAction, Interaction } from '@/types/student';

export type SidePanelTabType = 'tasks' | 'notes' | 'interactions';
type TabType = SidePanelTabType;

interface Note {
  id: string;
  content: string;
  visibility: 'public' | 'private';
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}

interface SidePanelProps {
  studentFirstName: string;
  tasks: Task[];
  suggestedActions: SuggestedAction[];
  interactions?: Interaction[];
  studentId?: string;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  onTaskToggle?: (task: Task) => void;
  onNewTask?: (title: string) => void;
  onTaskEdit?: (taskId: string, newTitle: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onActionAccept?: (action: SuggestedAction) => void;
  onActionDismiss?: (action: SuggestedAction) => void;
  onInteractionClick?: (interaction: Interaction) => void;
  onScheduleInteraction?: () => void;
}

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
            From {action.source === 'meeting_summary' ? 'meeting summary' : 'Alma snapshot'} - {action.sourceDate}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {action.assignee === 'student' ? (
          <Button
            size="small"
            variant="outlined"
            startIcon={<Plus size={14} />}
            onClick={onAccept}
            sx={{
              textTransform: 'none',
              fontSize: '12px',
              fontWeight: 500,
              color: '#062F29',
              borderColor: '#D1D5DB',
              backgroundColor: 'white',
              px: 1.5,
              py: 0.5,
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#062F29',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            Add to student tasks
          </Button>
        ) : (
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
        )}
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

function formatInteractionDate(dateStr: string) {
  // Handle YYYY-MM-DD format
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function InteractionItem({
  interaction,
  onClick,
}: {
  interaction: Interaction;
  onClick?: () => void;
}) {
  const hasRecording = !!interaction.recordingUrl || !!interaction.transcript;
  const isPlanned = interaction.status === 'planned';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.5,
        px: 1.5,
        borderRadius: '8px',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: isPlanned ? '#FFFBEB' : '#F9FAFB',
        border: isPlanned ? '1px solid #FDE68A' : '1px solid #E5E7EB',
        '&:hover': onClick ? {
          backgroundColor: isPlanned ? '#FEF3C7' : '#F3F4F6',
        } : {},
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '6px',
          backgroundColor: isPlanned ? '#F59E0B' : hasRecording ? '#062F29' : '#6B7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {hasRecording ? <Mic size={16} color="#fff" /> : <MessageSquare size={16} color="#fff" />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#111827',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {interaction.title}
          </Typography>
          {isPlanned && (
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                backgroundColor: '#FEF3C7',
                fontSize: '10px',
                fontWeight: 600,
                color: '#B45309',
                textTransform: 'uppercase',
              }}
            >
              Planned
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
            {formatInteractionDate(interaction.interactionDate)}
          </Typography>
          {hasRecording && !isPlanned && (
            <>
              <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>•</Typography>
              <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                Recorded
              </Typography>
            </>
          )}
        </Box>
      </Box>
      {onClick && (
        <ChevronRight size={16} color="#9CA3AF" style={{ marginTop: 8 }} />
      )}
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
      <Typography sx={{ fontSize: '14px', color: '#374151', lineHeight: 1.5, pl: 5.5 }}>
        {note.content}
      </Typography>
    </Box>
  );
}

export function SidePanel({
  studentFirstName: _studentFirstName,
  tasks,
  suggestedActions,
  interactions = [],
  studentId: _studentId,
  activeTab: controlledActiveTab,
  onTabChange,
  onTaskToggle,
  onNewTask,
  onTaskEdit,
  onTaskDelete,
  onActionAccept,
  onActionDismiss,
  onInteractionClick,
  onScheduleInteraction,
}: SidePanelProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [internalActiveTab, setInternalActiveTab] = useState<TabType>('tasks');

  // Support both controlled and uncontrolled modes
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };
  const [taskFilter, setTaskFilter] = useState<'open' | 'completed'>('open');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<'private' | 'public'>('private');
  const [notes, setNotes] = useState<Note[]>([]);

  const filteredTasks = tasks.filter((t) => t.status === taskFilter);
  const staffTasks = filteredTasks.filter((t) => t.taskType === 'staff');
  const studentTasks = filteredTasks.filter((t) => t.taskType === 'student');
  const openCount = tasks.filter((t) => t.status === 'open').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingActions = suggestedActions.filter((a) => a.status === 'pending');

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
        width: '350px',
        height: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,
        backgroundColor: '#fff',
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
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
          label="Tasks"
          isActive={activeTab === 'tasks'}
          onClick={() => setActiveTab('tasks')}
        />
        <TabButton
          label="Interactions"
          isActive={activeTab === 'interactions'}
          onClick={() => setActiveTab('interactions')}
        />
        <TabButton
          label="Notes"
          isActive={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
        />
      </Box>

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
          {/* Suggested Actions Section - Hidden for prototype testing */}
          {false && pendingActions.length > 0 && (
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

          {/* Tasks Description */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: '#6B7280',
              }}
            >
              Next steps and follow-ups for this student.
            </Typography>
          </Box>

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
                  {taskFilter === 'open' ? 'No active tasks for this student.' : 'No completed tasks'}
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
                    Add task
                  </Button>
                )}
              </Box>
            ) : (
              <>
                {/* Staff Tasks */}
                {staffTasks.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 1,
                        mt: 1,
                      }}
                    >
                      Counselor tasks
                    </Typography>
                    {staffTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => onTaskToggle?.(task)}
                        onEdit={(newTitle) => onTaskEdit?.(task.id, newTitle)}
                        onDelete={() => onTaskDelete?.(task.id)}
                      />
                    ))}
                  </Box>
                )}

                {/* Student Tasks */}
                {studentTasks.length > 0 && (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 1,
                        mt: 1,
                      }}
                    >
                      Student tasks
                    </Typography>
                    {studentTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => onTaskToggle?.(task)}
                        onEdit={(newTitle) => onTaskEdit?.(task.id, newTitle)}
                        onDelete={() => onTaskDelete?.(task.id)}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Add task button */}
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
                Add task
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Interactions Tab Content */}
      {activeTab === 'interactions' && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* Interactions Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: '#6B7280',
                mb: 1.5,
              }}
            >
              Keep track of meaningful conversations and follow-ups with this student.
            </Typography>
            {!isMobile && (
              <Button
                variant="contained"
                fullWidth
                startIcon={<Plus size={16} />}
                onClick={onScheduleInteraction}
                sx={{
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: '#062F29',
                  '&:hover': {
                    backgroundColor: '#2B4C46',
                  },
                }}
              >
                Add interaction
              </Button>
            )}
          </Box>

          {/* Mobile: FAB for Add interaction */}
          {isMobile && (
            <Fab
              color="primary"
              aria-label="Add interaction"
              onClick={onScheduleInteraction}
              sx={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                backgroundColor: '#062F29',
                '&:hover': {
                  backgroundColor: '#2B4C46',
                },
              }}
            >
              <Plus size={24} />
            </Fab>
          )}

          {/* Interactions list */}
          <Box sx={{ flex: 1, px: 2, py: 2, overflowY: 'auto' }}>
            {(() => {
              // Sort interactions: planned first (by date ascending), then completed (by date descending)
              const plannedInteractions = interactions
                .filter(i => i.status === 'planned')
                .sort((a, b) => a.interactionDate.localeCompare(b.interactionDate));
              const completedInteractions = interactions
                .filter(i => i.status === 'completed')
                .sort((a, b) => b.interactionDate.localeCompare(a.interactionDate));
              const sortedInteractions = [...plannedInteractions, ...completedInteractions];

              if (interactions.length === 0) {
                return (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <MessageSquare size={32} color="#D1D5DB" style={{ margin: '0 auto 12px' }} />
                    <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 1 }}>
                      No interactions logged yet.
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>
                      Add an interaction to start tracking conversations.
                    </Typography>
                  </Box>
                );
              }

              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {sortedInteractions.slice(0, 10).map((interaction) => (
                    <InteractionItem
                      key={interaction.id}
                      interaction={interaction}
                      onClick={() => onInteractionClick?.(interaction)}
                    />
                  ))}
                  {sortedInteractions.length > 10 && (
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#6B7280',
                        textAlign: 'center',
                        py: 1,
                      }}
                    >
                      + {sortedInteractions.length - 10} more interactions
                    </Typography>
                  )}
                </Box>
              );
            })()}
          </Box>
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
          {/* Notepad Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: '#6B7280',
              }}
            >
              Add notes to remember important context about this student.
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
                    Only visible to me
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
                  <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                    Visible to all staff
                  </Typography>
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
              Save
            </Button>
          </Box>

          {/* Notepad list */}
          <Box sx={{ flex: 1, px: 2, py: 2, overflowY: 'auto' }}>
            {notes.map((note) => <NoteItem key={note.id} note={note} />)}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default SidePanel;
