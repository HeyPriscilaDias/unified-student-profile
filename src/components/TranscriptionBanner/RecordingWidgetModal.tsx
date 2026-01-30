'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, IconButton, TextField, Modal, Button, Avatar, CircularProgress } from '@mui/material';
import { Minimize2, Pause, Play, Square, Users, FileEdit, CheckSquare, Plus, RefreshCw, Copy, Sparkles, X } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
import { useActiveMeetingContext, ActiveMeetingState } from '@/contexts/ActiveMeetingContext';
import { useInteractionsContext, useInteractions } from '@/contexts/InteractionsContext';
import { useTasksContext } from '@/contexts/TasksContext';
import { useStudentData } from '@/hooks/useStudentData';
import { AudioWaveform } from './AudioWaveform';
import { AddAttendeesModal } from '@/components/InteractionDetail/AddAttendeesModal';
import { getStudentData } from '@/lib/mockData';

interface RecordingWidgetModalProps {
  open: boolean;
  onClose: () => void;
  elapsed: number;
}

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

// Inner component that receives initial values as props
function ModalContent({
  onClose,
  elapsed,
  activeMeeting,
}: {
  onClose: () => void;
  elapsed: number;
  activeMeeting: ActiveMeetingState;
}) {
  const router = useRouter();
  const { togglePause, setPhase, stopMeeting, updateTalkingPoints } = useActiveMeetingContext();
  const { updateInteractionSummary, updateInteraction, updateInteractionAttendees } = useInteractionsContext();
  const studentData = useStudentData(activeMeeting.studentId);

  // Get interactions from context
  const contextInteractions = useInteractions(activeMeeting.studentId, studentData?.interactions || []);
  const interaction = useMemo(() => {
    return contextInteractions.find((m) => m.id === activeMeeting.interactionId) || null;
  }, [contextInteractions, activeMeeting.interactionId]);

  const [notes, setNotes] = useState(interaction?.summary || activeMeeting.talkingPoints || '');
  const [isAddAttendeesModalOpen, setIsAddAttendeesModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const isPaused = activeMeeting.isPaused;

  // Get avatar URL
  const avatarUrl = useMemo(() => {
    if (activeMeeting.studentAvatarUrl) {
      return activeMeeting.studentAvatarUrl;
    }
    const data = getStudentData(activeMeeting.studentId);
    return data?.student.avatarUrl;
  }, [activeMeeting.studentAvatarUrl, activeMeeting.studentId]);

  // Get initials for avatar fallback
  const initials = activeMeeting.studentName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSaveAndClose = () => {
    // Update talking points if changed
    if (notes !== activeMeeting.talkingPoints) {
      updateInteractionSummary(activeMeeting.studentId, activeMeeting.interactionId, notes);
      updateTalkingPoints(notes);
    }
    onClose();
  };

  const handleStopRecording = () => {
    if (isSummarizing) return;
    setIsSummarizing(true);

    // Save any pending changes first
    if (notes !== activeMeeting.talkingPoints) {
      updateInteractionSummary(activeMeeting.studentId, activeMeeting.interactionId, notes);
    }

    // Brief delay to show button feedback, then navigate to trigger summary generation
    setTimeout(() => {
      stopMeeting(elapsed);
      setPhase('processing');
      onClose();
      // Navigate to trigger summary generation
      router.push(
        `/students/${activeMeeting.studentId}/interactions/${activeMeeting.interactionId}?showSummary=true`
      );
      setIsSummarizing(false);
    }, 1500);
  };

  const handleNotesChange = useCallback((newContent: string) => {
    setNotes(newContent);
    updateInteractionSummary(activeMeeting.studentId, activeMeeting.interactionId, newContent);
  }, [activeMeeting.studentId, activeMeeting.interactionId, updateInteractionSummary]);

  const handleSaveAttendees = useCallback((attendees: string[]) => {
    updateInteractionAttendees(activeMeeting.studentId, activeMeeting.interactionId, attendees);
  }, [activeMeeting.studentId, activeMeeting.interactionId, updateInteractionAttendees]);

  const handleGenerateSummary = useCallback(() => {
    if (!notes.trim()) return;

    setIsGeneratingSummary(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const MOCK_AI_SUMMARY = {
        overview: `Student is making progress on their academic and career goals. Discussion covered current challenges, upcoming deadlines, and strategies for success.

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
        id: activeMeeting.interactionId,
        studentId: activeMeeting.studentId,
        aiSummary: MOCK_AI_SUMMARY,
      });

      setIsGeneratingSummary(false);
    }, 2000);
  }, [notes, activeMeeting.studentId, activeMeeting.interactionId, updateInteraction]);

  const hasAISummary = !!interaction?.aiSummary;

  return (
    <Box
      sx={{
        width: '90vw',
        maxWidth: 720,
        maxHeight: '90vh',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        zIndex: 10000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Recording Header Bar - Dark themed */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 1.5,
          backgroundColor: '#041D1A',
        }}
      >
        {/* Recording indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isPaused ? '#6B7280' : '#EF4444',
              animation: isPaused ? 'none' : 'pulse-recording 1.5s ease-in-out infinite',
              '@keyframes pulse-recording': {
                '0%': { opacity: 1, boxShadow: '0 0 0 0 rgba(239,68,68,0.5)' },
                '50%': { opacity: 0.6, boxShadow: '0 0 0 4px rgba(239,68,68,0)' },
                '100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
              },
            }}
          />
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 500,
              color: isPaused ? '#9CA3AF' : '#EF4444',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isPaused ? 'Paused' : 'Recording'}
          </Typography>
        </Box>

        {/* Waveform */}
        <Box sx={{ flex: 1 }}>
          <AudioWaveform
            isActive={!isPaused}
            isPaused={isPaused}
            width={160}
            height={24}
            barColor="rgba(255,255,255,0.6)"
          />
        </Box>

        {/* Timer */}
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 500,
            color: '#fff',
          }}
        >
          {formatElapsed(elapsed)}
        </Typography>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={togglePause}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.3)',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              px: 2,
              py: 0.5,
              minWidth: 80,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            variant="contained"
            onClick={handleStopRecording}
            disabled={isSummarizing}
            startIcon={isSummarizing ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : undefined}
            sx={{
              backgroundColor: isSummarizing ? '#155E4C !important' : '#EF4444 !important',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              px: 2,
              py: 0.5,
              minWidth: isSummarizing ? 150 : 'auto',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: isSummarizing ? '#155E4C !important' : '#DC2626 !important',
                boxShadow: 'none',
              },
              '&:disabled': {
                color: '#fff',
              },
            }}
          >
            {isSummarizing ? 'Summarizing...' : 'Stop & Summarize'}
          </Button>
          <IconButton
            onClick={handleSaveAndClose}
            sx={{
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              p: 0.75,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <Minimize2 size={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Meeting Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            mb: 0.5,
          }}
        >
          {activeMeeting.interactionTitle}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={avatarUrl}
            sx={{
              width: 24,
              height: 24,
              fontSize: '10px',
              fontWeight: 600,
              backgroundColor: '#155E4C',
              color: '#fff',
            }}
          >
            {initials}
          </Avatar>
          <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
            {activeMeeting.studentName}
          </Typography>
        </Box>
      </Box>

      {/* Content - scrollable */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          py: 3,
        }}
      >
        {/* Attendees Section */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader icon={<Users size={18} />} title="Attendees" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '14px', color: '#374151' }}>
              You, {activeMeeting.studentName}
              {interaction?.attendees && interaction.attendees.length > 0 && (
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
        <Box sx={{ mb: 4 }}>
          <SectionHeader icon={<FileEdit size={18} />} title="Notes & talking points" />
          <Box
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = e.currentTarget.innerHTML;
              if (newContent !== notes) {
                handleNotesChange(newContent);
              }
            }}
            dangerouslySetInnerHTML={{ __html: notes || '' }}
            sx={{
              width: '100%',
              minHeight: '120px',
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
                content: '"Add notes for this meeting..."',
                color: '#9CA3AF',
              },
              '& ul, & ol': { pl: 2.5, mb: 2 },
              '& li': { mb: 0.5 },
              '& p': { mb: 1.5 },
              '& strong': { fontWeight: 600 },
            }}
          />
        </Box>

        {/* AI Summary Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
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
                dangerouslySetInnerHTML={{ __html: interaction?.aiSummary?.overview || '' }}
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
                    const text = interaction?.aiSummary?.overview?.replace(/<[^>]*>/g, '') || '';
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
              Add notes above so Alma can generate a summary.
            </Typography>
          )}
        </Box>

        {/* Tasks Section */}
        <Box>
          <SectionHeader icon={<CheckSquare size={18} />} title="Tasks" />
          {interaction?.aiSummary?.recommendedActions && interaction.aiSummary.recommendedActions.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Staff Tasks ("Yours") */}
              {(() => {
                const staffTasks = interaction.aiSummary.recommendedActions.filter(a => a.assignee === 'staff');
                return staffTasks.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '14px', color: '#252B37' }}>
                      Yours
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {staffTasks.map((action) => (
                        <Box
                          key={action.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: '#F5F5F5',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 1,
                          }}
                        >
                          <Typography sx={{ flex: 1, fontSize: '14px', color: '#252B37', lineHeight: '20px' }}>
                            {action.title}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              textTransform: 'none',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#414651',
                              backgroundColor: 'white',
                              borderColor: '#D5D7DA',
                              borderRadius: '8px',
                              px: 1.5,
                              py: 0.5,
                              minHeight: 32,
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                borderColor: '#9CA3AF',
                                backgroundColor: 'white',
                              },
                            }}
                          >
                            Add to my tasks
                          </Button>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      startIcon={<Plus size={14} />}
                      sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        color: '#535862',
                        p: 0,
                        justifyContent: 'flex-start',
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: '#374151',
                        },
                      }}
                    >
                      Add task
                    </Button>
                  </Box>
                ) : null;
              })()}

              {/* Student Tasks */}
              {(() => {
                const studentTasks = interaction.aiSummary!.recommendedActions!.filter(a => a.assignee === 'student');
                const firstName = activeMeeting.studentName.split(' ')[0];
                return studentTasks.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '14px', color: '#252B37' }}>
                      {firstName}&apos;s
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {studentTasks.map((action) => (
                        <Box
                          key={action.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: '#F5F5F5',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 1,
                          }}
                        >
                          <Typography sx={{ flex: 1, fontSize: '14px', color: '#252B37', lineHeight: '20px' }}>
                            {action.title}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              textTransform: 'none',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#414651',
                              backgroundColor: 'white',
                              borderColor: '#D5D7DA',
                              borderRadius: '8px',
                              px: 1.5,
                              py: 0.5,
                              minHeight: 32,
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                borderColor: '#9CA3AF',
                                backgroundColor: 'white',
                              },
                            }}
                          >
                            Add to student tasks
                          </Button>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      startIcon={<Plus size={14} />}
                      sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        color: '#535862',
                        p: 0,
                        justifyContent: 'flex-start',
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: '#374151',
                        },
                      }}
                    >
                      Add task
                    </Button>
                  </Box>
                ) : null;
              })()}
            </Box>
          ) : (
            <>
              <Typography sx={{ fontSize: '14px', color: '#535862', mb: 2 }}>
                Add tasks or generate a summary so Alma creates them for you.
              </Typography>
              <Button
                startIcon={<Plus size={14} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '14px',
                  color: '#535862',
                  p: 0,
                  justifyContent: 'flex-start',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#374151',
                  },
              }}
              >
                Add task
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Add Attendees Modal */}
      <AddAttendeesModal
        open={isAddAttendeesModalOpen}
        onClose={() => setIsAddAttendeesModalOpen(false)}
        onSave={handleSaveAttendees}
        currentAttendees={interaction?.attendees || []}
      />
    </Box>
  );
}

export function RecordingWidgetModal({ open, onClose, elapsed }: RecordingWidgetModalProps) {
  const { activeMeeting } = useActiveMeetingContext();

  if (!activeMeeting) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Key resets the inner component's state when modal opens with new meeting */}
      <ModalContent
        key={activeMeeting.interactionId}
        onClose={onClose}
        elapsed={elapsed}
        activeMeeting={activeMeeting}
      />
    </Modal>
  );
}

export default RecordingWidgetModal;
