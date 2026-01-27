'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, TextField, Checkbox, Button, Tab, Tabs } from '@mui/material';
import { Sparkles, Plus, Check, X } from 'lucide-react';
import { SubTabNavigation, AIReviewBadge } from '@/components/shared';
import { AlmaChatPanel } from '@/components/AlmaChatPanel';
import type { Task, SuggestedAction } from '@/types/student';

export type SidePanelTabType = 'alma' | 'tasks';
type TabType = SidePanelTabType;

interface SidePanelProps {
  studentFirstName: string;
  tasks: Task[];
  suggestedActions: SuggestedAction[];
  studentId?: string;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  onTaskToggle?: (task: Task) => void;
  onNewTask?: (title: string) => void;
  onTaskEdit?: (taskId: string, newTitle: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onActionAccept?: (action: SuggestedAction) => void;
  onActionDismiss?: (action: SuggestedAction) => void;
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

export function SidePanel({
  studentFirstName,
  tasks,
  suggestedActions,
  studentId,
  activeTab: controlledActiveTab,
  onTabChange,
  onTaskToggle,
  onNewTask,
  onTaskEdit,
  onTaskDelete,
  onActionAccept,
  onActionDismiss,
}: SidePanelProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<TabType>('alma');

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

  const filteredTasks = tasks.filter((t) => t.status === taskFilter);
  const staffTasks = filteredTasks.filter((t) => t.taskType === 'staff');
  const studentTasks = filteredTasks.filter((t) => t.taskType === 'student');
  const openCount = tasks.filter((t) => t.status === 'open').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingActions = suggestedActions.filter((a) => a.status === 'pending');

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
      {/* Horizontal Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{
          minHeight: 'auto',
          borderBottom: '1px solid #E5E7EB',
          '& .MuiTabs-indicator': {
            backgroundColor: '#062F29',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            minHeight: 44,
            flex: 1,
            color: '#6B7280',
            '&.Mui-selected': {
              color: '#062F29',
            },
          },
        }}
      >
        <Tab value="alma" label="Alma" />
        <Tab value="tasks" label="Tasks" />
      </Tabs>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Alma Tab Content */}
        {activeTab === 'alma' && (
          <AlmaChatPanel
            studentFirstName={studentFirstName}
            studentId={studentId}
            showStudentContext={true}
          />
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

            {/* Tasks Filter - only show when there are tasks */}
            {tasks.length > 0 && (
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
            )}

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
                <Box sx={{ textAlign: 'center', py: 4, px: 2, backgroundColor: '#F9FAFB', borderRadius: 2, mt: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                      mb: 0.5,
                    }}
                  >
                    {taskFilter === 'open' ? 'No tasks yet.' : 'No completed tasks.'}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#6B7280',
                    }}
                  >
                    {taskFilter === 'open' ? 'Next steps and follow-ups for this student will show up here.' : ''}
                  </Typography>
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
      </Box>
    </Box>
  );
}

export default SidePanel;
