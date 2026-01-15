'use client';

import { Box } from '@mui/material';
import { SectionCard, EmptyState } from '@/components/shared';
import { ActivityItem } from '@/components/Meetings/ActivityItem';
import type { ActivityItem as ActivityItemType } from '@/types/student';

interface ActivityTabProps {
  activities: ActivityItemType[];
}

export function ActivityTab({ activities }: ActivityTabProps) {
  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <SectionCard title="Activity & history">
        {activities.length === 0 ? (
          <EmptyState type="no_activity" />
        ) : (
          <Box>
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </Box>
        )}
      </SectionCard>
    </Box>
  );
}

export default ActivityTab;
