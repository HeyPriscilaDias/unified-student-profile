'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft, Trash2, Mic, CheckCircle, FileText } from 'lucide-react';
import { InteractionIntelligence } from '@/components/InteractionIntelligence';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSection, SectionCard } from '@/components/shared';
import { useStudentData } from '@/hooks/useStudentData';
import { useInteractions, useInteractionsContext } from '@/contexts/InteractionsContext';
import { InteractionHeader } from './InteractionHeader';
import { NotesSection } from './NotesSection';
import { TranscriptSection } from './TranscriptSection';
import { RecommendedActionsSection } from './RecommendedActionsSection';

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
  const { updateInteractionSummary, updateInteractionTalkingPoints, markInteractionComplete, deleteInteraction } = useInteractionsContext();

  // Clean up the URL after reading the params
  useEffect(() => {
    if (startInteractionParam || summaryModeParam) {
      router.replace(`/students/${studentId}/interactions/${interactionId}`, { scroll: false });
    }
  }, [startInteractionParam, summaryModeParam, router, studentId, interactionId]);

  // Use interactions from context (allows real-time updates)
  const interactions = useInteractions(studentId, studentData?.interactions || []);

  const interaction = useMemo(() => {
    return interactions.find((m) => m.id === interactionId) || null;
  }, [interactions, interactionId]);

  const handleTalkingPointsChange = useCallback((talkingPoints: string) => {
    updateInteractionTalkingPoints(studentId, interactionId, talkingPoints);
  }, [studentId, interactionId, updateInteractionTalkingPoints]);

  const handleSummaryChange = useCallback((summary: string) => {
    updateInteractionSummary(studentId, interactionId, summary);
  }, [studentId, interactionId, updateInteractionSummary]);

  const handleRecordingCompleted = useCallback((summary: string) => {
    // When recording is completed, mark the interaction as complete
    updateInteractionSummary(studentId, interactionId, summary);
    markInteractionComplete(studentId, interactionId);
    setIsInInteractionMode(false);
  }, [studentId, interactionId, updateInteractionSummary, markInteractionComplete]);

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

  const handleAddToTasks = (actionId: string) => {
    console.log('Add to tasks:', actionId);
    // TODO: Convert action to task
  };

  const handleDismissAction = (actionId: string) => {
    console.log('Dismiss action:', actionId);
    // TODO: Dismiss action
  };

  const handleGenerateTalkingPoints = useCallback(() => {
    if (!studentData) return;

    const { student, profile, milestones, tasks, smartGoals, bookmarks } = studentData;
    const talkingPoints: string[] = [];

    // Add greeting/opener
    talkingPoints.push(`## Meeting with ${student.firstName} ${student.lastName}`);
    talkingPoints.push('');

    // Academic check-in
    talkingPoints.push('### Academic Check-in');
    if (student.gpa) {
      talkingPoints.push(`- Current GPA: ${student.gpa} - How are classes going this semester?`);
    }
    if (student.satScore || student.actScore) {
      const scores = [];
      if (student.satScore) scores.push(`SAT: ${student.satScore}`);
      if (student.actScore) scores.push(`ACT: ${student.actScore}`);
      talkingPoints.push(`- Test scores (${scores.join(', ')}) - Any plans to retake?`);
    }
    talkingPoints.push('');

    // Milestones progress
    const pendingMilestones = milestones.filter(m => m.status === 'not_done');
    if (pendingMilestones.length > 0) {
      talkingPoints.push('### Upcoming Milestones');
      pendingMilestones.slice(0, 3).forEach(m => {
        talkingPoints.push(`- ${m.title} (${m.progress}% complete)`);
      });
      talkingPoints.push('');
    }

    // Open tasks
    const openTasks = tasks.filter(t => t.status === 'open');
    if (openTasks.length > 0) {
      talkingPoints.push('### Tasks to Follow Up On');
      openTasks.slice(0, 3).forEach(t => {
        talkingPoints.push(`- ${t.title}`);
      });
      talkingPoints.push('');
    }

    // Goals discussion
    const activeGoals = smartGoals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      talkingPoints.push('### Goals Progress');
      activeGoals.slice(0, 2).forEach(g => {
        const completedSubtasks = g.subtasks.filter(s => s.completed).length;
        talkingPoints.push(`- ${g.title} (${completedSubtasks}/${g.subtasks.length} steps completed)`);
      });
      talkingPoints.push('');
    }

    // Career/postsecondary interests
    const careerBookmarks = bookmarks.filter(b => b.type === 'career' && b.isBookmarked);
    const schoolBookmarks = bookmarks.filter(b => b.type === 'school' && b.isBookmarked);

    if (careerBookmarks.length > 0 || schoolBookmarks.length > 0 || profile.careerVision) {
      talkingPoints.push('### Postsecondary Planning');
      if (profile.careerVision) {
        talkingPoints.push(`- Career vision: ${profile.careerVision}`);
      }
      if (careerBookmarks.length > 0) {
        talkingPoints.push(`- Interested careers: ${careerBookmarks.slice(0, 3).map(c => c.title).join(', ')}`);
      }
      if (schoolBookmarks.length > 0) {
        talkingPoints.push(`- Schools of interest: ${schoolBookmarks.slice(0, 3).map(s => s.title).join(', ')}`);
      }
      talkingPoints.push('');
    }

    // Strengths to highlight
    if (profile.strengths && profile.strengths.length > 0) {
      talkingPoints.push('### Strengths to Encourage');
      talkingPoints.push(`- ${profile.strengths.slice(0, 3).join(', ')}`);
      talkingPoints.push('');
    }

    // Next steps placeholder
    talkingPoints.push('### Next Steps');
    talkingPoints.push('- ');
    talkingPoints.push('');

    const generatedContent = talkingPoints.join('\n');
    handleTalkingPointsChange(generatedContent);
  }, [studentData, handleTalkingPointsChange]);

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

  return (
    <AppLayout currentStudentId={studentId}>
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

            <Box className="flex items-center gap-2">
              {showMarkCompleteButton && (
                <Button
                  variant="outlined"
                  startIcon={<CheckCircle size={16} />}
                  onClick={handleMarkComplete}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#E5E7EB', color: '#374151',
                    '&:hover': {
                      borderColor: '#D1D5DB', backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Mark as complete
                </Button>
              )}
              {showStartRecordingButton && (
                <Button
                  variant="outlined"
                  startIcon={<Mic size={16} />}
                  onClick={handleStartInteraction}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    '&:hover': {
                      borderColor: '#D1D5DB',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Start recording
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
          {/* Interaction Header */}
          <InteractionHeader interaction={interaction} />

          {/* Interaction Intelligence - shown inline when in interaction mode */}
          {isInInteractionMode && (
            <Box sx={{ mt: 4 }}>
              <SectionCard title="Interaction Recording" icon={<Mic size={18} className="text-green-600" />}>
                <InteractionIntelligence
                  studentName={`${studentData.student.firstName} ${studentData.student.lastName}`}
                  onClose={handleCancelInteraction}
                  onInteractionCompleted={handleRecordingCompleted}
                  autoStart
                />
              </SectionCard>
            </Box>
          )}

          {/* Talking points - show when not in interaction mode */}
          {!isInInteractionMode && (
            <Box sx={{ mt: 4 }}>
              {isCompleted && !interaction.talkingPoints ? (
                <SectionCard title="Talking points" icon={<FileText size={18} />}>
                  <Typography sx={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>
                    No talking points added to this interaction.
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
                placeholder="Add a summary of your interaction..."
              />
            </Box>
          )}

          {/* Suggested Tasks (if AI summary has recommended actions) */}
          {interaction.aiSummary?.recommendedActions && interaction.aiSummary.recommendedActions.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <RecommendedActionsSection
                actions={interaction.aiSummary.recommendedActions}
                onAddToTasks={handleAddToTasks}
                onDismiss={handleDismissAction}
              />
            </Box>
          )}

          {/* Transcript */}
          {interaction.transcript ? (
            <Box sx={{ mt: 4 }}>
              <TranscriptSection transcript={interaction.transcript} />
            </Box>
          ) : isCompleted && !hasRecording ? (
            <Box sx={{ mt: 4 }}>
              <SectionCard title="Transcript" icon={<Mic size={18} />}>
                <Typography sx={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic' }}>
                  No recording was made for this interaction.
                </Typography>
              </SectionCard>
            </Box>
          ) : null}

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
    </AppLayout>
  );
}

export default InteractionDetailView;
