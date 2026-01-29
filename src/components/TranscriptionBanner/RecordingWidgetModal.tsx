'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, IconButton, TextField, Modal, Button } from '@mui/material';
import { Minimize2, Pause, Play, Square, ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { useActiveMeetingContext, ActiveMeetingState } from '@/contexts/ActiveMeetingContext';
import { useInteractionsContext } from '@/contexts/InteractionsContext';
import { useTasksContext } from '@/contexts/TasksContext';
import { AudioWaveform } from './AudioWaveform';

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

// Inner component that receives initial values as props
// Using key prop on this component resets state when modal reopens
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
  const { togglePause, setPhase, updateTalkingPoints } = useActiveMeetingContext();
  const { updateInteractionTalkingPoints } = useInteractionsContext();
  const { getTasksForStudent, toggleTask } = useTasksContext();

  const [editedNotes, setEditedNotes] = useState(activeMeeting.talkingPoints || '');

  const studentTasks = getTasksForStudent(activeMeeting.studentId).filter(t => t.status === 'open').slice(0, 5);

  const isPaused = activeMeeting.isPaused;

  const handleSaveAndClose = () => {
    // Update talking points if changed
    if (editedNotes !== activeMeeting.talkingPoints) {
      updateInteractionTalkingPoints(
        activeMeeting.studentId,
        activeMeeting.interactionId,
        editedNotes
      );
      updateTalkingPoints(editedNotes);
    }

    onClose();
  };

  const handleStopRecording = () => {
    // Save any pending changes first
    if (editedNotes !== activeMeeting.talkingPoints) {
      updateInteractionTalkingPoints(
        activeMeeting.studentId,
        activeMeeting.interactionId,
        editedNotes
      );
    }

    // Set phase to processing to show the summarizing modal
    setPhase('processing');

    // Navigate to meeting details with summary reveal
    router.push(
      `/students/${activeMeeting.studentId}/interactions/${activeMeeting.interactionId}?showSummary=true`
    );
    onClose();
  };

  const handleViewDetails = () => {
    router.push(
      `/students/${activeMeeting.studentId}/interactions/${activeMeeting.interactionId}`
    );
    onClose();
  };

  return (
    <Box
      sx={{
        width: '90vw',
        maxWidth: 600,
        maxHeight: '90vh',
        backgroundColor: '#1F2937',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        zIndex: 10000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Recording indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isPaused ? '#6B7280' : '#EF4444',
              animation: isPaused ? 'none' : 'pulse-recording 1.5s ease-in-out infinite',
              '@keyframes pulse-recording': {
                '0%': { opacity: 1, boxShadow: '0 0 0 0 rgba(239,68,68,0.5)' },
                '50%': { opacity: 0.6, boxShadow: '0 0 0 6px rgba(239,68,68,0)' },
                '100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
              },
            }}
          />
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              color: isPaused ? '#9CA3AF' : '#EF4444',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isPaused ? 'Paused' : 'Recording'}
          </Typography>
        </Box>

        {/* Timer */}
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {formatElapsed(elapsed)}
        </Typography>

        {/* Waveform */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <AudioWaveform
            isActive={!isPaused}
            isPaused={isPaused}
            width={120}
            height={32}
          />
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={togglePause}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </IconButton>
          <IconButton
            onClick={handleStopRecording}
            sx={{
              backgroundColor: '#EF4444',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#DC2626',
              },
            }}
          >
            <Square size={18} fill="currentColor" />
          </IconButton>
          <IconButton
            onClick={handleSaveAndClose}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <Minimize2 size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          py: 2,
        }}
      >
        {/* Notes & Talking Points */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Notes & Talking Points
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Add notes for this meeting..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#EF4444',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#fff',
                '&::placeholder': {
                  color: '#6B7280',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Tasks */}
        <Box>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Tasks
          </Typography>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
            }}
          >
            {studentTasks.length === 0 ? (
              <Box sx={{ px: 2, py: 2 }}>
                <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                  No open tasks
                </Typography>
              </Box>
            ) : (
              studentTasks.map((task, index) => (
                <Box
                  key={task.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderBottom: index < studentTasks.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                  onClick={() => toggleTask(activeMeeting.studentId, task.id)}
                >
                  <Box sx={{ mt: '2px' }}>
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={18} color="#10B981" />
                    ) : (
                      <Circle size={18} color="#6B7280" />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: task.status === 'completed' ? '#6B7280' : '#fff',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.dueDate && (
                      <Typography sx={{ fontSize: '12px', color: '#9CA3AF', mt: 0.5 }}>
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="text"
          startIcon={<ExternalLink size={16} />}
          onClick={handleViewDetails}
          sx={{
            color: '#9CA3AF',
            textTransform: 'none',
            '&:hover': {
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          View Full Details
        </Button>
      </Box>
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
