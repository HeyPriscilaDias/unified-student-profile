'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, IconButton, Modal, CircularProgress, Avatar } from '@mui/material';
import { Pause, Play, Maximize2, Mic } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { AudioWaveform } from './AudioWaveform';
import { RecordingWidgetModal } from './RecordingWidgetModal';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function TranscriptionBanner() {
  const router = useRouter();
  const { activeMeeting, togglePause, setPhase } = useActiveMeetingContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);

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
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
            },
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
        }}
      >
        <Box
          sx={{
            width: 320,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            p: 4,
            textAlign: 'center',
            outline: 'none',
            position: 'relative',
            zIndex: 1,
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

  // Don't render banner if not in recording phase
  if (activeMeeting.phase !== 'recording') {
    return null;
  }

  const isPaused = activeMeeting.isPaused;

  const handleStop = () => {
    setPhase('processing');
    router.push(
      `/students/${activeMeeting.studentId}/interactions/${activeMeeting.interactionId}?showSummary=true`
    );
  };

  // Get initials for avatar fallback
  const initials = activeMeeting.studentName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const avatarUrl = activeMeeting.studentAvatarUrl;

  return (
    <>
      {/* Fixed Banner - hidden when modal is expanded */}
      {!isExpanded && (
      <Box
        sx={{
          position: 'fixed',
          bottom: 12,
          left: 232, // 220px sidebar + 12px gap
          right: 12,
          height: 56,
          backgroundColor: '#041D1A',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          borderRadius: '12px',
        }}
      >
        {/* Left side: Meeting title + Student */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
          {/* Meeting Title */}
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            {activeMeeting.interactionTitle}
          </Typography>

          {/* Student Avatar + Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={avatarUrl}
              sx={{
                width: 28,
                height: 28,
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: '#155E4C',
                color: '#fff',
              }}
            >
              {initials}
            </Avatar>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              {activeMeeting.studentName}
            </Typography>
          </Box>
        </Box>

        {/* Right side: Waveform + Timer + Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Waveform */}
          <AudioWaveform
            isActive={!isPaused}
            isPaused={isPaused}
            width={160}
            height={32}
            barColor="rgba(255,255,255,0.6)"
          />

          {/* Timer */}
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 500,
              color: '#fff',
              minWidth: 45,
            }}
          >
            {formatElapsed(elapsed)}
          </Typography>

          {/* Pause Button */}
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
              py: 0.75,
              minWidth: 80,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          {/* Stop Button */}
          <Button
            variant="contained"
            onClick={handleStop}
            sx={{
              backgroundColor: '#EF4444',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              px: 2,
              py: 0.75,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#DC2626',
                boxShadow: 'none',
              },
            }}
          >
            Stop & Summarize
          </Button>

          {/* Expand Button */}
          <IconButton
            onClick={() => setIsExpanded(true)}
            sx={{
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              p: 1,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <Maximize2 size={18} />
          </IconButton>
        </Box>
      </Box>
      )}

      {/* Expanded Modal */}
      <RecordingWidgetModal
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        elapsed={elapsed}
      />
    </>
  );
}

export default TranscriptionBanner;
