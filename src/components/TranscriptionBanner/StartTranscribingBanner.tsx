'use client';

import { Box, Typography, Button } from '@mui/material';
import { Mic } from 'lucide-react';

interface StartTranscribingBannerProps {
  onStartRecording: () => void;
}

export function StartTranscribingBanner({ onStartRecording }: StartTranscribingBannerProps) {
  return (
    <Box
      sx={{
        backgroundColor: '#062F29',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2,
        mt: 4,
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
          <Mic size={20} color="#fff" />
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
            Alma will capture the conversation and generate a summary when you're done.
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
