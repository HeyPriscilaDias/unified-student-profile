'use client';

import { Box, Typography, Chip } from '@mui/material';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Meeting, MeetingStatus } from '@/types/student';

interface MeetingHeaderProps {
  meeting: Meeting;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

const statusConfig: Record<MeetingStatus, { label: string; color: 'default' | 'primary' | 'success' | 'error' }> = {
  scheduled: { label: 'Scheduled', color: 'primary' },
  in_progress: { label: 'In Progress', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

export function MeetingHeader({ meeting }: MeetingHeaderProps) {
  const status = statusConfig[meeting.status];

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid #E5E7EB',
        p: 3,
      }}
    >
      <Box className="flex items-start justify-between mb-4">
        <Typography variant="h5" className="font-semibold text-neutral-900">
          {meeting.title}
        </Typography>
        <Chip
          label={status.label}
          color={status.color}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>

      <Box className="flex items-center gap-6 text-neutral-600">
        <Box className="flex items-center gap-2">
          <Calendar size={16} className="text-neutral-400" />
          <Typography className="text-sm">
            {formatDate(meeting.scheduledDate)}
          </Typography>
        </Box>

        <Box className="flex items-center gap-2">
          <Clock size={16} className="text-neutral-400" />
          <Typography className="text-sm">
            {formatTime(meeting.scheduledDate)} ({formatDuration(meeting.duration)})
          </Typography>
        </Box>

        <Box className="flex items-center gap-2">
          <User size={16} className="text-neutral-400" />
          <Typography className="text-sm">
            {meeting.counselorName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default MeetingHeader;
