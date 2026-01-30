'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, IconButton, CircularProgress, Avatar } from '@mui/material';
import { Play, Maximize2 } from 'lucide-react';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { AudioWaveform } from './AudioWaveform';
import { RecordingWidgetModal } from './RecordingWidgetModal';
import { getStudentData } from '@/lib/mockData';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

interface InteractionContext {
  onStartRecording: () => void;
  meetingTitle: string;
  studentName: string;
  studentAvatarUrl?: string;
}

interface TranscriptionBannerProps {
  interactionContext?: InteractionContext;
}

export function TranscriptionBanner({ interactionContext }: TranscriptionBannerProps) {
  const router = useRouter();
  const { activeMeeting, togglePause, stopMeeting, resumeMeeting, setPhase } = useActiveMeetingContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);

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

  // Get avatar URL for active meeting
  const activeMeetingAvatarUrl = useMemo(() => {
    if (!activeMeeting) return undefined;
    if (activeMeeting.studentAvatarUrl) {
      return activeMeeting.studentAvatarUrl;
    }
    const studentData = getStudentData(activeMeeting.studentId);
    return studentData?.student.avatarUrl;
  }, [activeMeeting]);

  // Determine which state to render
  const isActiveRecording = activeMeeting && (activeMeeting.phase === 'recording' || activeMeeting.phase === 'stopped');
  const showIdleBanner = !isActiveRecording && interactionContext;

  // Don't render anything if no active meeting and no interaction context
  if (!isActiveRecording && !showIdleBanner) {
    return null;
  }

  // === IDLE STATE (on interaction page, not recording) ===
  if (showIdleBanner && interactionContext) {
    const { onStartRecording, meetingTitle, studentName, studentAvatarUrl } = interactionContext;

    const initials = studentName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 12,
          left: 232,
          right: 12,
          height: 56,
          backgroundColor: '#041D1A',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          borderRadius: '12px',
        }}
      >
        {/* Left side: Meeting title + Student */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            {meetingTitle}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={studentAvatarUrl}
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
              {studentName}
            </Typography>
          </Box>
        </Box>

        {/* Right side: Waveform + Timer + Start button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <AudioWaveform
            isActive={false}
            isPaused={true}
            width={160}
            height={8}
            barColor="rgba(255,255,255,0.3)"
          />

          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              minWidth: 45,
            }}
          >
            00:00
          </Typography>

          <Button
            variant="outlined"
            startIcon={<Play size={14} fill="#414651" />}
            onClick={onStartRecording}
            sx={{
              backgroundColor: '#fff',
              color: '#414651',
              borderColor: '#D5D7DA',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              px: 1.5,
              py: 0.75,
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#f9fafb',
                borderColor: '#D5D7DA',
              },
            }}
          >
            Start transcribing
          </Button>
        </Box>
      </Box>
    );
  }

  // === ACTIVE STATES (recording, paused, stopped) ===
  if (!activeMeeting) return null;

  const isPaused = activeMeeting.isPaused;
  const isStopped = activeMeeting.phase === 'stopped';
  const isRecording = activeMeeting.phase === 'recording';

  const handleStop = () => {
    if (isSummarizing) return;
    setIsSummarizing(true);

    setTimeout(() => {
      stopMeeting(elapsed);
      setPhase('processing');
      // Navigate to trigger summary generation
      router.push(
        `/students/${activeMeeting.studentId}/interactions/${activeMeeting.interactionId}?showSummary=true`
      );
      setIsSummarizing(false);
    }, 1500);
  };

  const handleContinueRecording = () => {
    resumeMeeting();
  };

  // Get initials for avatar fallback
  const initials = activeMeeting.studentName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Fixed Banner - hidden when modal is expanded */}
      {!isExpanded && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 12,
            left: 232,
            right: 12,
            height: 56,
            backgroundColor: '#041D1A',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            borderRadius: '12px',
          }}
        >
          {/* Left side: Meeting title + Student (consistent across all states) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                src={activeMeetingAvatarUrl}
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

          {/* Right side: Controls based on state */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isStopped ? (
              <>
                {/* Stopped state: Same as paused but with View summary instead of Stop & summarize */}
                <AudioWaveform
                  isActive={false}
                  isPaused={true}
                  width={120}
                  height={32}
                  barColor="rgba(255,255,255,0.6)"
                />

                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#fff',
                    minWidth: 45,
                  }}
                >
                  {formatElapsed(activeMeeting.stoppedElapsed ?? 0)}
                </Typography>

                {/* Resume Button */}
                <Button
                  variant="outlined"
                  onClick={handleContinueRecording}
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
                  Resume
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
              </>
            ) : (
              <>
                {/* Recording state: Waveform + Timer + Pause/Stop */}
                <AudioWaveform
                  isActive={!isPaused}
                  isPaused={isPaused}
                  width={120}
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

                {/* Pause/Resume Button */}
                <Button
                  variant="outlined"
                  onClick={togglePause}
                  disabled={isSummarizing}
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
                    '&.Mui-disabled': {
                      color: 'rgba(255,255,255,0.5)',
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>

                {/* Stop Button */}
                <Button
                  variant="contained"
                  onClick={handleStop}
                  disabled={isSummarizing}
                  startIcon={isSummarizing ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : undefined}
                  sx={{
                    backgroundColor: isSummarizing ? '#155E4C !important' : '#EF4444 !important',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 2,
                    py: 0.75,
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
                  {isSummarizing ? 'Summarizing...' : 'Stop & summarize'}
                </Button>

                {/* Expand Button */}
                <IconButton
                  onClick={() => setIsExpanded(true)}
                  disabled={isSummarizing}
                  sx={{
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    p: 1,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <Maximize2 size={18} />
                </IconButton>
              </>
            )}
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
