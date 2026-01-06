'use client';

import { Box, Typography } from '@mui/material';
import { Calendar, Clock, ChevronRight, CheckCircle, ListChecks } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/dateUtils';
import type { Meeting } from '@/types/student';

interface MeetingCardProps {
  meeting: Meeting;
  variant: 'upcoming' | 'past';
  onClick?: () => void;
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

export function MeetingCard({ meeting, variant, onClick }: MeetingCardProps) {
  const isUpcoming = variant === 'upcoming';
  const actionCount = meeting.summary?.recommendedActions?.length || 0;

  return (
    <Box
      onClick={onClick}
      className={`
        flex items-start gap-3 p-4 rounded-lg border cursor-pointer
        transition-colors hover:bg-neutral-50
        ${isUpcoming ? 'border-blue-200 bg-blue-50/30' : 'border-neutral-200 bg-white'}
      `}
    >
      {/* Icon */}
      <Box
        className={`
          p-2 rounded-lg flex-shrink-0
          ${isUpcoming ? 'bg-blue-100' : 'bg-neutral-100'}
        `}
      >
        {isUpcoming ? (
          <Calendar size={18} className="text-blue-600" />
        ) : (
          <CheckCircle size={18} className="text-green-600" />
        )}
      </Box>

      {/* Content */}
      <Box className="flex-1 min-w-0">
        <Typography className="font-medium text-neutral-900 text-sm mb-1">
          {meeting.title}
        </Typography>

        <Box className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <Box className="flex items-center gap-1">
            <Clock size={12} />
            <span>
              {isUpcoming
                ? `${formatDate(meeting.scheduledDate)} at ${formatTime(meeting.scheduledDate)}`
                : formatRelativeTime(meeting.scheduledDate)}
            </span>
          </Box>
          <span>•</span>
          <span>{formatDuration(meeting.duration)}</span>
          <span>•</span>
          <span>with {meeting.counselorName}</span>
        </Box>

        {/* Summary preview for past meetings */}
        {!isUpcoming && meeting.summary && (
          <Typography className="text-xs text-neutral-600 line-clamp-2 mb-2">
            {meeting.summary.overview}
          </Typography>
        )}

        {/* Agenda preview for upcoming meetings */}
        {isUpcoming && meeting.agenda.length > 0 && (
          <Typography className="text-xs text-neutral-600 mb-2">
            {meeting.agenda.length} agenda item{meeting.agenda.length !== 1 ? 's' : ''}
          </Typography>
        )}

        {/* Action items badge for past meetings */}
        {!isUpcoming && actionCount > 0 && (
          <Box className="flex items-center gap-1 text-xs text-amber-600">
            <ListChecks size={12} />
            <span>{actionCount} action item{actionCount !== 1 ? 's' : ''} generated</span>
          </Box>
        )}
      </Box>

      {/* Arrow */}
      <ChevronRight size={18} className="text-neutral-400 flex-shrink-0 mt-1" />
    </Box>
  );
}

export default MeetingCard;
