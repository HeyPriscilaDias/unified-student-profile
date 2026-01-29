'use client';

import { useState, useRef } from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { Calendar, Check, X } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction, InteractionStatus } from '@/types/student';

interface InteractionHeaderProps {
  interaction: Interaction;
  onStatusChange?: (status: InteractionStatus) => void;
  onDateChange?: (date: string | undefined) => void;
}

export function InteractionHeader({
  interaction,
  onStatusChange,
  onDateChange,
}: InteractionHeaderProps) {
  const isDraft = interaction.status === 'draft';
  const isCompleted = interaction.status === 'completed';
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState(interaction.interactionDate || '');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (onDateChange) {
      setIsEditingDate(true);
      setTimeout(() => {
        dateInputRef.current?.showPicker();
      }, 100);
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleMarkAsCompleted = () => {
    if (onStatusChange) {
      onStatusChange(isCompleted ? 'draft' : 'completed');
    }
  };

  return (
    <Box>
      {/* Title */}
      <Typography
        sx={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#111827',
          mb: 2,
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        {interaction.title}
      </Typography>

      {/* Pill buttons row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Date pill button */}
        {isEditingDate ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              type="date"
              value={dateValue}
              onChange={handleDateInputChange}
              inputRef={dateInputRef}
              size="small"
              sx={{
                width: 150,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                  height: '36px',
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
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#0a4a40',
                },
              }}
            >
              Save
            </Button>
            <IconButton
              size="small"
              onClick={handleDateCancel}
              sx={{ p: 0.5 }}
            >
              <X size={16} />
            </IconButton>
          </Box>
        ) : (
          <Button
            onClick={handleDateClick}
            startIcon={<Calendar size={16} />}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              px: 2,
              py: 0.75,
              '&:hover': {
                backgroundColor: '#F9FAFB',
                borderColor: '#D1D5DB',
              },
            }}
          >
            {interaction.interactionDate ? formatDate(interaction.interactionDate) : 'Set date'}
          </Button>
        )}

        {/* Mark as completed button */}
        <Button
          onClick={handleMarkAsCompleted}
          startIcon={<Check size={16} />}
          sx={{
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            color: isCompleted ? '#166534' : '#374151',
            backgroundColor: isCompleted ? '#DCFCE7' : 'white',
            border: '1px solid',
            borderColor: isCompleted ? '#86EFAC' : '#E5E7EB',
            borderRadius: '8px',
            px: 2,
            py: 0.75,
            '&:hover': {
              backgroundColor: isCompleted ? '#BBF7D0' : '#F9FAFB',
              borderColor: isCompleted ? '#4ADE80' : '#D1D5DB',
            },
          }}
        >
          {isCompleted ? 'Completed' : 'Mark as completed'}
        </Button>
      </Box>
    </Box>
  );
}

export default InteractionHeader;
