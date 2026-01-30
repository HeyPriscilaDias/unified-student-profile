'use client';

import { useState } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress, Avatar } from '@mui/material';
import { Play, Maximize2 } from 'lucide-react';
import { AudioWaveform } from '@/components/TranscriptionBanner/AudioWaveform';

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// State label component
function StateLabel({ title, description }: { title: string; description: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
        {description}
      </Typography>
    </Box>
  );
}

// Demo banner wrapper
function BannerDemo({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ position: 'relative', height: 56, mb: 6 }}>
      {children}
    </Box>
  );
}

// Mock data
const mockMeeting = {
  title: 'FAFSA Check-in',
  studentName: 'Marcus Johnson',
  studentInitials: 'MJ',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
};

export default function BannerDemoPage() {
  const [elapsed] = useState(847); // 14:07

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Transcription Banner States
      </Typography>
      <Typography sx={{ mb: 6, color: '#6B7280', fontSize: '16px' }}>
        All banner states shown in their relative positions. Banners are normally fixed to the bottom of the viewport.
      </Typography>

      {/* STATE 1: IDLE */}
      <StateLabel
        title="1. Idle State"
        description="Shown on interaction detail page when meeting is not completed and no recording is active. User hasn't started transcribing yet."
      />
      <BannerDemo>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 56,
            backgroundColor: '#041D1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              {mockMeeting.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={mockMeeting.avatarUrl}
                sx={{ width: 28, height: 28, fontSize: '11px', fontWeight: 600, backgroundColor: '#155E4C', color: '#fff' }}
              >
                {mockMeeting.studentInitials}
              </Avatar>
              <Typography sx={{ fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>
                {mockMeeting.studentName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <AudioWaveform isActive={false} isPaused={true} width={160} height={8} barColor="rgba(255,255,255,0.3)" />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '14px', color: 'rgba(255,255,255,0.5)', minWidth: 45 }}>
              00:00
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Play size={14} fill="#414651" />}
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
                '&:hover': { backgroundColor: '#f9fafb', borderColor: '#D5D7DA' },
              }}
            >
              Start transcribing
            </Button>
          </Box>
        </Box>
      </BannerDemo>

      {/* STATE 2: RECORDING */}
      <StateLabel
        title="2. Recording State"
        description="Shown globally (on any page) when a recording is in progress. Timer counts up, waveform animates."
      />
      <BannerDemo>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 56,
            backgroundColor: '#041D1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              {mockMeeting.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={mockMeeting.avatarUrl}
                sx={{ width: 28, height: 28, fontSize: '11px', fontWeight: 600, backgroundColor: '#155E4C', color: '#fff' }}
              >
                {mockMeeting.studentInitials}
              </Avatar>
              <Typography sx={{ fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>
                {mockMeeting.studentName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AudioWaveform isActive={true} isPaused={false} width={120} height={32} barColor="rgba(255,255,255,0.6)" />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 500, color: '#fff', minWidth: 45 }}>
              {formatElapsed(elapsed)}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.3)',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 0.75,
                minWidth: 80,
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Pause
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#EF4444 !important',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 0.75,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#DC2626 !important', boxShadow: 'none' },
              }}
            >
              Stop & summarize
            </Button>
            <IconButton
              sx={{
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                p: 1,
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <Maximize2 size={18} />
            </IconButton>
          </Box>
        </Box>
      </BannerDemo>

      {/* STATE 3: PAUSED */}
      <StateLabel
        title="3. Paused State"
        description="Shown when user clicks 'Pause' during recording. Timer stops counting, waveform freezes. User can resume or stop."
      />
      <BannerDemo>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 56,
            backgroundColor: '#041D1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              {mockMeeting.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={mockMeeting.avatarUrl}
                sx={{ width: 28, height: 28, fontSize: '11px', fontWeight: 600, backgroundColor: '#155E4C', color: '#fff' }}
              >
                {mockMeeting.studentInitials}
              </Avatar>
              <Typography sx={{ fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>
                {mockMeeting.studentName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AudioWaveform isActive={false} isPaused={true} width={120} height={32} barColor="rgba(255,255,255,0.6)" />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 500, color: '#fff', minWidth: 45 }}>
              {formatElapsed(elapsed)}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.3)',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 0.75,
                minWidth: 80,
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Resume
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#EF4444 !important',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 0.75,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#DC2626 !important', boxShadow: 'none' },
              }}
            >
              Stop & summarize
            </Button>
            <IconButton
              sx={{
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                p: 1,
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <Maximize2 size={18} />
            </IconButton>
          </Box>
        </Box>
      </BannerDemo>

      {/* STATE 4: SUMMARIZING */}
      <StateLabel
        title="4. Summarizing State (Transitional)"
        description="Brief 1.5s state after clicking 'Stop & summarize'. Shows loading spinner. Transitions to Stopped state."
      />
      <BannerDemo>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 56,
            backgroundColor: '#041D1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              {mockMeeting.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={mockMeeting.avatarUrl}
                sx={{ width: 28, height: 28, fontSize: '11px', fontWeight: 600, backgroundColor: '#155E4C', color: '#fff' }}
              >
                {mockMeeting.studentInitials}
              </Avatar>
              <Typography sx={{ fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>
                {mockMeeting.studentName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AudioWaveform isActive={false} isPaused={true} width={120} height={32} barColor="rgba(255,255,255,0.6)" />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 500, color: '#fff', minWidth: 45 }}>
              {formatElapsed(elapsed)}
            </Typography>
            <Button
              variant="outlined"
              disabled
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 0.75,
                minWidth: 80,
                '&.Mui-disabled': {
                  color: 'rgba(255,255,255,0.5)',
                  borderColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              Pause
            </Button>
            <Button
              variant="contained"
              disabled
              startIcon={<CircularProgress size={16} sx={{ color: '#fff' }} />}
              sx={{
                backgroundColor: '#155E4C !important',
                color: '#fff !important',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 0.75,
                minWidth: 150,
                boxShadow: 'none',
              }}
            >
              Summarizing...
            </Button>
            <IconButton
              disabled
              sx={{
                borderRadius: '8px',
                p: 1,
                '&.Mui-disabled': {
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.2)',
                },
              }}
            >
              <Maximize2 size={18} />
            </IconButton>
          </Box>
        </Box>
      </BannerDemo>

      {/* STATE 5: STOPPED */}
      <StateLabel
        title="5. Stopped State"
        description="Shown after summarizing completes. Same as paused but without Stop & summarize."
      />
      <BannerDemo>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 56,
            backgroundColor: '#041D1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              {mockMeeting.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={mockMeeting.avatarUrl}
                sx={{ width: 28, height: 28, fontSize: '11px', fontWeight: 600, backgroundColor: '#155E4C', color: '#fff' }}
              >
                {mockMeeting.studentInitials}
              </Avatar>
              <Typography sx={{ fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>
                {mockMeeting.studentName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AudioWaveform isActive={false} isPaused={true} width={120} height={32} barColor="rgba(255,255,255,0.6)" />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 500, color: '#fff', minWidth: 45 }}>
              {formatElapsed(elapsed)}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.3)',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 0.75,
                minWidth: 80,
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Resume
            </Button>
            <IconButton
              sx={{
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                p: 1,
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <Maximize2 size={18} />
            </IconButton>
          </Box>
        </Box>
      </BannerDemo>

    </Box>
  );
}
