'use client';

import { Box, Typography } from '@mui/material';
import { Pencil, Sparkles, CheckCircle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/dateUtils';
import type { ActivityItem as ActivityItemType } from '@/types/student';

interface ActivityItemProps {
  activity: ActivityItemType;
}

const typeConfig = {
  note: {
    icon: Pencil,
    label: 'Note',
    bgColor: 'bg-neutral-100',
    iconColor: 'text-neutral-600',
  },
  alma_snapshot: {
    icon: Sparkles,
    label: 'Alma Snapshot',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  milestone_completion: {
    icon: CheckCircle,
    label: 'Milestone Completed',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return (
    <Box className="flex gap-4 py-4 border-b border-neutral-100 last:border-b-0">
      <Box className={`p-2 ${config.bgColor} rounded-lg h-fit flex-shrink-0`}>
        <Icon size={18} className={config.iconColor} />
      </Box>

      <Box className="flex-1 min-w-0">
        <Box className="flex items-center gap-2 mb-1">
          <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            {config.label}
          </Typography>
        </Box>

        {activity.title && (
          <Typography className="font-medium text-neutral-900 text-sm mb-1">
            {activity.title}
          </Typography>
        )}

        <Typography className="text-sm text-neutral-600 leading-relaxed">
          {activity.content}
        </Typography>
      </Box>

      <Typography className="text-xs text-neutral-400 flex-shrink-0">
        {formatRelativeTime(activity.createdAt)}
      </Typography>
    </Box>
  );
}

export default ActivityItem;
