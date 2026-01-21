'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowLeft, Trash2, Mic, CheckCircle } from 'lucide-react';
import { InteractionIntelligence } from '@/components/InteractionIntelligence';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSection, SectionCard } from '@/components/shared';
import { useStudentData } from '@/hooks/useStudentData';
import { useInteractions, useInteractionsContext } from '@/contexts/InteractionsContext';
import { InteractionHeader } from './InteractionHeader';
import { NotesSection } from './NotesSection';
import { SummarySection } from './SummarySection';
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
  const { updateInteractionSummary, markInteractionComplete, deleteInteraction } = useInteractionsContext();

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
  const showStartRecordingButton = !isInInteractionMode && !hasRecording;
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
                  variant="contained"
                  startIcon={<CheckCircle size={16} />}
                  onClick={handleMarkComplete}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#22C55E',
                    '&:hover': {
                      backgroundColor: '#16A34A',
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
              {!isInInteractionMode && (
                <IconButton onClick={handleDelete} size="small" className="text-neutral-500">
                  <Trash2 size={18} />
                </IconButton>
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

          {/* Summary/Talking points - show when not in interaction mode */}
          {!isInInteractionMode && (
            <Box sx={{ mt: 4 }}>
              <NotesSection
                notes={interaction.summary || ''}
                onNotesChange={handleSummaryChange}
                label={isPlanned ? 'Talking points' : 'Summary'}
                placeholder={isPlanned ? 'Plan what you want to talk about...' : 'Add a summary of your interaction...'}
              />
            </Box>
          )}

          {/* AI Summary (if exists from recording) */}
          {interaction.aiSummary && (
            <Box sx={{ mt: 4 }}>
              <SummarySection
                summary={interaction.aiSummary}
                onRegenerate={() => console.log('Regenerate summary')}
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

          {/* Transcript (if recording exists) */}
          {interaction.transcript && (
            <Box sx={{ mt: 4 }}>
              <TranscriptSection transcript={interaction.transcript} />
            </Box>
          )}
        </Box>
      </Box>
    </AppLayout>
  );
}

export default InteractionDetailView;
