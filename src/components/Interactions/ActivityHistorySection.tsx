'use client';

import { Box } from '@mui/material';
import { SectionCard, EmptyState } from '@/components/shared';
import { ActivityItem } from './ActivityItem';
import type { ActivityItem as ActivityItemType } from '@/types/student';

interface ActivityHistorySectionProps {
  activities: ActivityItemType[];
}

export function ActivityHistorySection({ activities }: ActivityHistorySectionProps) {
  if (activities.length === 0) {
    return (
      <SectionCard title="Activity & history">
        <EmptyState type="no_activity" />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Activity & history">
      <Box>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </Box>
    </SectionCard>
  );
}

export default ActivityHistorySection;
