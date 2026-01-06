'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SectionCard } from '@/components/shared';
import { MeetingCard } from './MeetingCard';
import type { Meeting } from '@/types/student';

interface PastMeetingsSectionProps {
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
  initialDisplayCount?: number;
}

export function PastMeetingsSection({
  meetings,
  onMeetingClick,
  initialDisplayCount = 3,
}: PastMeetingsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (meetings.length === 0) {
    return (
      <SectionCard title="Past meetings">
        <Box className="py-4 text-center">
          <Typography className="text-sm text-neutral-500">
            No past meetings yet
          </Typography>
        </Box>
      </SectionCard>
    );
  }

  const displayedMeetings = showAll ? meetings : meetings.slice(0, initialDisplayCount);
  const hasMore = meetings.length > initialDisplayCount;

  return (
    <SectionCard title="Past meetings">
      <Box className="flex flex-col gap-3">
        {displayedMeetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            variant="past"
            onClick={() => onMeetingClick?.(meeting)}
          />
        ))}

        {hasMore && !showAll && (
          <Button
            variant="text"
            onClick={() => setShowAll(true)}
            className="text-neutral-600 hover:text-neutral-900"
            sx={{ textTransform: 'none', alignSelf: 'center', mt: 1 }}
          >
            View all past meetings ({meetings.length})
          </Button>
        )}
      </Box>
    </SectionCard>
  );
}

export default PastMeetingsSection;
