'use client';

import { Box, Typography, Button, Chip } from '@mui/material';
import { ListTodo, Plus, X, Check, AlertCircle } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import type { MeetingRecommendedAction } from '@/types/student';

interface RecommendedActionsSectionProps {
  actions: MeetingRecommendedAction[];
  onAddToTasks?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
}

const priorityConfig = {
  high: {
    label: 'High',
    color: 'error' as const,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  medium: {
    label: 'Medium',
    color: 'warning' as const,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  low: {
    label: 'Low',
    color: 'default' as const,
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200',
  },
};

export function RecommendedActionsSection({
  actions,
  onAddToTasks,
  onDismiss,
}: RecommendedActionsSectionProps) {
  const pendingActions = actions.filter((a) => a.status === 'pending');
  const processedActions = actions.filter((a) => a.status !== 'pending');

  return (
    <SectionCard
      title="Recommended Actions"
      icon={<ListTodo size={18} className="text-amber-500" />}
    >
      <Box className="space-y-3">
        {/* Pending actions */}
        {pendingActions.map((action) => {
          const priority = priorityConfig[action.priority];

          return (
            <Box
              key={action.id}
              className={`
                flex items-start gap-3 p-3 rounded-lg border
                ${priority.bgColor} ${priority.borderColor}
              `}
            >
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />

              <Box className="flex-1 min-w-0">
                <Box className="flex items-center gap-2 mb-1">
                  <Typography className="font-medium text-neutral-900 text-sm">
                    {action.title}
                  </Typography>
                  <Chip
                    label={priority.label}
                    size="small"
                    color={priority.color}
                    sx={{ height: 18, fontSize: '0.65rem' }}
                  />
                </Box>

                {action.description && (
                  <Typography className="text-xs text-neutral-600 mb-2">
                    {action.description}
                  </Typography>
                )}

                {action.dueDate && (
                  <Typography className="text-xs text-neutral-500">
                    Suggested due: {new Date(action.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                )}
              </Box>

              <Box className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={14} />}
                  onClick={() => onAddToTasks?.(action.id)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                  }}
                >
                  Add to Tasks
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => onDismiss?.(action.id)}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    minWidth: 'auto',
                    p: 0.5,
                  }}
                >
                  <X size={16} />
                </Button>
              </Box>
            </Box>
          );
        })}

        {/* Processed actions */}
        {processedActions.length > 0 && (
          <Box className="pt-3 border-t border-neutral-200 mt-3">
            <Typography className="text-xs text-neutral-500 mb-2">
              Processed
            </Typography>
            {processedActions.map((action) => (
              <Box
                key={action.id}
                className="flex items-center gap-2 py-2 text-neutral-500"
              >
                <Check size={16} className="text-green-500" />
                <Typography className="text-sm line-through">
                  {action.title}
                </Typography>
                <Chip
                  label={action.status === 'converted_to_task' ? 'Added to tasks' : 'Dismissed'}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem' }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Empty state */}
        {actions.length === 0 && (
          <Typography className="text-sm text-neutral-500 py-4 text-center">
            No recommended actions from this meeting
          </Typography>
        )}
      </Box>
    </SectionCard>
  );
}

export default RecommendedActionsSection;
