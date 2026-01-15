'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { X, Type, Users, ListChecks, MapPin } from 'lucide-react';
import { Slate } from '@/theme/primitives';
import { InlineAgendaBuilder } from './InlineAgendaBuilder';
import type { StudentData, AgendaItem } from '@/types/student';

interface ScheduleMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (data: ScheduledMeetingData) => void;
  studentData: StudentData;
}

export interface ScheduledMeetingData {
  title: string;
  scheduledDate: string;
  duration: number;
  guests: string;
  agenda: AgendaItem[];
  location: string;
}

interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

function getAvailableTimeSlots(dateString: string): TimeSlot[] {
  const dayOfWeek = dayjs(dateString).day();

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

  const busyPatterns: Record<number, string[]> = {
    1: ['09:00', '09:30', '14:00', '14:30'],
    2: ['10:00', '10:30', '11:00', '15:00', '15:30'],
    3: ['08:00', '08:30', '13:00', '13:30', '14:00'],
    4: ['09:30', '10:00', '10:30', '16:00', '16:30'],
    5: ['11:00', '11:30', '14:00', '14:30', '15:00'],
    0: [],
    6: [],
  };

  const busyTimes = busyPatterns[dayOfWeek] || [];

  return baseSlots.map((slot) => ({
    ...slot,
    available: !busyTimes.includes(slot.time),
  }));
}

function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatDisplayTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

type Step = 'datetime' | 'details';

const DEFAULT_DURATION = 30;

export function ScheduleMeetingModal({
  open,
  onClose,
  onSchedule,
  studentData,
}: ScheduleMeetingModalProps) {
  const [step, setStep] = useState<Step>('datetime');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [location, setLocation] = useState<string>('');
  const [showAgendaBuilder, setShowAgendaBuilder] = useState(false);

  const studentName = studentData.student.firstName;
  const tomorrow = dayjs().add(1, 'day');
  const dateValue = selectedDate ? dayjs(selectedDate) : null;

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date.format('YYYY-MM-DD'));
      setSelectedTime('');
    }
  };

  const handleNext = () => {
    setStep('details');
  };

  const handleBack = () => {
    setStep('datetime');
  };

  const handleAgendaChange = useCallback((newAgenda: AgendaItem[]) => {
    setAgenda(newAgenda);
  }, []);

  const handleSchedule = () => {
    const dateTime = `${selectedDate}T${selectedTime}:00Z`;
    onSchedule({
      title: title || `Meeting with ${studentName}`,
      scheduledDate: dateTime,
      duration: DEFAULT_DURATION,
      guests,
      agenda,
      location,
    });
    handleReset();
  };

  const handleReset = () => {
    setStep('datetime');
    setSelectedDate('');
    setSelectedTime('');
    setTitle('');
    setGuests('');
    setAgenda([]);
    setLocation('');
    setShowAgendaBuilder(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const canProceedToDetails = selectedDate && selectedTime;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <Box className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
        <Typography className="text-lg font-semibold text-neutral-900">
          {step === 'datetime' ? 'Schedule Meeting' : 'Meeting Details'}
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {step === 'datetime' ? (
          <Box className="p-6">
            {/* Calendar */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={dateValue}
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

            {/* Time slots - appear after date selection */}
            {selectedDate && (
              <Box className="mt-4">
                <Typography className="text-sm font-medium text-neutral-700 mb-3">
                  Available times for {formatDisplayDate(selectedDate)}
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {getAvailableTimeSlots(selectedDate).map((slot) => (
                    <Chip
                      key={slot.time}
                      label={slot.label}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      variant={selectedTime === slot.time ? 'filled' : 'outlined'}
                      sx={{
                        minWidth: 80,
                        cursor: slot.available ? 'pointer' : 'not-allowed',
                        ...(selectedTime === slot.time && {
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
                        ...(slot.available &&
                          selectedTime !== slot.time && {
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

            {/* Next button */}
            <Box className="mt-6 pt-4 border-t border-neutral-100">
              <Button
                variant="contained"
                fullWidth
                onClick={handleNext}
                disabled={!canProceedToDetails}
                sx={{ textTransform: 'none', py: 1.25 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        ) : (
          <Box className="p-6">
            {/* Selected date/time summary */}
            <Box className="bg-slate-50 rounded-lg p-3 mb-6">
              <Typography className="text-sm text-slate-600">
                {formatDisplayDate(selectedDate)} at {formatDisplayTime(selectedTime)}
              </Typography>
            </Box>

            {/* Form fields */}
            <Box className="space-y-4">
              {/* Title */}
              <TextField
                fullWidth
                placeholder="Add title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Type size={18} className="text-neutral-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              />

              {/* Guests */}
              <TextField
                fullWidth
                placeholder="Add guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Users size={18} className="text-neutral-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              />

              {/* Agenda */}
              {!showAgendaBuilder ? (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ListChecks size={18} />}
                  onClick={() => setShowAgendaBuilder(true)}
                  sx={{
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    py: 1.5,
                    color: 'text.secondary',
                    borderColor: 'divider',
                  }}
                >
                  Add meeting agenda
                </Button>
              ) : (
                <InlineAgendaBuilder
                  studentData={studentData}
                  duration={DEFAULT_DURATION}
                  onAgendaChange={handleAgendaChange}
                  onCollapse={() => setShowAgendaBuilder(false)}
                />
              )}

              {/* Location */}
              <TextField
                fullWidth
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={18} className="text-neutral-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              />
            </Box>

            {/* Actions */}
            <Box className="flex gap-3 mt-6 pt-4 border-t border-neutral-100">
              <Button
                variant="text"
                onClick={handleBack}
                sx={{ textTransform: 'none', flex: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSchedule}
                sx={{ textTransform: 'none', flex: 2 }}
              >
                Schedule
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleMeetingModal;
