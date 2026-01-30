'use client';

import { Box, Typography, Button, Avatar, IconButton } from '@mui/material';
import { Mic, Maximize2 } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface StartTranscribingBannerProps {
  onStartRecording: () => void;
  hasTranscript?: boolean;
  meetingTitle?: string;
  studentName?: string;
  studentAvatarUrl?: string;
}

export function StartTranscribingBanner({
  onStartRecording,
  hasTranscript,
  meetingTitle,
  studentName,
  studentAvatarUrl,
}: StartTranscribingBannerProps) {
  // Get initials for avatar
  const initials = studentName
    ? studentName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  // If there's already a transcript, show the "resume" variant
  if (hasTranscript) {
    return (
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

        {/* Right side: Waveform + Timer + Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AudioWaveform
            isActive={false}
            isPaused={true}
            width={160}
            height={32}
            barColor="rgba(255,255,255,0.4)"
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
            00:00
          </Typography>

          <Button
            variant="outlined"
            onClick={onStartRecording}
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

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#12B76A',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              px: 2,
              py: 0.75,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0E9F5C',
                boxShadow: 'none',
              },
            }}
          >
            Stop & Summarize
          </Button>

          <IconButton
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
    );
  }

  // Default "start transcribing" variant
  return (
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
        justifyContent: 'space-between',
        px: 2,
        borderRadius: '12px',
      }}
    >
      {/* Left side: Icon + Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mic size={20} color="rgba(255,255,255,0.7)" />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            Ready to transcribe this meeting?
          </Typography>
          <Typography
            sx={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Alma will capture the conversation and generate a summary when you&apos;re done.
          </Typography>
        </Box>
      </Box>

      {/* Right side: Start button */}
      <Button
        variant="contained"
        startIcon={<Mic size={16} />}
        onClick={onStartRecording}
        sx={{
          backgroundColor: '#12B76A',
          color: '#fff',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          px: 3,
          py: 1,
          borderRadius: '8px',
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          '&:hover': {
            backgroundColor: '#0E9F5C',
            boxShadow: 'none',
          },
        }}
      >
        Start Transcribing
      </Button>
    </Box>
  );
}

export default StartTranscribingBanner;
