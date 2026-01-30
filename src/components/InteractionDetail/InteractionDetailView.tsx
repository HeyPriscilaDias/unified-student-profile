'use client';

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Menu, MenuItem, IconButton, TextField } from '@mui/material';
import { Users, FileEdit, CheckSquare, Mic, Plus, Trash2, RefreshCw, Copy, Sparkles, Calendar, MoreVertical, CheckCheck, Target, ChevronRight } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSection } from '@/components/shared';
import { SidePanel } from '@/components/SidePanel';
import { useStudentData } from '@/hooks/useStudentData';
import { useInteractions, useInteractionsContext } from '@/contexts/InteractionsContext';
import { useTasks, useTasksContext } from '@/contexts/TasksContext';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { usePersistentRightPanelTab } from '@/hooks/usePersistentRightPanelTab';
import { InteractionHeader } from './InteractionHeader';
import { TranscriptSection } from './TranscriptSection';
import { AddAttendeesModal } from './AddAttendeesModal';
import { TranscriptionBanner } from '@/components/TranscriptionBanner';
import type { Task, SuggestedAction, Interaction, InteractionStatus, InteractionRecommendedAction } from '@/types/student';
import type { BreadcrumbItem } from '@/components/Breadcrumbs';

interface InteractionDetailViewProps {
  studentId: string;
  interactionId: string;
}

// Section header component for consistent styling
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box sx={{ color: '#374151', display: 'flex' }}>{icon}</Box>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
        {title}
      </Typography>
    </Box>
  );
}

export function InteractionDetailView({ studentId, interactionId }: InteractionDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentData = useStudentData(studentId);
  const showSummaryParam = searchParams.get('showSummary') === 'true';
  const [notes, setNotes] = useState('');
  const [isAddAttendeesModalOpen, setIsAddAttendeesModalOpen] = useState(false);
  const [sidePanelTab, setSidePanelTab] = usePersistentRightPanelTab('alma');
  const [localSuggestedActions, setLocalSuggestedActions] = useState<SuggestedAction[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [acceptedActionIds, setAcceptedActionIds] = useState<Set<string>>(new Set());
  const [meetingTasks, setMeetingTasks] = useState<Array<{ id: string; title: string; assignee: 'staff' | 'student'; dueDate?: string; isEditing?: boolean; smartGoalId?: string }>>([]);
  const [taskMenuAnchor, setTaskMenuAnchor] = useState<{ element: HTMLElement; taskId: string } | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [goalSubmenuAnchor, setGoalSubmenuAnchor] = useState<HTMLElement | null>(null);
  const { updateInteraction, updateInteractionSummary, updateInteractionWithRecording, updateInteractionStatus, updateInteractionAttendees, deleteInteraction, addInteraction } = useInteractionsContext();
  const { addTask, updateTask, toggleTask, deleteTask } = useTasksContext();
  const { activeMeeting, startMeeting, setPhase } = useActiveMeetingContext();

  // Check if this interaction is currently being recorded
  const isRecording = activeMeeting?.interactionId === interactionId && activeMeeting?.phase === 'recording';

  // Track if we've already started processing to avoid canceling on URL change
  const isProcessingRef = useRef(false);

  // Handle showSummary param - triggered when recording stops from SidePanel
  useEffect(() => {
    if (showSummaryParam && !isProcessingRef.current) {
      isProcessingRef.current = true;

      // Clean up the URL immediately
      router.replace(`/students/${studentId}/interactions/${interactionId}`, { scroll: false });

      const MOCK_SUMMARY = `Discussed the FAFSA application process and financial aid options with the student. Reviewed key deadlines and next steps for completing the application successfully.

<ul>
<li>Discussed the <strong>FAFSA application process</strong> and financial aid options.</li>
<li>Reviewed <strong>key deadlines</strong> including the <strong>March 2nd</strong> state priority deadline.</li>
</ul>`;

      const MOCK_TRANSCRIPT = `Counselor: Good morning! Thanks for coming in today. I wanted to go over the FAFSA process with you since the application window is now open.

Student: Hi! Yes, I've been meaning to ask about this. My parents keep asking me when we need to fill it out.

Counselor: Great question. The FAFSA opened on December 31st, and I always recommend completing it as early as possible.`;

      const MOCK_ACTION_ITEMS = [
        { id: 'action-1', title: 'Send list of scholarship opportunities', priority: 'medium' as const, status: 'pending' as const, assignee: 'staff' as const },
        { id: 'action-2', title: 'Create FSA ID at studentaid.gov', priority: 'medium' as const, status: 'pending' as const, assignee: 'student' as const },
      ];

      // Simulate processing delay so user can see the summarizing modal
      setTimeout(() => {
        updateInteractionWithRecording(studentId, interactionId, {
          summary: MOCK_SUMMARY,
          transcript: MOCK_TRANSCRIPT,
          actionItems: MOCK_ACTION_ITEMS,
        });
        // Keep banner in stopped state so user can resume if needed
        setPhase('stopped');
        isProcessingRef.current = false;
      }, 2500);
    }
  }, [showSummaryParam, studentId, interactionId, updateInteractionWithRecording, setPhase, router]);

  // Use interactions from context
  const interactions = useInteractions(studentId, studentData?.interactions || []);
  const tasks = useTasks(studentId, studentData?.tasks ?? []);

  // Initialize suggested actions from student data
  useEffect(() => {
    if (studentData) {
      setLocalSuggestedActions(studentData.suggestedActions);
    }
  }, [studentData]);

  const interaction = useMemo(() => {
    return interactions.find((m) => m.id === interactionId) || null;
  }, [interactions, interactionId]);

  // Initialize notes from interaction
  useEffect(() => {
    if (interaction?.summary !== undefined) {
      setNotes(interaction.summary || '');
    }
  }, [interaction?.summary]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    updateInteractionSummary(studentId, interactionId, newNotes);
  }, [studentId, interactionId, updateInteractionSummary]);

  const handleStatusChange = useCallback((status: InteractionStatus) => {
    updateInteractionStatus(studentId, interactionId, status);
  }, [studentId, interactionId, updateInteractionStatus]);

  const handleDateChange = useCallback((date: string | undefined) => {
    updateInteraction({
      id: interactionId,
      studentId,
      interactionDate: date,
    });
  }, [studentId, interactionId, updateInteraction]);

  const handleSaveAttendees = useCallback((attendees: string[]) => {
    updateInteractionAttendees(studentId, interactionId, attendees);
  }, [studentId, interactionId, updateInteractionAttendees]);

  const handleStartRecording = useCallback(() => {
    if (!studentData || !interaction) return;
    const studentName = `${studentData.student.firstName} ${studentData.student.lastName}`;
    startMeeting(
      studentId,
      studentName,
      studentData.student.avatarUrl,
      interactionId,
      interaction.title,
      interaction.summary
    );
  }, [studentData, interaction, studentId, interactionId, startMeeting]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteInteraction(studentId, interactionId);
      router.push(`/students/${studentId}?tab=interactions`);
    }
  };

  const handleTaskToggle = (task: Task) => {
    toggleTask(studentId, task.id);
  };

  const handleNewTask = (title: string) => {
    addTask({
      studentId,
      title,
      source: 'manual',
    });
  };

  const handleTaskEdit = (taskId: string, newTitle: string) => {
    updateTask(studentId, taskId, { title: newTitle });
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(studentId, taskId);
  };

  const handleActionAccept = (action: SuggestedAction) => {
    addTask({
      studentId,
      title: action.title,
      source: 'suggested_action',
    });
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'accepted' } : a
      )
    );
  };

  const handleActionDismiss = (action: SuggestedAction) => {
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'dismissed' } : a
      )
    );
  };

  const handleAcceptRecommendedAction = useCallback((action: InteractionRecommendedAction) => {
    // Add task to the tasks context
    addTask({
      studentId,
      title: action.title,
      source: 'interaction',
      taskType: action.assignee,
    });
    // Track this action as accepted locally
    setAcceptedActionIds(prev => new Set(prev).add(action.id));
    // Also add to meeting tasks for display
    setMeetingTasks(prev => [...prev, {
      id: `meeting-task-${Date.now()}`,
      title: action.title,
      assignee: action.assignee,
    }]);
  }, [addTask, studentId]);

  const handleAddMeetingTask = useCallback((assignee: 'staff' | 'student') => {
    const newTaskId = `meeting-task-${Date.now()}`;
    setMeetingTasks(prev => [...prev, {
      id: newTaskId,
      title: '',
      assignee,
      isEditing: true,
    }]);
    setEditingTaskId(newTaskId);
  }, []);

  const handleSaveTaskTitle = useCallback((taskId: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      // Remove task if title is empty
      setMeetingTasks(prev => prev.filter(t => t.id !== taskId));
    } else {
      // Save the title and add to tasks context
      setMeetingTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, title: trimmedTitle, isEditing: false } : t
      ));
      const task = meetingTasks.find(t => t.id === taskId);
      if (task && !task.title) {
        // Only add to context if it's a new task (empty title before)
        addTask({
          studentId,
          title: trimmedTitle,
          source: 'manual',
          taskType: task.assignee,
        });
      }
    }
    setEditingTaskId(null);
  }, [addTask, studentId, meetingTasks]);

  const handleTaskTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, taskId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTaskTitle(taskId, (e.target as HTMLInputElement).value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Cancel editing - remove if new (empty title), otherwise revert
      const task = meetingTasks.find(t => t.id === taskId);
      if (task && !task.title) {
        setMeetingTasks(prev => prev.filter(t => t.id !== taskId));
      } else {
        setMeetingTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, isEditing: false } : t
        ));
      }
      setEditingTaskId(null);
    }
  }, [handleSaveTaskTitle, meetingTasks]);

  const handleDeleteMeetingTask = useCallback((taskId: string) => {
    setMeetingTasks(prev => prev.filter(t => t.id !== taskId));
    setTaskMenuAnchor(null);
  }, []);

  const handleLinkTaskToGoal = useCallback((taskId: string, goalId: string) => {
    setMeetingTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, smartGoalId: goalId } : t
    ));
    setGoalSubmenuAnchor(null);
    setTaskMenuAnchor(null);
  }, []);

  const handleUnlinkTaskFromGoal = useCallback((taskId: string) => {
    setMeetingTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, smartGoalId: undefined } : t
    ));
    setGoalSubmenuAnchor(null);
    setTaskMenuAnchor(null);
  }, []);

  // Get active goals for linking
  const activeGoals = useMemo(() => {
    return studentData?.smartGoals?.filter(g => g.status === 'active') || [];
  }, [studentData?.smartGoals]);

  const handleGenerateSummary = useCallback(() => {
    if (!notes.trim()) return;

    setIsGeneratingSummary(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const MOCK_AI_SUMMARY = {
        overview: `Student is making progress on their academic and career goals. Discussion covered current challenges, upcoming deadlines, and strategies for success. The student demonstrated engagement and willingness to follow through on action items.

<ul>
<li>Strong engagement with academic planning and goal-setting activities.</li>
<li>Good progress on previously identified action items and next steps.</li>
</ul>`,
        keyPoints: [
          'Student is making good progress on their goals',
          'Several action items were identified for follow-up',
        ],
        recommendedActions: [
          { id: `action-${Date.now()}-1`, title: 'Schedule follow-up meeting', priority: 'medium' as const, status: 'pending' as const, assignee: 'staff' as const },
          { id: `action-${Date.now()}-2`, title: 'Review shared resources', priority: 'low' as const, status: 'pending' as const, assignee: 'student' as const },
        ],
        generatedAt: new Date().toISOString(),
      };

      updateInteraction({
        id: interactionId,
        studentId,
        aiSummary: MOCK_AI_SUMMARY,
      });

      setIsGeneratingSummary(false);
    }, 2000);
  }, [notes, studentId, interactionId, updateInteraction]);

  // Loading state
  if (!studentData) {
    return (
      <AppLayout>
        <Box sx={{ p: 3 }}>
          <LoadingSection variant="card" />
        </Box>
      </AppLayout>
    );
  }

  // Interaction not found
  if (!interaction) {
    return (
      <AppLayout
        breadcrumbs={[
          { label: `${studentData.student.firstName} ${studentData.student.lastName}`, href: `/students/${studentId}` },
          { label: 'Meeting not found' },
        ]}
      >
        <Typography variant="h6" color="error">
          Interaction not found
        </Typography>
      </AppLayout>
    );
  }

  const isCompleted = interaction.status === 'completed';
  const hasTranscript = !!interaction.transcript;
  const hasAISummary = !!interaction.aiSummary;
  const studentName = `${studentData.student.firstName} ${studentData.student.lastName}`;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: studentName, href: `/students/${studentId}` },
    { label: 'Meetings', href: `/students/${studentId}?tab=meetings` },
    { label: interaction.title },
  ];

  return (
    <AppLayout
      rightPanel={
        <SidePanel
          studentFirstName={studentData.student.firstName}
          tasks={tasks}
          suggestedActions={localSuggestedActions}
          studentId={studentId}
          currentStudentId={studentId}
          activeTab={sidePanelTab}
          onTabChange={setSidePanelTab}
          onTaskToggle={handleTaskToggle}
          onNewTask={handleNewTask}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={handleTaskDelete}
          onActionAccept={handleActionAccept}
          onActionDismiss={handleActionDismiss}
        />
      }
      currentStudentId={studentId}
      breadcrumbs={breadcrumbs}
    >
      <Box sx={{ pb: !isCompleted && !isRecording ? '80px' : 0 }}>
        {/* Header */}
        <InteractionHeader
          interaction={interaction}
          onStatusChange={handleStatusChange}
          onDateChange={handleDateChange}
        />

        {/* Attendees Section */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader icon={<Users size={18} />} title="Attendees" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '14px', color: '#374151' }}>
              You, {studentName}
              {interaction.attendees && interaction.attendees.length > 0 && (
                <>, {interaction.attendees.join(', ')}</>
              )}
            </Typography>
            <Button
              startIcon={<Plus size={14} />}
              onClick={() => setIsAddAttendeesModalOpen(true)}
              sx={{
                textTransform: 'none',
                fontSize: '14px',
                color: '#6B7280',
                p: 0,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#374151',
                },
              }}
            >
              Add people
            </Button>
          </Box>
        </Box>

        {/* Notes & Talking Points Section */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader icon={<FileEdit size={18} />} title="Notes & talking points" />
          <Box
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = e.currentTarget.innerHTML;
              if (newContent !== notes) {
                setNotes(newContent);
                updateInteractionSummary(studentId, interactionId, newContent);
              }
            }}
            dangerouslySetInnerHTML={{ __html: notes || '' }}
            sx={{
              width: '100%',
              minHeight: '200px',
              p: 2,
              fontSize: '14px',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              color: '#374151',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              outline: 'none',
              '&:focus': {
                borderColor: '#9CA3AF',
              },
              '&:empty::before': {
                content: '"Talking points:\\A• How things are going overall (school, stress, workload)\\A• What\'s top of mind right now\\A• Anything blocking progress (academic, personal, logistical)"',
                whiteSpace: 'pre-wrap',
                color: '#9CA3AF',
              },
              '& h1, & h2, & h3, & h4': { fontSize: '15px', fontWeight: 600, mt: 2, mb: 1, '&:first-of-type': { mt: 0 } },
              '& ul, & ol': { pl: 2.5, mb: 2 },
              '& li': { mb: 0.5 },
              '& p': { mb: 1.5 },
              '& strong': { fontWeight: 600 },
            }}
          />
        </Box>

        {/* AI Summary Section */}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: '#252B37', display: 'flex' }}><Alma size={16} /></Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#252B37' }}>
              AI Summary
            </Typography>
          </Box>
          {hasAISummary ? (
            <Box
              sx={{
                backgroundColor: '#F5F8FF',
                border: '1px solid #C6D7FD',
                borderRadius: '12px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  fontSize: '14px',
                  color: '#252B37',
                  lineHeight: '20px',
                  '& ul': { pl: 2.5, mt: 2, mb: 0 },
                  '& li': { mb: 0.5 },
                }}
                dangerouslySetInnerHTML={{ __html: interaction.aiSummary?.overview || '' }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshCw size={16} style={isGeneratingSummary ? { animation: 'spin 1s linear infinite' } : undefined} />}
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  sx={{
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#414651',
                    borderColor: '#D5D7DA',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    minHeight: 32,
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: 'white',
                    },
                    '&:disabled': {
                      color: '#9CA3AF',
                      borderColor: '#E5E7EB',
                    },
                  }}
                >
                  {isGeneratingSummary ? 'Updating...' : 'Update'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const text = interaction.aiSummary?.overview?.replace(/<[^>]*>/g, '') || '';
                    navigator.clipboard.writeText(text);
                  }}
                  sx={{
                    minWidth: 32,
                    width: 32,
                    height: 32,
                    p: 0,
                    borderColor: '#D5D7DA',
                    borderRadius: '8px',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: 'white',
                    },
                  }}
                >
                  <Copy size={16} color="#414651" />
                </Button>
              </Box>
            </Box>
          ) : notes.trim() ? (
            <Box>
              <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 2 }}>
                Generate a summary based on your notes and talking points.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Sparkles size={16} />}
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                sx={{
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: '#155E4C',
                  color: '#fff',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#0E4A3B',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    backgroundColor: '#9CA3AF',
                  },
                }}
              >
                {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
              </Button>
            </Box>
          ) : (
            <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
              Add notes above or transcribe the meeting so Alma generates a summary.
            </Typography>
          )}
        </Box>

        {/* Tasks Section */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckSquare size={16} color="#252B37" />
            <Typography
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                color: '#252B37',
                letterSpacing: '-0.5px',
                lineHeight: '24px',
              }}
            >
              Tasks
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* For you (Staff) Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#252B37',
                  lineHeight: '20px',
                }}
              >
                For you
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Pending suggested tasks (lavender) */}
                {interaction.aiSummary?.recommendedActions
                  ?.filter(a => a.assignee === 'staff' && !acceptedActionIds.has(a.id))
                  .map((action) => (
                    <Box
                      key={action.id}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                        p: 2,
                        backgroundColor: '#F5F8FF',
                        border: '1px solid #C6D7FD',
                        borderRadius: '12px',
                      }}
                    >
                      {/* Radio button */}
                      <Box sx={{ p: '2px', flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '100px',
                            border: '1.5px solid #A4A7AE',
                            backgroundColor: 'white',
                          }}
                        />
                      </Box>
                      {/* Task info */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#252B37',
                            lineHeight: '20px',
                          }}
                        >
                          {action.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Calendar size={20} color="#717680" />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              color: '#717680',
                              lineHeight: '20px',
                              cursor: 'pointer',
                              '&:hover': { color: '#414651' },
                            }}
                          >
                            Add deadline
                          </Typography>
                        </Box>
                      </Box>
                      {/* Accept button */}
                      <Button
                        variant="outlined"
                        startIcon={<CheckCheck size={20} />}
                        onClick={() => handleAcceptRecommendedAction(action)}
                        sx={{
                          textTransform: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#414651',
                          backgroundColor: 'white',
                          borderColor: '#D5D7DA',
                          borderRadius: '8px',
                          px: 1.5,
                          py: 0.75,
                          minHeight: 32,
                          flexShrink: 0,
                          '&:hover': {
                            borderColor: '#9CA3AF',
                            backgroundColor: 'white',
                          },
                        }}
                      >
                        Accept
                      </Button>
                    </Box>
                  ))}

                {/* Accepted/manual tasks (white) */}
                {meetingTasks
                  .filter(t => t.assignee === 'staff')
                  .map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                        p: 2,
                        backgroundColor: 'white',
                        border: '1px solid #D5D7DA',
                        borderRadius: '12px',
                      }}
                    >
                      {/* Radio button */}
                      <Box sx={{ p: '2px', flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '100px',
                            border: '1.5px solid #A4A7AE',
                            backgroundColor: 'white',
                          }}
                        />
                      </Box>
                      {/* Task info */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {editingTaskId === task.id ? (
                          <TextField
                            autoFocus
                            defaultValue={task.title}
                            placeholder="Enter task title..."
                            variant="standard"
                            fullWidth
                            onBlur={(e) => handleSaveTaskTitle(task.id, e.target.value)}
                            onKeyDown={(e) => handleTaskTitleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, task.id)}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                fontSize: '14px',
                                color: '#252B37',
                                lineHeight: '20px',
                              },
                            }}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: 0,
                              },
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#252B37',
                              lineHeight: '20px',
                            }}
                          >
                            {task.title}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Calendar size={20} color="#717680" />
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#717680',
                                lineHeight: '20px',
                                cursor: 'pointer',
                                '&:hover': { color: '#414651' },
                              }}
                            >
                              {task.dueDate || 'Add deadline'}
                            </Typography>
                          </Box>
                          {task.smartGoalId && (() => {
                            const linkedGoal = activeGoals.find(g => g.id === task.smartGoalId);
                            return linkedGoal ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  backgroundColor: '#FEF3C7',
                                  borderRadius: '4px',
                                  px: 1,
                                  py: 0.25,
                                }}
                              >
                                <Target size={12} color="#D97706" />
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    color: '#92400E',
                                    lineHeight: '16px',
                                    maxWidth: 120,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {linkedGoal.title}
                                </Typography>
                              </Box>
                            ) : null;
                          })()}
                        </Box>
                      </Box>
                      {/* Kebab menu */}
                      {!editingTaskId || editingTaskId !== task.id ? (
                        <IconButton
                          size="small"
                          onClick={(e) => setTaskMenuAnchor({ element: e.currentTarget, taskId: task.id })}
                          sx={{
                            width: 36,
                            height: 36,
                            color: '#414651',
                          }}
                        >
                          <MoreVertical size={24} />
                        </IconButton>
                      ) : null}
                    </Box>
                  ))}
              </Box>
              {/* Add a task link */}
              <Box
                onClick={() => handleAddMeetingTask('staff')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  '&:hover': { '& p': { color: '#414651' }, '& svg': { color: '#414651' } },
                }}
              >
                <Plus size={16} color="#717680" />
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#717680',
                    lineHeight: '20px',
                  }}
                >
                  Add a task
                </Typography>
              </Box>
            </Box>

            {/* For your student Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#252B37',
                  lineHeight: '20px',
                }}
              >
                For your student
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Pending suggested tasks (lavender) */}
                {interaction.aiSummary?.recommendedActions
                  ?.filter(a => a.assignee === 'student' && !acceptedActionIds.has(a.id))
                  .map((action) => (
                    <Box
                      key={action.id}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                        p: 2,
                        backgroundColor: '#F5F8FF',
                        border: '1px solid #C6D7FD',
                        borderRadius: '12px',
                      }}
                    >
                      {/* Radio button */}
                      <Box sx={{ p: '2px', flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '100px',
                            border: '1.5px solid #A4A7AE',
                            backgroundColor: 'white',
                          }}
                        />
                      </Box>
                      {/* Task info */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#252B37',
                            lineHeight: '20px',
                          }}
                        >
                          {action.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Calendar size={20} color="#717680" />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              color: '#717680',
                              lineHeight: '20px',
                              cursor: 'pointer',
                              '&:hover': { color: '#414651' },
                            }}
                          >
                            Add deadline
                          </Typography>
                        </Box>
                      </Box>
                      {/* Accept button */}
                      <Button
                        variant="outlined"
                        startIcon={<CheckCheck size={20} />}
                        onClick={() => handleAcceptRecommendedAction(action)}
                        sx={{
                          textTransform: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#414651',
                          backgroundColor: 'white',
                          borderColor: '#D5D7DA',
                          borderRadius: '8px',
                          px: 1.5,
                          py: 0.75,
                          minHeight: 32,
                          flexShrink: 0,
                          '&:hover': {
                            borderColor: '#9CA3AF',
                            backgroundColor: 'white',
                          },
                        }}
                      >
                        Accept
                      </Button>
                    </Box>
                  ))}

                {/* Accepted/manual tasks (white) */}
                {meetingTasks
                  .filter(t => t.assignee === 'student')
                  .map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                        p: 2,
                        backgroundColor: 'white',
                        border: '1px solid #D5D7DA',
                        borderRadius: '12px',
                      }}
                    >
                      {/* Radio button */}
                      <Box sx={{ p: '2px', flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '100px',
                            border: '1.5px solid #A4A7AE',
                            backgroundColor: 'white',
                          }}
                        />
                      </Box>
                      {/* Task info */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {editingTaskId === task.id ? (
                          <TextField
                            autoFocus
                            defaultValue={task.title}
                            placeholder="Enter task title..."
                            variant="standard"
                            fullWidth
                            onBlur={(e) => handleSaveTaskTitle(task.id, e.target.value)}
                            onKeyDown={(e) => handleTaskTitleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, task.id)}
                            InputProps={{
                              disableUnderline: true,
                              sx: {
                                fontSize: '14px',
                                color: '#252B37',
                                lineHeight: '20px',
                              },
                            }}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: 0,
                              },
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#252B37',
                              lineHeight: '20px',
                            }}
                          >
                            {task.title}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Calendar size={20} color="#717680" />
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#717680',
                                lineHeight: '20px',
                                cursor: 'pointer',
                                '&:hover': { color: '#414651' },
                              }}
                            >
                              {task.dueDate || 'Add deadline'}
                            </Typography>
                          </Box>
                          {task.smartGoalId && (() => {
                            const linkedGoal = activeGoals.find(g => g.id === task.smartGoalId);
                            return linkedGoal ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  backgroundColor: '#FEF3C7',
                                  borderRadius: '4px',
                                  px: 1,
                                  py: 0.25,
                                }}
                              >
                                <Target size={12} color="#D97706" />
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    color: '#92400E',
                                    lineHeight: '16px',
                                    maxWidth: 120,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {linkedGoal.title}
                                </Typography>
                              </Box>
                            ) : null;
                          })()}
                        </Box>
                      </Box>
                      {/* Kebab menu */}
                      {!editingTaskId || editingTaskId !== task.id ? (
                        <IconButton
                          size="small"
                          onClick={(e) => setTaskMenuAnchor({ element: e.currentTarget, taskId: task.id })}
                          sx={{
                            width: 36,
                            height: 36,
                            color: '#414651',
                          }}
                        >
                          <MoreVertical size={24} />
                        </IconButton>
                      ) : null}
                    </Box>
                  ))}
              </Box>
              {/* Add a task link */}
              <Box
                onClick={() => handleAddMeetingTask('student')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  '&:hover': { '& p': { color: '#414651' }, '& svg': { color: '#414651' } },
                }}
              >
                <Plus size={16} color="#717680" />
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#717680',
                    lineHeight: '20px',
                  }}
                >
                  Add a task
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Task Menu */}
          <Menu
            anchorEl={taskMenuAnchor?.element}
            open={Boolean(taskMenuAnchor)}
            onClose={() => {
              setTaskMenuAnchor(null);
              setGoalSubmenuAnchor(null);
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                borderRadius: '8px',
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
                minWidth: 180,
              },
            }}
          >
            {/* Link to goal option */}
            {activeGoals.length > 0 && (
              <MenuItem
                onClick={(e) => setGoalSubmenuAnchor(e.currentTarget)}
                sx={{
                  fontSize: '14px',
                  color: '#374151',
                  display: 'flex',
                  justifyContent: 'space-between',
                  '&:hover': { backgroundColor: '#F9FAFB' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Target size={16} style={{ marginRight: 8, color: '#D97706' }} />
                  Link to goal
                </Box>
                <ChevronRight size={16} color="#9CA3AF" />
              </MenuItem>
            )}
            {/* Unlink from goal option - only show if task has a goal */}
            {taskMenuAnchor && meetingTasks.find(t => t.id === taskMenuAnchor.taskId)?.smartGoalId && (
              <MenuItem
                onClick={() => taskMenuAnchor && handleUnlinkTaskFromGoal(taskMenuAnchor.taskId)}
                sx={{
                  fontSize: '14px',
                  color: '#374151',
                  '&:hover': { backgroundColor: '#F9FAFB' },
                }}
              >
                <Target size={16} style={{ marginRight: 8, color: '#9CA3AF' }} />
                Unlink from goal
              </MenuItem>
            )}
            <MenuItem
              onClick={() => taskMenuAnchor && handleDeleteMeetingTask(taskMenuAnchor.taskId)}
              sx={{
                fontSize: '14px',
                color: '#DC2626',
                '&:hover': { backgroundColor: '#FEF2F2' },
              }}
            >
              <Trash2 size={16} style={{ marginRight: 8 }} />
              Delete task
            </MenuItem>
          </Menu>

          {/* Goal Submenu */}
          <Menu
            anchorEl={goalSubmenuAnchor}
            open={Boolean(goalSubmenuAnchor)}
            onClose={() => setGoalSubmenuAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              sx: {
                borderRadius: '8px',
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
                minWidth: 200,
                maxWidth: 300,
                ml: 0.5,
              },
            }}
          >
            {activeGoals.map((goal) => {
              const isLinked = taskMenuAnchor && meetingTasks.find(t => t.id === taskMenuAnchor.taskId)?.smartGoalId === goal.id;
              return (
                <MenuItem
                  key={goal.id}
                  onClick={() => taskMenuAnchor && handleLinkTaskToGoal(taskMenuAnchor.taskId, goal.id)}
                  sx={{
                    fontSize: '14px',
                    color: '#374151',
                    backgroundColor: isLinked ? '#FEF3C7' : 'transparent',
                    '&:hover': { backgroundColor: isLinked ? '#FDE68A' : '#F9FAFB' },
                  }}
                >
                  <Target size={16} style={{ marginRight: 8, color: '#D97706', flexShrink: 0 }} />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {goal.title}
                  </Typography>
                </MenuItem>
              );
            })}
          </Menu>
        </Box>

        {/* Transcript Section */}
        <Box sx={{ mt: 4 }}>
          {hasTranscript ? (
            <TranscriptSection transcript={interaction.transcript!} />
          ) : (
            <>
            <SectionHeader icon={<Mic size={18} />} title="Transcript" />
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              {isCompleted ? 'This meeting was not transcribed.' : "When you transcribe a meeting, you'll find its transcript here."}
            </Typography>
            </>
          )}
        </Box>

        {/* Delete meeting */}
        {!isRecording && (
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #E5E7EB' }}>
            <Button
              variant="text"
              startIcon={<Trash2 size={16} />}
              onClick={handleDelete}
              sx={{
                textTransform: 'none',
                color: '#DC2626',
                '&:hover': {
                  backgroundColor: '#FEF2F2',
                },
              }}
            >
              Delete meeting
            </Button>
          </Box>
        )}

        {/* Transcription Banner */}
        {!isCompleted && !isRecording && (
          <TranscriptionBanner
            interactionContext={{
              onStartRecording: handleStartRecording,
              meetingTitle: interaction.title,
              studentName: studentName,
              studentAvatarUrl: studentData.student.avatarUrl,
            }}
          />
        )}
      </Box>

      {/* Add Attendees Modal */}
      <AddAttendeesModal
        open={isAddAttendeesModalOpen}
        onClose={() => setIsAddAttendeesModalOpen(false)}
        onSave={handleSaveAttendees}
        currentAttendees={interaction.attendees || []}
      />
    </AppLayout>
  );
}

export default InteractionDetailView;
