'use client';

import { Box, Typography, Button, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Clock, Calendar } from 'lucide-react';
import { Slate } from '@/theme/primitives';

interface StepDurationProps {
  duration: number;
  scheduledDate: string;
  scheduledTime: string;
  onDurationChange: (duration: number) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onSchedule: () => void;
  onAddAgenda: () => void;
  onCancel: () => void;
  canProceed: boolean;
}

const DURATION_OPTIONS = [15, 30, 45, 60];

interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

// Dummy data simulating Google Calendar / Microsoft Teams integration
// In production, this would come from an API call to check calendar availability
function getAvailableTimeSlots(dateString: string): TimeSlot[] {
  const dayOfWeek = dayjs(dateString).day();

  // Base time slots for a typical work day
  const baseSlots: TimeSlot[] = [
    { time: '08:00', label: '8:00 AM', available: true },
    { time: '08:30', label: '8:30 AM', available: true },
    { time: '09:00', label: '9:00 AM', available: true },
    { time: '09:30', label: '9:30 AM', available: true },
    { time: '10:00', label: '10:00 AM', available: true },
    { time: '10:30', label: '10:30 AM', available: true },
    { time: '11:00', label: '11:00 AM', available: true },
    { time: '11:30', label: '11:30 AM', available: true },
    { time: '13:00', label: '1:00 PM', available: true },
    { time: '13:30', label: '1:30 PM', available: true },
    { time: '14:00', label: '2:00 PM', available: true },
    { time: '14:30', label: '2:30 PM', available: true },
    { time: '15:00', label: '3:00 PM', available: true },
    { time: '15:30', label: '3:30 PM', available: true },
    { time: '16:00', label: '4:00 PM', available: true },
    { time: '16:30', label: '4:30 PM', available: true },
  ];

  // Simulate different availability patterns based on day of week
  // This mimics what a real calendar integration would return
  const busyPatterns: Record<number, string[]> = {
    1: ['09:00', '09:30', '14:00', '14:30'], // Monday: morning meeting, afternoon meeting
    2: ['10:00', '10:30', '11:00', '15:00', '15:30'], // Tuesday: mid-morning block, afternoon
    3: ['08:00', '08:30', '13:00', '13:30', '14:00'], // Wednesday: early morning, post-lunch
    4: ['09:30', '10:00', '10:30', '16:00', '16:30'], // Thursday: mid-morning, end of day
    5: ['11:00', '11:30', '14:00', '14:30', '15:00'], // Friday: late morning, early afternoon
    0: [], // Sunday (shouldn't appear)
    6: [], // Saturday (shouldn't appear)
  };

  const busyTimes = busyPatterns[dayOfWeek] || [];

  return baseSlots.map(slot => ({
    ...slot,
    available: !busyTimes.includes(slot.time),
  }));
}

export function StepDuration({
  duration,
  scheduledDate,
  scheduledTime,
  onDurationChange,
  onDateChange,
  onTimeChange,
  onSchedule,
  onAddAgenda,
  onCancel,
  canProceed,
}: StepDurationProps) {
  // Get tomorrow's date as default minimum
  const tomorrow = dayjs().add(1, 'day');

  // Convert string date to dayjs for the calendar
  const selectedDate = scheduledDate ? dayjs(scheduledDate) : null;

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      onDateChange(date.format('YYYY-MM-DD'));
      // Clear time selection when date changes since availability differs by day
      onTimeChange('');
    }
  };

  return (
    <Box className="p-4 flex flex-col h-full">
      <Box className="flex-1 space-y-6">
        {/* Duration selection */}
        <Box>
          <Box className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-neutral-500" />
            <Typography className="text-sm font-medium text-neutral-700">
              Meeting duration
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
              Date
            </Typography>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              minDate={tomorrow}
              sx={{
                width: '100%',
                '& .MuiPickersCalendarHeader-root': {
                  paddingLeft: 1,
                  paddingRight: 1,
                },
                '& .MuiDayCalendar-weekContainer': {
                  justifyContent: 'space-around',
                },
                '& .MuiPickersDay-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Time slot selection - appears after date is selected */}
        {scheduledDate && (
          <Box>
            <Box className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-neutral-500" />
              <Typography className="text-sm font-medium text-neutral-700">
                Available times
              </Typography>
              <Typography className="text-xs text-neutral-400 ml-auto">
                Synced with your calendar
              </Typography>
            </Box>

            <Box className="flex flex-wrap gap-2">
              {getAvailableTimeSlots(scheduledDate).map((slot) => (
                <Chip
                  key={slot.time}
                  label={slot.label}
                  onClick={() => slot.available && onTimeChange(slot.time)}
                  disabled={!slot.available}
                  variant={scheduledTime === slot.time ? 'filled' : 'outlined'}
                  sx={{
                    minWidth: 80,
                    cursor: slot.available ? 'pointer' : 'not-allowed',
                    ...(scheduledTime === slot.time && {
                      backgroundColor: Slate[700],
                      color: 'white',
                      '&:hover': {
                        backgroundColor: Slate[800],
                      },
                    }),
                    ...(!slot.available && {
                      backgroundColor: Slate[50],
                      borderColor: Slate[200],
                      color: Slate[400],
                      textDecoration: 'line-through',
                      opacity: 0.7,
                    }),
                    ...(slot.available && scheduledTime !== slot.time && {
                      borderColor: Slate[300],
                      color: Slate[700],
                      '&:hover': {
                        backgroundColor: Slate[50],
                        borderColor: Slate[400],
                      },
                    }),
                  }}
                />
              ))}
            </Box>

          </Box>
        )}

      </Box>

      {/* Actions */}
      <Box className="flex flex-col gap-3 pt-4 border-t border-neutral-100 mt-4">
        <Box className="flex gap-2">
          <Button
            variant="text"
            onClick={onCancel}
            sx={{ textTransform: 'none', flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSchedule}
            disabled={!canProceed}
            sx={{ textTransform: 'none', flex: 1 }}
          >
            Schedule
          </Button>
        </Box>
        <Button
          variant="text"
          onClick={onAddAgenda}
          disabled={!canProceed}
          sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.875rem' }}
        >
          Add an agenda instead
        </Button>
      </Box>
    </Box>
  );
}

export default StepDuration;
