'use client';

import { Box, Typography, Button, Divider } from '@mui/material';
import { Calendar, Clock, User, ListChecks, CheckCircle } from 'lucide-react';
import type { AgendaItem } from '@/types/student';

interface StepConfirmProps {
  meetingTitle: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  agenda: AgendaItem[];
  counselorName: string;
  onConfirm: () => void;
  onBack: () => void;
}

function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDisplayTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours !== 1 ? 's' : ''}`;
}

export function StepConfirm({
  meetingTitle,
  scheduledDate,
  scheduledTime,
  duration,
  agenda,
  counselorName,
  onConfirm,
  onBack,
}: StepConfirmProps) {
  return (
    <Box className="p-4 flex flex-col h-full">
      <Box className="flex-1 overflow-y-auto space-y-4">
        {/* Success icon and title */}
        <Box className="text-center py-4">
          <Box className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <CheckCircle size={24} className="text-green-600" />
          </Box>
          <Typography className="text-lg font-semibold text-neutral-900">
            Ready to Schedule
          </Typography>
          <Typography className="text-sm text-neutral-500">
            Review the details below and confirm
          </Typography>
        </Box>

        {/* Meeting Details Card */}
        <Box className="border border-neutral-200 rounded-lg overflow-hidden">
          {/* Title */}
          <Box className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
            <Typography className="font-semibold text-neutral-900">
              {meetingTitle}
            </Typography>
          </Box>

          {/* Details */}
          <Box className="p-4 space-y-3">
            <Box className="flex items-center gap-3">
              <Calendar size={16} className="text-neutral-400" />
              <Typography className="text-sm text-neutral-700">
                {formatDisplayDate(scheduledDate)}
              </Typography>
            </Box>

            <Box className="flex items-center gap-3">
              <Clock size={16} className="text-neutral-400" />
              <Typography className="text-sm text-neutral-700">
                {formatDisplayTime(scheduledTime)} ({formatDuration(duration)})
              </Typography>
            </Box>

            <Box className="flex items-center gap-3">
              <User size={16} className="text-neutral-400" />
              <Typography className="text-sm text-neutral-700">
                {counselorName}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Agenda Preview */}
        <Box className="border border-neutral-200 rounded-lg overflow-hidden">
          <Box className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center gap-2">
            <ListChecks size={16} className="text-neutral-500" />
            <Typography className="font-medium text-neutral-700 text-sm">
              Agenda ({agenda.length} items)
            </Typography>
          </Box>

          <Box className="p-4">
            <Box className="space-y-2">
              {agenda.map((item, index) => (
                <Box key={item.id} className="flex items-start gap-2">
                  <Typography className="text-xs text-neutral-400 font-medium mt-0.5">
                    {index + 1}.
                  </Typography>
                  <Box className="flex-1">
                    <Typography className="text-sm text-neutral-700">
                      {item.topic}
                    </Typography>
                    {item.description && (
                      <Typography className="text-xs text-neutral-500">
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                  {item.duration && (
                    <Typography className="text-xs text-neutral-400">
                      {item.duration} min
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Info note */}
        <Typography className="text-xs text-neutral-500 text-center">
          The student will receive a notification about this meeting.
          You can edit the agenda at any time before the meeting.
        </Typography>
      </Box>

      {/* Actions */}
      <Box className="flex gap-2 pt-4 border-t border-neutral-100 mt-4">
        <Button
          variant="text"
          onClick={onBack}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onConfirm}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Schedule Meeting
        </Button>
      </Box>
    </Box>
  );
}

export default StepConfirm;
