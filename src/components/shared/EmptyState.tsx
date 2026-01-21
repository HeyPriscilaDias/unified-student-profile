'use client';

import { Box, Typography, Button } from '@mui/material';
import {
  Target,
  UserPlus,
  Calendar,
  Bookmark,
  Brain,
  CheckSquare,
  Flag,
  Activity,
} from 'lucide-react';
import type { EmptyStateType } from '@/types/student';
import type { ReactNode } from 'react';

interface EmptyStateConfig {
  icon: ReactNode;
  message: string;
  cta?: string;
}

const iconStyle = { color: '#D1D5DB' };

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
  no_milestones: {
    icon: <Target size={40} style={iconStyle} />,
    message: 'No milestones completed yet',
  },
  new_student: {
    icon: <UserPlus size={40} style={iconStyle} />,
    message: 'This student is new. Complete onboarding to see more data.',
  },
  no_interactions: {
    icon: <Calendar size={40} style={iconStyle} />,
    message: 'No interactions scheduled yet',
    cta: 'Schedule interaction',
  },
  no_bookmarks: {
    icon: <Bookmark size={40} style={iconStyle} />,
    message: 'No bookmarks yet. Encourage exploration!',
  },
  no_reflections: {
    icon: <Brain size={40} style={iconStyle} />,
    message: 'No AI reflections available yet',
  },
  no_tasks: {
    icon: <CheckSquare size={40} style={iconStyle} />,
    message: 'No active tasks for this student.',
    cta: 'New task',
  },
  no_goals: {
    icon: <Flag size={40} style={iconStyle} />,
    message: 'No SMART goals set',
  },
  no_activity: {
    icon: <Activity size={40} style={iconStyle} />,
    message: 'No activity recorded yet',
  },
};

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ type, onAction, className = '' }: EmptyStateProps) {
  const config = emptyStateConfigs[type];

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 2 }}>{config.icon}</Box>
      <Typography
        sx={{
          color: '#6B7280',
          fontSize: '14px',
          mb: 2,
        }}
      >
        {config.message}
      </Typography>
      {config.cta && onAction && (
        <Button
          variant="outlined"
          size="small"
          onClick={onAction}
          sx={{
            fontSize: '14px',
            textTransform: 'none',
            borderColor: '#D5D7DA',
            color: '#062F29',
            '&:hover': {
              borderColor: '#062F29',
              backgroundColor: 'rgba(6, 47, 41, 0.04)',
            },
          }}
        >
          {config.cta}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
