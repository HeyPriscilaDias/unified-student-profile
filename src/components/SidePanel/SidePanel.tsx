'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, IconButton, TextField, Checkbox, Button, Tab, Tabs } from '@mui/material';
import { Sparkles, Plus, Check, X } from 'lucide-react';
import { SubTabNavigation, AIReviewBadge } from '@/components/shared';
import { AlmaChatPanel } from '@/components/AlmaChatPanel';
import { CounselorMeetingsList } from './CounselorMeetingsList';
import { ActiveMeetingPanel } from './ActiveMeetingPanel';
import { StudentPickerModal } from './StudentPickerModal';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { useInteractionsContext } from '@/contexts/InteractionsContext';
import { useTasksContext, type TaskWithStudent } from '@/contexts/TasksContext';
import type { Task, SuggestedAction } from '@/types/student';

export type SidePanelTabType = 'alma' | 'tasks' | 'meetings';
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
  const router = useRouter();
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
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);

  // Contexts for meetings
  const { activeMeeting, startMeeting, endMeeting } = useActiveMeetingContext();
  const { addInteraction } = useInteractionsContext();
  const { getAllCounselorTasks, toggleTask: contextToggleTask, deleteTask: contextDeleteTask } = useTasksContext();

  // Counselor-wide tasks
  const allCounselorTasks = getAllCounselorTasks();
  const filteredCounselorTasks = allCounselorTasks.filter((t) => t.status === taskFilter);
  const counselorStaffTasks = filteredCounselorTasks.filter((t) => t.taskType === 'staff');
  const counselorStudentTasks = filteredCounselorTasks.filter((t) => t.taskType === 'student');
  const counselorOpenCount = allCounselorTasks.filter((t) => t.status === 'open').length;
  const counselorCompletedCount = allCounselorTasks.filter((t) => t.status === 'completed').length;

  const pendingActions = suggestedActions.filter((a) => a.status === 'pending');

  // Group tasks by student for counselor-wide display
  const groupedStaffTasks = groupTasksByStudent(counselorStaffTasks);
  const groupedStudentTasks = groupTasksByStudent(counselorStudentTasks);

  // Meeting handlers
  const handleStartTranscribing = () => {
    setIsStudentPickerOpen(true);
  };

  const handleStudentSelected = (selectedStudentId: string, studentName: string) => {
    setIsStudentPickerOpen(false);
    const newInteraction = addInteraction({
      studentId: selectedStudentId,
      title: `Meeting with ${studentName.split(' ')[0]}`,
    });
    startMeeting(selectedStudentId, studentName, newInteraction.id, newInteraction.title);
    router.push(`/students/${selectedStudentId}/interactions/${newInteraction.id}`);
  };

  const handleMeetingClick = (meetingStudentId: string, interactionId: string) => {
    router.push(`/students/${meetingStudentId}/interactions/${interactionId}`);
  };

  const handleStopRecording = () => {
    endMeeting();
  };

  const handleViewMeeting = () => {
    if (activeMeeting) {
      router.push(`/students/${activeMeeting.studentId}/interactions/${activeMeeting.interactionId}`);
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
        <Tab value="meetings" label="Meetings" />
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
                All tasks and follow-ups across your students.
              </Typography>
            </Box>

            {/* Tasks Filter - only show when there are tasks */}
            {allCounselorTasks.length > 0 && (
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                <SubTabNavigation
                  options={[
                    { value: 'open', label: `Open (${counselorOpenCount})` },
                    { value: 'completed', label: `Completed (${counselorCompletedCount})` },
                  ]}
                  value={taskFilter}
                  onChange={(v) => setTaskFilter(v as 'open' | 'completed')}
                />
              </Box>
            )}

            {/* Tasks list */}
            <Box sx={{ flex: 1, px: 2, py: 1, overflowY: 'auto' }}>
              {filteredCounselorTasks.length === 0 ? (
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
                    {taskFilter === 'open' ? 'Tasks and follow-ups across all students will show up here.' : ''}
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Counselor Tasks grouped by student */}
                  {groupedStaffTasks.length > 0 && (
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
                      {groupedStaffTasks.map((group) => (
                        <Box key={group.studentId} sx={{ mb: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#155E4C',
                              mb: 0.5,
                            }}
                          >
                            {group.studentName}
                          </Typography>
                          {group.tasks.map((task) => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              onToggle={() => contextToggleTask(task.studentId, task.id)}
                              onDelete={() => contextDeleteTask(task.studentId, task.id)}
                            />
                          ))}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Student Tasks grouped by student */}
                  {groupedStudentTasks.length > 0 && (
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
                      {groupedStudentTasks.map((group) => (
                        <Box key={group.studentId} sx={{ mb: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#155E4C',
                              mb: 0.5,
                            }}
                          >
                            {group.studentName}
                          </Typography>
                          {group.tasks.map((task) => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              onToggle={() => contextToggleTask(task.studentId, task.id)}
                              onDelete={() => contextDeleteTask(task.studentId, task.id)}
                            />
                          ))}
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Meetings Tab Content */}
        {activeTab === 'meetings' && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {activeMeeting ? (
              <ActiveMeetingPanel
                activeMeeting={activeMeeting}
                onStopRecording={handleStopRecording}
                onViewMeeting={handleViewMeeting}
              />
            ) : (
              <CounselorMeetingsList
                onStartTranscribing={handleStartTranscribing}
                onMeetingClick={handleMeetingClick}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Student Picker Modal */}
      <StudentPickerModal
        open={isStudentPickerOpen}
        onClose={() => setIsStudentPickerOpen(false)}
        onSelectStudent={handleStudentSelected}
        preselectedStudentId={currentStudentId}
      />
    </Box>
  );
}

function groupTasksByStudent(tasks: TaskWithStudent[]): { studentId: string; studentName: string; tasks: TaskWithStudent[] }[] {
  const groups = new Map<string, { studentName: string; tasks: TaskWithStudent[] }>();
  tasks.forEach((task) => {
    const existing = groups.get(task.studentId);
    if (existing) {
      existing.tasks.push(task);
    } else {
      groups.set(task.studentId, { studentName: task.studentName, tasks: [task] });
    }
  });
  return Array.from(groups.entries()).map(([studentId, group]) => ({
    studentId,
    studentName: group.studentName,
    tasks: group.tasks,
  }));
}

export default SidePanel;
