'use client';

import { Box, Typography } from '@mui/material';
import { SectionCard, EmptyState } from '@/components/shared';
import { MeetingCard } from './MeetingCard';
import type { Meeting } from '@/types/student';

interface UpcomingMeetingsSectionProps {
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
}

export function UpcomingMeetingsSection({ meetings, onMeetingClick }: UpcomingMeetingsSectionProps) {
  if (meetings.length === 0) {
    return (
      <SectionCard title="Upcoming meetings">
        <Box className="py-4 text-center">
          <Typography className="text-sm text-neutral-500">
            No upcoming meetings scheduled
          </Typography>
        </Box>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Upcoming meetings">
      <Box className="flex flex-col gap-3">
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            variant="upcoming"
            onClick={() => onMeetingClick?.(meeting)}
          />
        ))}
      </Box>
    </SectionCard>
  );
}

export default UpcomingMeetingsSection;
