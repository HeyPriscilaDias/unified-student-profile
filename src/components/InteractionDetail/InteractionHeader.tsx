'use client';

import { Box, Typography, Chip, Button } from '@mui/material';
import { Calendar, Mic, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction, InteractionStatus } from '@/types/student';

interface InteractionHeaderProps {
  interaction: Interaction;
  showStartRecordingButton?: boolean;
  showMarkCompleteButton?: boolean;
  onStartRecording?: () => void;
  onMarkComplete?: () => void;
}

const statusConfig: Record<InteractionStatus, { label: string; color: 'default' | 'primary' | 'success' }> = {
  planned: { label: 'Upcoming', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
};

export function InteractionHeader({
  interaction,
  showStartRecordingButton,
  showMarkCompleteButton,
  onStartRecording,
  onMarkComplete,
}: InteractionHeaderProps) {
  const status = statusConfig[interaction.status];

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        p: 3,
      }}
    >
      <Box className="flex items-start justify-between">
        <Box>
          <Typography variant="h5" className="font-semibold text-neutral-900 mb-4">
            {interaction.title}
          </Typography>

          <Box className="flex items-center gap-3 text-neutral-600">
            <Calendar size={16} className="text-neutral-400" />
            <Typography className="text-sm">
              {formatDate(interaction.interactionDate)}
            </Typography>
            <Chip
              label={status.label}
              color={status.color}
              size="small"
              sx={{ fontWeight: 500, ml: 1 }}
            />
          </Box>
        </Box>

        {(showMarkCompleteButton || showStartRecordingButton) && (
          <Box className="flex items-center gap-2">
            {showMarkCompleteButton && (
              <Button
                variant="outlined"
                startIcon={<CheckCircle size={16} />}
                onClick={onMarkComplete}
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
                Mark as complete
              </Button>
            )}
            {showStartRecordingButton && (
              <Button
                variant="contained"
                startIcon={<Mic size={16} />}
                onClick={onStartRecording}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#155E4C',
                  '&:hover': {
                    backgroundColor: '#134d3f',
                  },
                }}
              >
                Start recording
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default InteractionHeader;
