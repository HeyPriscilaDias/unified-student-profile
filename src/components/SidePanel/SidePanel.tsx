'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, TextField, Checkbox, Button, Tab, Tabs } from '@mui/material';
import { Plus, Check, X } from 'lucide-react';
import { AlmaChatPanel } from '@/components/AlmaChatPanel';
import { AddTaskModal } from './AddTaskModal';
import { useTasksContext } from '@/contexts/TasksContext';
import type { Task, SuggestedAction } from '@/types/student';

export type SidePanelTabType = 'alma' | 'tasks';
type TabType = SidePanelTabType;

interface SidePanelProps {
  studentFirstName?: string;
  tasks?: Task[];
  suggestedActions?: SuggestedAction[];
  studentId?: string;
  currentStudentId?: string;
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
  studentName,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  studentName?: string;
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
          <Box>
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
            {studentName && (
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#9CA3AF',
                  mt: 0.25,
                }}
              >
                {studentName}
              </Typography>
            )}
          </Box>
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
  tasks = [],
  suggestedActions = [],
  studentId,
  currentStudentId,
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
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const { getAllCounselorTasks, addTask, toggleTask: contextToggleTask, deleteTask: contextDeleteTask } = useTasksContext();

  // Counselor-wide tasks
  const allCounselorTasks = getAllCounselorTasks();
  const openTasks = allCounselorTasks.filter((t) => t.status === 'open');
  const completedTasks = allCounselorTasks.filter((t) => t.status === 'completed');

  const pendingActions = suggestedActions.filter((a) => a.status === 'pending');

  const handleCreateTask = (data: {
    title: string;
    description?: string;
    dueDate?: string;
    studentId?: string;
    taskType: 'staff' | 'student';
  }) => {
    addTask({
      studentId: data.studentId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      source: 'manual',
      taskType: data.taskType,
    });
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
            studentFirstName={studentFirstName || ''}
          />
        )}

        {/* Tasks Tab Content - Counselor-wide */}
        {activeTab === 'tasks' && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Add Task Button */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <Button
                startIcon={<Plus size={16} />}
                onClick={() => setIsAddTaskModalOpen(true)}
                sx={{
                  textTransform: 'none',
                  color: '#062F29',
                  fontSize: '14px',
                  fontWeight: 500,
                  p: 0,
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                Add task
              </Button>
            </Box>

            {/* Tasks list */}
            <Box sx={{ flex: 1, px: 2, py: 1, overflowY: 'auto' }}>
              {openTasks.length === 0 && completedTasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, px: 2, backgroundColor: '#F9FAFB', borderRadius: 2, mt: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                      mb: 0.5,
                    }}
                  >
                    No tasks yet.
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#6B7280',
                    }}
                  >
                    Add a task above to get started.
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Open Tasks */}
                  {openTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      studentName={task.studentName}
                      onToggle={() => contextToggleTask(task.studentId, task.id)}
                      onDelete={() => contextDeleteTask(task.studentId, task.id)}
                    />
                  ))}

                  {/* Show/Hide completed toggle */}
                  {completedTasks.length > 0 && (
                    <>
                      <Typography
                        onClick={() => setShowCompleted(!showCompleted)}
                        sx={{
                          fontSize: '14px',
                          color: '#4D7CFE',
                          cursor: 'pointer',
                          py: 1.5,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {showCompleted
                          ? 'Hide completed'
                          : `Show completed (${completedTasks.length})`}
                      </Typography>

                      {showCompleted && (
                        <Box>
                          {completedTasks.map((task) => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              studentName={task.studentName}
                              onToggle={() => contextToggleTask(task.studentId, task.id)}
                              onDelete={() => contextDeleteTask(task.studentId, task.id)}
                            />
                          ))}
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
        )}

      </Box>

      {/* Add Task Modal */}
      <AddTaskModal
        open={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </Box>
  );
}

export default SidePanel;
