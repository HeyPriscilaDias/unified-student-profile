'use client';

import { useState, useRef } from 'react';
import { Box, Typography, Chip, Button, TextField, IconButton } from '@mui/material';
import { Calendar, Mic, CheckCircle, Pencil, X } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction, InteractionStatus } from '@/types/student';

interface InteractionHeaderProps {
  interaction: Interaction;
  showStartRecordingButton?: boolean;
  showMarkCompleteButton?: boolean;
  onStartRecording?: () => void;
  onMarkComplete?: () => void;
  onDateChange?: (date: string | undefined) => void;
}

const statusConfig: Record<InteractionStatus, { label: string; color: 'default' | 'primary' | 'success' }> = {
  draft: { label: 'Draft', color: 'default' },
  completed: { label: 'Completed', color: 'success' },
};

export function InteractionHeader({
  interaction,
  showStartRecordingButton,
  showMarkCompleteButton,
  onStartRecording,
  onMarkComplete,
  onDateChange,
}: InteractionHeaderProps) {
  const status = statusConfig[interaction.status];
  const isDraft = interaction.status === 'draft';
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState(interaction.interactionDate || '');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (isDraft && onDateChange) {
      setIsEditingDate(true);
      // Auto-open the date picker after a short delay
      setTimeout(() => {
        dateInputRef.current?.showPicker();
      }, 100);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateValue(e.target.value);
  };

  const handleDateSave = () => {
    if (onDateChange) {
      onDateChange(dateValue || undefined);
    }
    setIsEditingDate(false);
  };

  const handleDateCancel = () => {
    setDateValue(interaction.interactionDate || '');
    setIsEditingDate(false);
  };

  const handleClearDate = () => {
    if (onDateChange) {
      onDateChange(undefined);
    }
    setDateValue('');
    setIsEditingDate(false);
  };

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

            {isEditingDate ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  type="date"
                  value={dateValue}
                  onChange={handleDateChange}
                  inputRef={dateInputRef}
                  size="small"
                  sx={{
                    width: 160,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover fieldset': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#062F29',
                      },
                    },
                  }}
                />
                <Button
                  size="small"
                  onClick={handleDateSave}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                    textTransform: 'none',
                    fontSize: '13px',
                    backgroundColor: '#062F29',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#0a4a40',
                    },
                  }}
                >
                  Save
                </Button>
                {dateValue && (
                  <Button
                    size="small"
                    onClick={handleClearDate}
                    sx={{
                      minWidth: 'auto',
                      px: 1.5,
                      py: 0.5,
                      textTransform: 'none',
                      fontSize: '13px',
                      color: '#DC2626',
                      '&:hover': {
                        backgroundColor: '#FEF2F2',
                      },
                    }}
                  >
                    Clear
                  </Button>
                )}
                <IconButton
                  size="small"
                  onClick={handleDateCancel}
                  sx={{ p: 0.5 }}
                >
                  <X size={14} />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: isDraft && onDateChange ? 'pointer' : 'default',
                  '&:hover': isDraft && onDateChange ? {
                    '& .edit-icon': {
                      opacity: 1,
                    },
                  } : {},
                }}
                onClick={handleDateClick}
              >
                <Typography className="text-sm">
                  {interaction.interactionDate ? formatDate(interaction.interactionDate) : 'No date set'}
                </Typography>
                {isDraft && onDateChange && (
                  <Pencil
                    size={12}
                    className="edit-icon text-neutral-400"
                    style={{ opacity: 0.5, transition: 'opacity 0.2s' }}
                  />
                )}
              </Box>
            )}

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
