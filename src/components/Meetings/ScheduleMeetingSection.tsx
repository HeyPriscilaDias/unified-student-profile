'use client';

import { Box, Typography, Button } from '@mui/material';
import { Calendar, Clock } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import { formatDate, formatRelativeTime } from '@/lib/dateUtils';
import type { Meeting } from '@/types/student';

interface LastMeeting {
  date: string;
  conductedBy: string;
}

interface ScheduleMeetingSectionProps {
  onScheduleMeeting?: () => void;
  lastMeeting?: LastMeeting | null;
  upcomingMeeting?: Meeting | null;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function ScheduleMeetingSection({
  onScheduleMeeting,
  lastMeeting,
  upcomingMeeting,
}: ScheduleMeetingSectionProps) {
  return (
    <SectionCard title="Meetings">
      <Box className="flex flex-col gap-4">
        {/* Meeting Status Row */}
        <Box className="flex gap-6">
          {/* Last Meeting */}
          <Box className="flex-1">
            <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Last Meeting
            </Typography>
            {lastMeeting ? (
              <Box className="flex items-center gap-2">
                <Typography className="text-sm text-neutral-900">
                  {formatRelativeTime(lastMeeting.date)}
                </Typography>
                <Typography className="text-sm text-neutral-500">
                  with {lastMeeting.conductedBy}
                </Typography>
              </Box>
            ) : (
              <Typography className="text-sm text-neutral-400">
                No previous meetings
              </Typography>
            )}
          </Box>

          {/* Upcoming Meeting */}
          <Box className="flex-1">
            <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Next Meeting
            </Typography>
            {upcomingMeeting ? (
              <Box className="flex items-center gap-2">
                <Clock size={14} className="text-neutral-400" />
                <Typography className="text-sm text-neutral-900">
                  {formatDate(upcomingMeeting.scheduledDate)} at {formatTime(upcomingMeeting.scheduledDate)}
                </Typography>
                {upcomingMeeting.title && (
                  <Typography className="text-sm text-neutral-500">
                    - {upcomingMeeting.title}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography className="text-sm text-neutral-400">
                No upcoming meetings scheduled
              </Typography>
            )}
          </Box>
        </Box>

        {/* Schedule Button Row */}
        <Box className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <Typography className="text-neutral-500 text-sm">
            Schedule a meeting with this student to discuss their progress and goals.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Calendar size={18} />}
            onClick={onScheduleMeeting}
            className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            sx={{ textTransform: 'none' }}
          >
            Schedule meeting
          </Button>
        </Box>
      </Box>
    </SectionCard>
  );
}

export default ScheduleMeetingSection;
