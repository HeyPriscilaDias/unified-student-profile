'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Modal,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { X, Sparkles, Mic } from 'lucide-react';
import { MeetingIntelligence } from '@/components/MeetingIntelligence';
import { Slate } from '@/theme/primitives';
import { useStudentData } from '@/hooks/useStudentData';
import { generateTextAgenda } from '@/lib/geminiService';
import { agendaItemsToText } from './agendaUtils';
import type { Meeting } from '@/types/student';

interface ScheduleMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (data: ScheduledMeetingData) => void;
  onSave?: (data: ScheduledMeetingData) => void;
  studentId: string;
  studentName: string;
  existingMeeting?: Meeting | null;
}

export interface ScheduledMeetingData {
  title: string;
  scheduledDate: string;
  duration: number;
  guests: string;
  agenda: string;
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
  onSave,
  studentId,
  studentName,
  existingMeeting,
}: ScheduleMeetingModalProps) {
  const isEditMode = !!existingMeeting;

  const [step, setStep] = useState<Step>('datetime');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [agendaText, setAgendaText] = useState<string>('');
  const [isGeneratingAgenda, setIsGeneratingAgenda] = useState<boolean>(false);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [showMeetingIntelligence, setShowMeetingIntelligence] = useState(false);

  const studentData = useStudentData(studentId);

  // Initialize state when opening in edit mode
  useEffect(() => {
    if (open && existingMeeting && !hasInitialized) {
      const meetingDate = dayjs(existingMeeting.scheduledDate);
      setSelectedDate(meetingDate.format('YYYY-MM-DD'));
      setSelectedTime(meetingDate.format('HH:mm'));

      // Convert agenda items to text
      const formattedDate = meetingDate.format('MMMM D, YYYY');
      const agendaAsText = agendaItemsToText(
        existingMeeting.agenda,
        studentName,
        studentData?.student.grade,
        formattedDate
      );
      setAgendaText(agendaAsText);
      setStep('details');
      setHasInitialized(true);
    }
  }, [open, existingMeeting, hasInitialized, studentName, studentData?.student.grade]);

  // Reset hasInitialized when modal closes
  useEffect(() => {
    if (!open) {
      setHasInitialized(false);
    }
  }, [open]);

  const tomorrow = dayjs().add(1, 'day');
  const dateValue = selectedDate ? dayjs(selectedDate) : null;

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date.format('YYYY-MM-DD'));
      setSelectedTime('');
    }
  };

  const handleNext = useCallback(async () => {
    setStep('details');
    setIsGeneratingAgenda(true);

    try {
      const meetingDate = `${selectedDate}T${selectedTime}:00`;
      if (studentData) {
        const generatedAgenda = await generateTextAgenda(studentData, meetingDate);
        setAgendaText(generatedAgenda);
      } else {
        // Fallback if student data not loaded
        setAgendaText(`Meeting with ${studentName}\n\nPRIORITY ITEMS\n- \n\nDISCUSSION TOPICS\n- \n\nNOTES\n`);
      }
    } catch (error) {
      console.error('Failed to generate agenda:', error);
      // Set a basic fallback
      setAgendaText(`Meeting with ${studentName}\n\nPRIORITY ITEMS\n- \n\nDISCUSSION TOPICS\n- \n\nNOTES\n`);
    } finally {
      setIsGeneratingAgenda(false);
    }
  }, [selectedDate, selectedTime, studentData, studentName]);

  const handleBack = () => {
    setStep('datetime');
  };

  const handleSchedule = () => {
    const dateTime = `${selectedDate}T${selectedTime}:00Z`;
    const meetingData: ScheduledMeetingData = {
      title: `Meeting with ${studentName}`,
      scheduledDate: dateTime,
      duration: existingMeeting?.duration || DEFAULT_DURATION,
      guests: '',
      agenda: agendaText,
      location: '',
    };

    if (isEditMode && onSave) {
      onSave(meetingData);
    } else {
      onSchedule(meetingData);
    }
    handleReset();
  };

  const handleReset = () => {
    setStep('datetime');
    setSelectedDate('');
    setSelectedTime('');
    setAgendaText('');
    setIsGeneratingAgenda(false);
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
          {isEditMode
            ? (step === 'datetime' ? 'Reschedule Meeting' : 'Edit Meeting')
            : (step === 'datetime' ? 'Schedule Meeting' : 'Meeting Details')}
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
            <Box className="bg-slate-50 rounded-lg p-3 mb-4">
              <Typography className="text-sm text-slate-600">
                {formatDisplayDate(selectedDate)} at {formatDisplayTime(selectedTime)}
              </Typography>
            </Box>

            {/* Loading state or text editor */}
            {isGeneratingAgenda ? (
              <Box className="flex flex-col items-center justify-center py-12">
                <Box className="relative">
                  <CircularProgress size={40} sx={{ color: Slate[300] }} />
                  <Box className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={18} className="text-amber-500" />
                  </Box>
                </Box>
                <Typography className="text-base font-medium text-neutral-900 mt-4">
                  Preparing your meeting agenda
                </Typography>
                <Typography className="text-sm text-neutral-500 text-center mt-1">
                  Analyzing {studentName}&apos;s milestones and goals...
                </Typography>
              </Box>
            ) : (
              <TextField
                fullWidth
                multiline
                minRows={14}
                maxRows={20}
                value={agendaText}
                onChange={(e) => setAgendaText(e.target.value)}
                placeholder="Meeting agenda will appear here..."
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.7,
                    backgroundColor: 'white',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: Slate[200],
                    },
                    '&:hover fieldset': {
                      borderColor: Slate[300],
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: Slate[400],
                    },
                  },
                  '& .MuiInputBase-input': {
                    whiteSpace: 'pre-wrap',
                  },
                }}
              />
            )}

            {/* Actions */}
            <Box className="flex flex-col gap-3 mt-4 pt-4 border-t border-neutral-100">
              {isEditMode && (
                <Button
                  variant="contained"
                  startIcon={<Mic size={18} />}
                  onClick={() => setShowMeetingIntelligence(true)}
                  sx={{
                    textTransform: 'none',
                    py: 1.25,
                    backgroundColor: '#062F29',
                    '&:hover': {
                      backgroundColor: '#2B4C46',
                    },
                  }}
                >
                  Start Meeting
                </Button>
              )}
              <Box className="flex gap-3">
                <Button
                  variant="text"
                  onClick={handleBack}
                  disabled={isGeneratingAgenda}
                  sx={{ textTransform: 'none', flex: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSchedule}
                  disabled={isGeneratingAgenda}
                  sx={{ textTransform: 'none', flex: 2 }}
                >
                  {isEditMode ? 'Save Changes' : 'Schedule Meeting'}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Meeting Intelligence Modal */}
      <Modal
        open={showMeetingIntelligence}
        onClose={() => setShowMeetingIntelligence(false)}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1400,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
            maxHeight: '90vh',
            mx: 2,
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            outline: 'none',
          }}
        >
          <MeetingIntelligence
            studentName={studentName}
            onClose={() => setShowMeetingIntelligence(false)}
          />
        </Box>
      </Modal>
    </Dialog>
  );
}

export default ScheduleMeetingModal;
