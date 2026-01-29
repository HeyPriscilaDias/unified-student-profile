'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, IconButton, Modal, CircularProgress } from '@mui/material';
import { Pause, Play, Square, Maximize2 } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { AudioWaveform } from './AudioWaveform';
import { RecordingWidgetModal } from './RecordingWidgetModal';
import { useWidgetDrag } from './useWidgetDrag';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function FloatingRecordingWidget() {
  const router = useRouter();
  const { activeMeeting, togglePause, setPhase } = useActiveMeetingContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const { position, isDragging, handleMouseDown } = useWidgetDrag({
    widgetWidth: 200,
    widgetHeight: 72,
  });

  // Update elapsed time
  useEffect(() => {
    if (!activeMeeting || activeMeeting.phase !== 'recording') return;

    const update = () => {
      const now = Date.now();
      const totalElapsed = now - activeMeeting.startTime;

      // Subtract paused duration
      let pausedDuration = activeMeeting.totalPausedDuration;
      if (activeMeeting.isPaused && activeMeeting.pausedAt) {
        pausedDuration += now - activeMeeting.pausedAt;
      }

      const activeElapsed = Math.max(0, totalElapsed - pausedDuration);
      setElapsed(Math.floor(activeElapsed / 1000));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeMeeting]);

  // Don't render if no active meeting
  if (!activeMeeting) {
    return null;
  }

  // Show processing modal when summarizing
  if (activeMeeting.phase === 'processing') {
    return (
      <Modal
        open={true}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 320,
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            p: 4,
            textAlign: 'center',
            outline: 'none',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              position: 'relative',
            }}
          >
            <Alma size={32} color="#12B76A" />
            <CircularProgress
              size={72}
              thickness={2}
              sx={{
                color: '#12B76A',
                position: 'absolute',
                top: -4,
                left: -4,
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#062F29',
              mb: 1,
            }}
          >
            Summarizing meeting...
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#6B7280',
            }}
          >
            Alma is analyzing your conversation and generating a summary.
          </Typography>
        </Box>
      </Modal>
    );
  }

  // Don't render recording widget if not in recording phase
  if (activeMeeting.phase !== 'recording') {
    return null;
  }

  const isPaused = activeMeeting.isPaused;

  return (
    <>
      {/* Floating Widget */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: 200,
          backgroundColor: '#1F2937',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Header with indicator and timer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            pt: 1.5,
            pb: 1,
          }}
        >
          {/* Pulsing red dot */}
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isPaused ? '#6B7280' : '#EF4444',
              flexShrink: 0,
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
              fontSize: '11px',
              fontWeight: 500,
              color: isPaused ? '#9CA3AF' : '#EF4444',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isPaused ? 'Paused' : 'Recording'}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              ml: 'auto',
            }}
          >
            {formatElapsed(elapsed)}
          </Typography>
        </Box>

        {/* Waveform */}
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
          }}
        >
          <AudioWaveform
            isActive={!isPaused}
            isPaused={isPaused}
            width={176}
            height={24}
          />
        </Box>

        {/* Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            px: 1.5,
            pb: 1.5,
            pt: 0.5,
          }}
        >
          {/* Pause/Resume button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              togglePause();
            }}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </IconButton>

          {/* Stop button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (activeMeeting) {
                // Set phase to processing to show the modal
                setPhase('processing');
                // Navigate to meeting details page
                router.push(
                  `/students/${activeMeeting.studentId}/interactions/${activeMeeting.interactionId}?showSummary=true`
                );
              }
            }}
            size="small"
            sx={{
              backgroundColor: '#EF4444',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#DC2626',
              },
            }}
          >
            <Square size={14} fill="currentColor" />
          </IconButton>

          {/* Expand button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              ml: 'auto',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <Maximize2 size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Modal */}
      <RecordingWidgetModal
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        elapsed={elapsed}
      />
    </>
  );
}

export default FloatingRecordingWidget;
