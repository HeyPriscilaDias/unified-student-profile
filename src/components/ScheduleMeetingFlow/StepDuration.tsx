'use client';

import { Box, Typography, Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Clock, Calendar } from 'lucide-react';
import { Slate } from '@/theme/primitives';

interface StepDurationProps {
  duration: number;
  scheduledDate: string;
  scheduledTime: string;
  onDurationChange: (duration: number) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onCancel: () => void;
  canProceed: boolean;
}

const DURATION_OPTIONS = [15, 30, 45, 60];

export function StepDuration({
  duration,
  scheduledDate,
  scheduledTime,
  onDurationChange,
  onDateChange,
  onTimeChange,
  onNext,
  onCancel,
  canProceed,
}: StepDurationProps) {
  // Get tomorrow's date as default minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Box className="p-4 flex flex-col h-full">
      <Box className="flex-1 space-y-6">
        {/* Duration selection */}
        <Box>
          <Box className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-neutral-500" />
            <Typography className="text-sm font-medium text-neutral-700">
              How long will this meeting be?
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={duration}
            exclusive
            onChange={(_, value) => value && onDurationChange(value)}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                py: 1.5,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  backgroundColor: Slate[50],
                  color: Slate[900],
                  borderColor: Slate[300],
                  '&:hover': {
                    backgroundColor: Slate[100],
                  },
                },
              },
            }}
          >
            {DURATION_OPTIONS.map((mins) => (
              <ToggleButton key={mins} value={mins}>
                {mins} min
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Date selection */}
        <Box>
          <Box className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-neutral-500" />
            <Typography className="text-sm font-medium text-neutral-700">
              When should we schedule it?
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="date"
              label="Date"
              value={scheduledDate}
              onChange={(e) => onDateChange(e.target.value)}
              inputProps={{ min: minDate }}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="time"
              label="Time"
              value={scheduledTime}
              onChange={(e) => onTimeChange(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Quick date options */}
        <Box>
          <Typography className="text-xs text-neutral-500 mb-2">Quick select:</Typography>
          <Box className="flex gap-2 flex-wrap">
            {['Tomorrow', 'Next Week', 'In 2 Weeks'].map((label, index) => {
              const date = new Date();
              if (index === 0) date.setDate(date.getDate() + 1);
              else if (index === 1) date.setDate(date.getDate() + 7);
              else date.setDate(date.getDate() + 14);
              const dateStr = date.toISOString().split('T')[0];

              return (
                <Button
                  key={label}
                  variant="outlined"
                  size="small"
                  onClick={() => onDateChange(dateStr)}
                  sx={{
                    textTransform: 'none',
                    borderColor: scheduledDate === dateStr ? 'primary.main' : 'neutral.300',
                    backgroundColor: scheduledDate === dateStr ? 'primary.50' : 'transparent',
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Box className="flex gap-2 pt-4 border-t border-neutral-100 mt-4">
        <Button
          variant="text"
          onClick={onCancel}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!canProceed}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default StepDuration;
