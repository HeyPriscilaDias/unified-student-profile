'use client';

import { useState, useRef } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction, InteractionStatus } from '@/types/student';

// Status icons matching the meetings list
function HeldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.875 10.625L8.75 12.5L13.125 8.125M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NotHeldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.12505 2.73356C9.35467 2.41433 10.6454 2.41433 11.875 2.73356M2.77271 7.99137C3.11127 6.76717 3.75663 5.64962 4.64771 4.7445M4.64771 15.2547C3.7564 14.3491 3.11102 13.231 2.77271 12.0062M11.875 17.2648C10.6454 17.584 9.35467 17.584 8.12505 17.2648M17.2274 12.007C16.8888 13.2312 16.2435 14.3487 15.3524 15.2539M15.3524 4.74371C16.2437 5.64928 16.8891 6.7674 17.2274 7.99215" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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
    const newDate = e.target.value;
    setDateValue(newDate);
    if (onDateChange) {
      onDateChange(newDate || undefined);
    }
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
          <TextField
            type="date"
            value={dateValue}
            onChange={handleDateInputChange}
            onBlur={() => setIsEditingDate(false)}
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

        {/* Mark as held button */}
        <Button
          onClick={handleMarkAsCompleted}
          startIcon={isCompleted ? <HeldIcon size={16} /> : <NotHeldIcon size={16} />}
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
          {isCompleted ? 'Held' : 'Not held yet'}
        </Button>
      </Box>
    </Box>
  );
}

export default InteractionHeader;
