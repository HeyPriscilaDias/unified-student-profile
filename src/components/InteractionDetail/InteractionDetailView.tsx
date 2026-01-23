'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft, Trash2, Mic, FileText } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
import { InteractionIntelligence, ActionItemsPanel } from '@/components/InteractionIntelligence';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSection, SectionCard } from '@/components/shared';
import { SidePanel, SidePanelTabType } from '@/components/SidePanel';
import { AddInteractionPopover } from '@/components/ScheduleInteractionFlow';
import { useStudentData } from '@/hooks/useStudentData';
import { useInteractions, useInteractionsContext } from '@/contexts/InteractionsContext';
import { useTasks, useTasksContext } from '@/contexts/TasksContext';
import { usePersistentRightPanelTab } from '@/hooks/usePersistentRightPanelTab';
import { InteractionHeader } from './InteractionHeader';
import { NotesSection } from './NotesSection';
import { TranscriptSection } from './TranscriptSection';
import type { ExtractedActionItem } from '@/lib/geminiService';
import type { Task, SuggestedAction, Interaction } from '@/types/student';

interface InteractionDetailViewProps {
  studentId: string;
  interactionId: string;
}

export function InteractionDetailView({ studentId, interactionId }: InteractionDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentData = useStudentData(studentId);
  const startInteractionParam = searchParams.get('startInteraction') === 'true';
  const summaryModeParam = searchParams.get('mode') === 'summary';
  const [isInInteractionMode, setIsInInteractionMode] = useState(startInteractionParam);
  const [isGeneratingTalkingPoints, setIsGeneratingTalkingPoints] = useState(false);
  const [sidePanelTab, setSidePanelTab] = usePersistentRightPanelTab('alma');
  const [interactionPopoverAnchor, setInteractionPopoverAnchor] = useState<HTMLElement | null>(null);
  const [localSuggestedActions, setLocalSuggestedActions] = useState<SuggestedAction[]>([]);
  const { updateInteractionSummary, updateInteractionTalkingPoints, updateInteractionWithRecording, updateInteractionActionItems, markInteractionComplete, deleteInteraction, addInteraction } = useInteractionsContext();
  const { addTask, updateTask, toggleTask, deleteTask } = useTasksContext();

  // Clean up the URL after reading the params
  useEffect(() => {
    if (startInteractionParam || summaryModeParam) {
      router.replace(`/students/${studentId}/interactions/${interactionId}`, { scroll: false });
    }
  }, [startInteractionParam, summaryModeParam, router, studentId, interactionId]);

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

  const handleTalkingPointsChange = useCallback((talkingPoints: string) => {
    updateInteractionTalkingPoints(studentId, interactionId, talkingPoints);
  }, [studentId, interactionId, updateInteractionTalkingPoints]);

  const handleSummaryChange = useCallback((summary: string) => {
    updateInteractionSummary(studentId, interactionId, summary);
  }, [studentId, interactionId, updateInteractionSummary]);

  const handleRecordingCompleted = useCallback((data: {
    summary: string;
    transcript: string;
    actionItems: ExtractedActionItem[];
  }) => {
    // Convert ExtractedActionItem[] to InteractionRecommendedAction[]
    const recommendedActions = data.actionItems.map(item => ({
      id: item.id,
      title: item.text,
      priority: 'medium' as const,
      status: item.status === 'added' ? 'converted_to_task' as const : item.status as 'pending' | 'dismissed',
      assignee: item.assignee === 'counselor' ? 'staff' as const : 'student' as const,
    }));

    // Save everything to the interaction
    updateInteractionWithRecording(studentId, interactionId, {
      summary: data.summary,
      transcript: data.transcript,
      actionItems: recommendedActions,
    });
    setIsInInteractionMode(false);
  }, [studentId, interactionId, updateInteractionWithRecording]);

  // Handle adding counselor tasks - creates a real task
  const handleAddCounselorTask = useCallback((title: string) => {
    addTask({
      studentId,
      title,
      taskType: 'staff',
      source: 'interaction',
    });
  }, [studentId, addTask]);

  // Handle adding student tasks - mock behavior (just logs)
  const handleAddStudentTask = useCallback((title: string) => {
    console.log('Added to student tasks:', title);
    // In a real app, this would create a task assigned to the student
  }, []);

  const handleMarkComplete = useCallback(() => {
    markInteractionComplete(studentId, interactionId);
  }, [studentId, interactionId, markInteractionComplete]);

  const handleStartInteraction = useCallback(() => {
    setIsInInteractionMode(true);
  }, []);

  const handleCancelInteraction = useCallback(() => {
    setIsInInteractionMode(false);
  }, []);

  const handleBack = () => {
    router.push(`/students/${studentId}?tab=interactions`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this interaction?')) {
      deleteInteraction(studentId, interactionId);
      router.push(`/students/${studentId}?tab=interactions`);
    }
  };

  // SidePanel handlers
  const handleOpenAddInteractionPopover = (event: React.MouseEvent<HTMLElement>) => {
    setInteractionPopoverAnchor(event.currentTarget);
  };

  const handleCloseAddInteractionPopover = () => {
    setInteractionPopoverAnchor(null);
  };

  const handleCreateInteraction = (interactionDate: string) => {
    const newInteraction = addInteraction({
      studentId,
      title: `Interaction with ${studentData?.student.firstName || 'Student'}`,
      interactionDate,
      summary: '',
    });
    setInteractionPopoverAnchor(null);
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
      taskType: 'staff',
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
      taskType: 'staff',
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

  const handleGenerateTalkingPoints = useCallback(() => {
    if (!studentData || isGeneratingTalkingPoints) return;

    const { student, profile, milestones, tasks, smartGoals, bookmarks } = studentData;
    const html: string[] = [];

    // Always start with a check-in section
    html.push(`<h3>Check-in</h3>`);
    html.push(`<ul><li>How have things been going since we last met?</li><li>Any challenges or concerns to discuss?</li></ul>`);

    // Academic check-in
    const academicItems: string[] = [];
    if (student.gpa && student.gpa > 0) {
      academicItems.push(`<li>Current GPA: <strong>${student.gpa}</strong> - How are classes going this semester?</li>`);
    }
    if (student.satScore || student.actScore) {
      const scores = [];
      if (student.satScore) scores.push(`SAT: ${student.satScore}`);
      if (student.actScore) scores.push(`ACT: ${student.actScore}`);
      academicItems.push(`<li>Test scores (<strong>${scores.join(', ')}</strong>) - Any plans to retake?</li>`);
    }
    if (academicItems.length > 0) {
      html.push(`<h3>Academic Progress</h3>`);
      html.push(`<ul>${academicItems.join('')}</ul>`);
    }

    // Milestones progress
    const pendingMilestones = milestones.filter(m => m.status === 'not_done');
    if (pendingMilestones.length > 0) {
      html.push(`<h3>Upcoming Milestones</h3>`);
      html.push(`<ul>${pendingMilestones.slice(0, 3).map(m =>
        `<li>${m.title} (<strong>${m.progress}%</strong> complete)</li>`
      ).join('')}</ul>`);
    }

    // Open tasks
    const openTasks = tasks.filter(t => t.status === 'open');
    if (openTasks.length > 0) {
      html.push(`<h3>Tasks to Follow Up On</h3>`);
      html.push(`<ul>${openTasks.slice(0, 3).map(t => `<li>${t.title}</li>`).join('')}</ul>`);
    }

    // Goals discussion
    const activeGoals = smartGoals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      html.push(`<h3>Goals Progress</h3>`);
      html.push(`<ul>${activeGoals.slice(0, 2).map(g => {
        const completedSubtasks = g.subtasks.filter(s => s.completed).length;
        return `<li>${g.title} (<strong>${completedSubtasks}/${g.subtasks.length}</strong> steps completed)</li>`;
      }).join('')}</ul>`);
    }

    // Career/postsecondary interests
    const careerBookmarks = bookmarks.filter(b => b.type === 'career' && b.isBookmarked);
    const schoolBookmarks = bookmarks.filter(b => b.type === 'school' && b.isBookmarked);

    if (careerBookmarks.length > 0 || schoolBookmarks.length > 0 || profile.careerVision) {
      html.push(`<h3>Postsecondary Planning</h3>`);
      const planningItems: string[] = [];
      if (profile.careerVision) {
        planningItems.push(`<li><strong>Career vision:</strong> ${profile.careerVision}</li>`);
      }
      if (careerBookmarks.length > 0) {
        planningItems.push(`<li><strong>Interested careers:</strong> ${careerBookmarks.slice(0, 3).map(c => c.title).join(', ')}</li>`);
      }
      if (schoolBookmarks.length > 0) {
        planningItems.push(`<li><strong>Schools of interest:</strong> ${schoolBookmarks.slice(0, 3).map(s => s.title).join(', ')}</li>`);
      }
      html.push(`<ul>${planningItems.join('')}</ul>`);
    }

    // Strengths to highlight
    if (profile.strengths && profile.strengths.length > 0) {
      html.push(`<h3>Strengths to Encourage</h3>`);
      html.push(`<ul><li>${profile.strengths.slice(0, 3).join(', ')}</li></ul>`);
    }

    // Next steps placeholder
    html.push(`<h3>Next Steps</h3>`);
    html.push(`<ul><li>Action items from this meeting</li><li>Schedule follow-up if needed</li></ul>`);

    const generatedContent = html.join('');

    // Start the generation process with delay
    setIsGeneratingTalkingPoints(true);

    // 1.5 second fake delay to simulate AI processing
    setTimeout(() => {
      setIsGeneratingTalkingPoints(false);
      // Directly set the talking points
      handleTalkingPointsChange(generatedContent);
    }, 1500);
  }, [studentData, isGeneratingTalkingPoints, handleTalkingPointsChange]);

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
      <AppLayout>
        <Box sx={{ backgroundColor: '#FBFBFB', minHeight: '100vh', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={handleBack}
            sx={{ mb: 3, textTransform: 'none' }}
          >
            Back to {studentData.student.firstName} {studentData.student.lastName}
          </Button>
          <Typography variant="h6" color="error">
            Interaction not found
          </Typography>
        </Box>
      </AppLayout>
    );
  }

  const isPlanned = interaction.status === 'planned';
  const isCompleted = interaction.status === 'completed';
  const hasRecording = !!interaction.recordingUrl || !!interaction.transcript;
  const showStartRecordingButton = !isInInteractionMode && !hasRecording && !isCompleted;
  const showMarkCompleteButton = isPlanned && !isInInteractionMode;

  // Helper to check if HTML content is actually empty (not just empty tags)
  const isContentEmpty = (content: string | undefined | null): boolean => {
    if (!content) return true;
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
  };

  const hasTalkingPoints = !isContentEmpty(interaction.talkingPoints);
  const hasSummary = !isContentEmpty(interaction.summary);

  return (
    <AppLayout
      rightPanel={
        studentData && (
          <SidePanel
            studentFirstName={studentData.student.firstName}
            tasks={tasks}
            suggestedActions={localSuggestedActions}
            interactions={interactions}
            studentId={studentId}
            activeTab={sidePanelTab}
            onTabChange={setSidePanelTab}
            onTaskToggle={handleTaskToggle}
            onNewTask={handleNewTask}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onActionAccept={handleActionAccept}
            onActionDismiss={handleActionDismiss}
            onInteractionClick={handleInteractionClick}
            onScheduleInteraction={handleOpenAddInteractionPopover}
          />
        )
      }
      currentStudentId={studentId}
    >
      <Box sx={{ backgroundColor: '#FBFBFB', minHeight: '100vh' }}>
        {/* Top Bar */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid #E5E7EB',
            px: 4,
            py: 2,
          }}
        >
          <Box className="flex items-center justify-between">
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={handleBack}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Back to {studentData.student.firstName} {studentData.student.lastName}
            </Button>

          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
          {/* Interaction Header */}
          <InteractionHeader
            interaction={interaction}
            showStartRecordingButton={showStartRecordingButton}
            showMarkCompleteButton={showMarkCompleteButton}
            onStartRecording={handleStartInteraction}
            onMarkComplete={handleMarkComplete}
          />

          {/* Interaction Intelligence - shown inline when in interaction mode */}
          {isInInteractionMode && (
            <Box sx={{ mt: 4 }}>
              <SectionCard title="Interaction Recording" icon={<Mic size={18} className="text-green-600" />}>
                <InteractionIntelligence
                  studentName={`${studentData.student.firstName} ${studentData.student.lastName}`}
                  onClose={handleCancelInteraction}
                  onInteractionCompleted={handleRecordingCompleted}
                  onAddCounselorTask={handleAddCounselorTask}
                  onAddStudentTask={handleAddStudentTask}
                  autoStart
                />
              </SectionCard>
            </Box>
          )}

          {/* Talking points - show when not in interaction mode */}
          {!isInInteractionMode && (
            <Box sx={{ mt: 4 }}>
              {isCompleted && !hasTalkingPoints ? (
                <SectionCard title="Talking points" icon={<FileText size={18} />}>
                  <Typography sx={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>
                    No talking points were added to this interaction.
                  </Typography>
                </SectionCard>
              ) : (
                <NotesSection
                  notes={interaction.talkingPoints || ''}
                  onNotesChange={handleTalkingPointsChange}
                  label="Talking points"
                  placeholder="Plan what you want to talk about..."
                  showGenerateButton={isPlanned}
                  onGenerate={handleGenerateTalkingPoints}
                  readOnly={isCompleted}
                  isGenerating={isGeneratingTalkingPoints}
                />
              )}
            </Box>
          )}

          {/* Summary - show when not in interaction mode */}
          {!isInInteractionMode && (
            <Box sx={{ mt: 4 }}>
              <NotesSection
                notes={interaction.summary || ''}
                onNotesChange={handleSummaryChange}
                label="Summary"
                placeholder="Enter your notes on this interaction..."
                icon={<Alma size={18} color="#12B76A" />}
              />
            </Box>
          )}

          {/* Action Items (if AI summary has recommended actions) */}
          {!isInInteractionMode && actionItemsForPanel.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <ActionItemsPanel
                actionItems={actionItemsForPanel}
                onActionItemsChange={handleActionItemsChange}
                onAddCounselorTask={handleAddCounselorTask}
                onAddStudentTask={handleAddStudentTask}
              />
            </Box>
          )}

          {/* Transcript */}
          {interaction.transcript ? (
            <Box sx={{ mt: 4 }}>
              <TranscriptSection transcript={interaction.transcript} />
            </Box>
          ) : (
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

          {/* Delete interaction */}
          {!isInInteractionMode && (
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
                Delete interaction
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Interaction Popover */}
      <AddInteractionPopover
        anchorEl={interactionPopoverAnchor}
        open={Boolean(interactionPopoverAnchor)}
        onClose={handleCloseAddInteractionPopover}
        onCreateInteraction={handleCreateInteraction}
      />
    </AppLayout>
  );
}

export default InteractionDetailView;
