'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Collapse, Skeleton } from '@mui/material';
import { Trash2, Mic, FileText } from 'lucide-react';
import { ActionItemsPanel } from '@/components/InteractionIntelligence';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSection, SectionCard } from '@/components/shared';
import { SidePanel, SidePanelTabType } from '@/components/SidePanel';
import { useStudentData } from '@/hooks/useStudentData';
import { useInteractions, useInteractionsContext } from '@/contexts/InteractionsContext';
import { useTasks, useTasksContext } from '@/contexts/TasksContext';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { usePersistentRightPanelTab } from '@/hooks/usePersistentRightPanelTab';
import { InteractionHeader } from './InteractionHeader';
import { NotesSection } from './NotesSection';
import { TranscriptSection } from './TranscriptSection';
import type { ExtractedActionItem } from '@/lib/geminiService';
import type { Task, SuggestedAction, Interaction, InteractionStatus } from '@/types/student';
import type { BreadcrumbItem } from '@/components/Breadcrumbs';

interface InteractionDetailViewProps {
  studentId: string;
  interactionId: string;
}

export function InteractionDetailView({ studentId, interactionId }: InteractionDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentData = useStudentData(studentId);
  const summaryModeParam = searchParams.get('mode') === 'summary';
  const showSummaryParam = searchParams.get('showSummary') === 'true';
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSummaryRevealed, setIsSummaryRevealed] = useState(false);
  const [sidePanelTab, setSidePanelTab] = usePersistentRightPanelTab('alma');
  const [localSuggestedActions, setLocalSuggestedActions] = useState<SuggestedAction[]>([]);
  const { updateInteraction, updateInteractionSummary, updateInteractionWithRecording, updateInteractionActionItems, updateInteractionStatus, deleteInteraction, addInteraction } = useInteractionsContext();
  const { addTask, updateTask, toggleTask, deleteTask } = useTasksContext();
  const { activeMeeting, startMeeting, endMeeting } = useActiveMeetingContext();

  // Check if this interaction is currently being recorded
  const isRecording = activeMeeting?.interactionId === interactionId && activeMeeting?.phase === 'recording';

  // Clean up the URL after reading the params
  useEffect(() => {
    if (summaryModeParam || showSummaryParam) {
      router.replace(`/students/${studentId}/interactions/${interactionId}`, { scroll: false });
    }
  }, [summaryModeParam, showSummaryParam, router, studentId, interactionId]);

  // Handle showSummary param - triggered when recording stops from SidePanel
  useEffect(() => {
    if (showSummaryParam && !isLoadingSummary && !isSummaryRevealed) {
      // Mock data for the summary (same as InteractionIntelligence)
      const MOCK_SUMMARY = `<h3>Meeting Overview</h3>
<ul>
<li>Discussed the <strong>FAFSA application process</strong> and financial aid options for the upcoming academic year</li>
<li>Reviewed <strong>key deadlines</strong> including the <strong>March 2nd</strong> state priority deadline</li>
<li>Assessed family financial situation to determine eligibility for various aid programs</li>
</ul>

<h3>Key Discussion Points</h3>
<ul>
<li><strong>FSA ID creation</strong> - Both student and one parent need to create accounts at studentaid.gov</li>
<li><strong>Required documents</strong> - 2024 tax returns, W-2 forms, and records of untaxed income</li>
<li><strong>Housing plans</strong> - Student plans to live in dorms, affecting cost of attendance calculation</li>
<li><strong>Dependency status</strong> - Filing as dependent student (parents' income will be considered)</li>
</ul>

<h3>Student Interests</h3>
<ul>
<li>Expressed interest in <strong>federal work-study</strong> as preferred employment option</li>
<li>Interested in receiving list of <strong>local scholarship opportunities</strong></li>
</ul>`;

      const MOCK_TRANSCRIPT = `Counselor: Good morning! Thanks for coming in today. I wanted to go over the FAFSA process with you since the application window is now open.

Student: Hi! Yes, I've been meaning to ask about this. My parents keep asking me when we need to fill it out.

Counselor: Great question. The FAFSA opened on December 31st, and I always recommend completing it as early as possible. Many states have priority deadlines, and some aid is distributed on a first-come, first-served basis.

Student: Oh, I didn't know that. What's our state's deadline?

Counselor: For us, the priority deadline is March 2nd. If you submit before then, you'll have the best chance at state grants and institutional aid. Have you or your parents created an FSA ID yet?

Student: No, what's that?

Counselor: The FSA ID is your electronic signature for the FAFSA. Both you and one parent will need one. You create it at studentaid.gov. I'd suggest doing that this week since it can take a few days to process.`;

      const MOCK_ACTION_ITEMS = [
        { id: 'action-1', title: 'Send list of scholarship opportunities to student', priority: 'medium' as const, status: 'pending' as const, assignee: 'staff' as const },
        { id: 'action-2', title: 'Schedule parent meeting to review dependency status', priority: 'medium' as const, status: 'pending' as const, assignee: 'staff' as const },
        { id: 'action-3', title: 'Create FSA ID at studentaid.gov', priority: 'medium' as const, status: 'pending' as const, assignee: 'student' as const },
        { id: 'action-4', title: 'Gather 2024 tax returns and W-2 forms from parents', priority: 'medium' as const, status: 'pending' as const, assignee: 'student' as const },
      ];

      // Save the mock data to the interaction
      updateInteractionWithRecording(studentId, interactionId, {
        summary: MOCK_SUMMARY,
        transcript: MOCK_TRANSCRIPT,
        actionItems: MOCK_ACTION_ITEMS,
      });

      // Show loading state then reveal
      setIsLoadingSummary(true);
      setIsSummaryRevealed(false);

      setTimeout(() => {
        setIsLoadingSummary(false);
        setIsSummaryRevealed(true);
        // End the meeting to dismiss the processing modal
        endMeeting();
      }, 2000);
    }
  }, [showSummaryParam, isLoadingSummary, isSummaryRevealed, studentId, interactionId, updateInteractionWithRecording, endMeeting]);

  // Use interactions from context (allows real-time updates)
  const interactions = useInteractions(studentId, studentData?.interactions || []);

  // Use tasks from context (allows real-time updates from interaction recordings)
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

  const handleSummaryChange = useCallback((summary: string) => {
    updateInteractionSummary(studentId, interactionId, summary);
  }, [studentId, interactionId, updateInteractionSummary]);

  // Handle adding counselor tasks - creates a real task
  const handleAddCounselorTask = useCallback((title: string) => {
    addTask({
      studentId,
      title,
      source: 'interaction',
    });
  }, [studentId, addTask]);

  // Handle adding student tasks - mock behavior (just logs)
  const handleAddStudentTask = useCallback((title: string) => {
    console.log('Added to student tasks:', title);
    // In a real app, this would create a task assigned to the student
  }, []);

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

  const handleStartRecording = useCallback(() => {
    if (!studentData || !interaction) return;
    const studentName = `${studentData.student.firstName} ${studentData.student.lastName}`;
    startMeeting(
      studentId,
      studentName,
      interactionId,
      interaction.title,
      interaction.summary
    );
  }, [studentData, interaction, studentId, interactionId, startMeeting]);

  const handleBack = () => {
    router.push(`/students/${studentId}?tab=interactions`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteInteraction(studentId, interactionId);
      router.push(`/students/${studentId}?tab=interactions`);
    }
  };

  // SidePanel handlers
  const handleCreateInteraction = () => {
    const newInteraction = addInteraction({
      studentId,
      title: `Meeting with ${studentData?.student.firstName || 'Student'}`,
      summary: '',
    });
    router.push(`/students/${studentId}/interactions/${newInteraction.id}`);
  };

  const handleInteractionClick = (clickedInteraction: Interaction) => {
    router.push(`/students/${clickedInteraction.studentId}/interactions/${clickedInteraction.id}`);
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

  // Convert stored InteractionRecommendedAction to ExtractedActionItem for ActionItemsPanel
  const actionItemsForPanel = useMemo((): ExtractedActionItem[] => {
    const storedActions = interaction?.aiSummary?.recommendedActions || [];
    return storedActions.map(action => ({
      id: action.id,
      text: action.title,
      assignee: action.assignee === 'staff' ? 'counselor' as const : 'student' as const,
      status: action.status === 'converted_to_task' ? 'added' as const : action.status as 'pending' | 'dismissed',
    }));
  }, [interaction?.aiSummary?.recommendedActions]);

  // Handle action items changes from ActionItemsPanel
  const handleActionItemsChange = useCallback((items: ExtractedActionItem[]) => {
    // Convert back to InteractionRecommendedAction format
    const recommendedActions = items.map(item => ({
      id: item.id,
      title: item.text,
      priority: 'medium' as const,
      status: item.status === 'added' ? 'converted_to_task' as const : item.status as 'pending' | 'dismissed',
      assignee: item.assignee === 'counselor' ? 'staff' as const : 'student' as const,
    }));
    updateInteractionActionItems(studentId, interactionId, recommendedActions);
  }, [studentId, interactionId, updateInteractionActionItems]);

  // Loading state
  if (!studentData) {
    return (
      <AppLayout>
        <Box sx={{ backgroundColor: '#FBFBFB', minHeight: '100vh', p: 3 }}>
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
  const hasRecording = !!interaction.recordingUrl || !!interaction.transcript;
  const showStartRecordingButton = !isRecording && !hasRecording && !isCompleted;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: `${studentData.student.firstName} ${studentData.student.lastName}`, href: `/students/${studentId}` },
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
      <Box>
          {/* Interaction Header */}
          <InteractionHeader
            interaction={interaction}
            showStartRecordingButton={showStartRecordingButton}
            onStartRecording={handleStartRecording}
            onStatusChange={handleStatusChange}
            onDateChange={handleDateChange}
          />

          {/* Notes - consolidated talking points and summary */}
          <Box sx={{ mt: 4 }}>
            {isLoadingSummary ? (
              <SectionCard title="Notes" icon={<FileText size={18} />}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Skeleton variant="text" width="90%" height={24} animation="wave" />
                  <Skeleton variant="text" width="100%" height={20} animation="wave" />
                  <Skeleton variant="text" width="85%" height={20} animation="wave" />
                  <Skeleton variant="text" width="95%" height={20} animation="wave" />
                  <Box sx={{ mt: 1 }}>
                    <Skeleton variant="text" width="40%" height={24} animation="wave" />
                    <Skeleton variant="text" width="80%" height={20} animation="wave" />
                    <Skeleton variant="text" width="75%" height={20} animation="wave" />
                  </Box>
                </Box>
              </SectionCard>
            ) : (
              <Collapse in={true} timeout={isSummaryRevealed ? 500 : 0} appear={isSummaryRevealed}>
                <NotesSection
                  notes={interaction.summary || ''}
                  onNotesChange={handleSummaryChange}
                  label="Notes"
                  placeholder="Add talking points, meeting notes, or any other details..."
                  readOnly={isCompleted}
                />
              </Collapse>
            )}
          </Box>

          {/* Action Items (if AI summary has recommended actions) */}
          {!isRecording && actionItemsForPanel.length > 0 && !isLoadingSummary && (
            <Collapse in={true} timeout={isSummaryRevealed ? 500 : 0} appear={isSummaryRevealed}>
              <Box sx={{ mt: 4 }}>
                <ActionItemsPanel
                  actionItems={actionItemsForPanel}
                  onActionItemsChange={handleActionItemsChange}
                  onAddCounselorTask={handleAddCounselorTask}
                  onAddStudentTask={handleAddStudentTask}
                />
              </Box>
            </Collapse>
          )}

          {/* Transcript */}
          {interaction.transcript && !isLoadingSummary ? (
            <Collapse in={true} timeout={isSummaryRevealed ? 500 : 0} appear={isSummaryRevealed}>
              <Box sx={{ mt: 4 }}>
                <TranscriptSection transcript={interaction.transcript} />
              </Box>
            </Collapse>
          ) : !isLoadingSummary && (
            <Box sx={{ mt: 4 }}>
              <SectionCard title="Transcript" icon={<Mic size={18} />}>
                <Typography sx={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>
                  {isCompleted
                    ? 'No recording was made for this interaction.'
                    : 'Record this interaction to see the transcript here.'}
                </Typography>
              </SectionCard>
            </Box>
          )}

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
        </Box>
    </AppLayout>
  );
}

export default InteractionDetailView;
