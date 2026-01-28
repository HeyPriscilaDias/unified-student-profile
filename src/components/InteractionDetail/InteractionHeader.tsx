'use client';

import { useState, useRef } from 'react';
import { Box, Typography, Button, TextField, IconButton, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Calendar, Mic, Pencil, X, ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction, InteractionStatus } from '@/types/student';

interface InteractionHeaderProps {
  interaction: Interaction;
  showStartRecordingButton?: boolean;
  onStartRecording?: () => void;
  onStatusChange?: (status: InteractionStatus) => void;
  onDateChange?: (date: string | undefined) => void;
}

const statusOptions: { value: InteractionStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
];

export function InteractionHeader({
  interaction,
  showStartRecordingButton,
  onStartRecording,
  onStatusChange,
  onDateChange,
}: InteractionHeaderProps) {
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

  const handleStatusChange = (event: SelectChangeEvent<InteractionStatus>) => {
    if (onStatusChange) {
      onStatusChange(event.target.value as InteractionStatus);
    }
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

            <Select
              value={interaction.status}
              onChange={handleStatusChange}
              size="small"
              IconComponent={(props) => <ChevronDown {...props} size={16} />}
              sx={{
                ml: 1,
                minWidth: 120,
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '16px',
                backgroundColor: interaction.status === 'completed' ? '#DCFCE7' : '#F3F4F6',
                color: interaction.status === 'completed' ? '#166534' : '#374151',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiSelect-select': {
                  py: 0.5,
                  pl: 1.5,
                  pr: 3,
                },
                '&:hover': {
                  backgroundColor: interaction.status === 'completed' ? '#BBF7D0' : '#E5E7EB',
                },
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '13px' }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {showStartRecordingButton && (
          <Box className="flex items-center gap-2">
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
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default InteractionHeader;
