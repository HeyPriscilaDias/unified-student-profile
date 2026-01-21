'use client';

import { Box, Typography, Button, Chip } from '@mui/material';
import { ListTodo, Plus, X, Check, AlertCircle } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import type { InteractionRecommendedAction } from '@/types/student';

interface RecommendedActionsSectionProps {
  actions: InteractionRecommendedAction[];
  onAddToTasks?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
}

function ActionItem({
  action,
  onAddToTasks,
  onDismiss,
}: {
  action: InteractionRecommendedAction;
  onAddToTasks?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
}) {
  const isPending = action.status === 'pending';

  if (!isPending) {
    return (
      <Box className="flex items-center gap-2 py-2 text-neutral-500">
        <Check size={16} className="text-green-500" />
        <Typography className="text-sm line-through">{action.title}</Typography>
        <Chip
          label={action.status === 'converted_to_task' ? 'Added' : 'Dismissed'}
          size="small"
          sx={{ height: 18, fontSize: '0.65rem' }}
        />
      </Box>
    );
  }

  return (
    <Box className="flex items-start gap-3 p-3 rounded-lg border bg-neutral-50 border-neutral-200">
      <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />

      <Box className="flex-1 min-w-0">
        <Typography className="font-medium text-neutral-900 text-sm mb-1">
          {action.title}
        </Typography>

        {action.description && (
          <Typography className="text-xs text-neutral-600 mb-2">
            {action.description}
          </Typography>
        )}

        {action.dueDate && (
          <Typography className="text-xs text-neutral-500">
            Suggested due:{' '}
            {new Date(action.dueDate).toLocaleDateString('en-US', {
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
          Add to tasks
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
}

export function RecommendedActionsSection({
  actions,
  onAddToTasks,
  onDismiss,
}: RecommendedActionsSectionProps) {
  const studentTasks = actions.filter((a) => a.assignee === 'student');
  const counselorTasks = actions.filter((a) => a.assignee === 'staff');

  const pendingStudentTasks = studentTasks.filter((a) => a.status === 'pending');
  const pendingCounselorTasks = counselorTasks.filter((a) => a.status === 'pending');
  const processedStudentTasks = studentTasks.filter((a) => a.status !== 'pending');
  const processedCounselorTasks = counselorTasks.filter((a) => a.status !== 'pending');

  return (
    <SectionCard
      title="Suggested tasks"
      icon={<ListTodo size={18} className="text-amber-500" />}
    >
      <Box className="space-y-6">
        {/* Student tasks section */}
        {studentTasks.length > 0 && (
          <Box>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1.5,
              }}
            >
              Student tasks
            </Typography>
            <Box className="space-y-2">
              {pendingStudentTasks.map((action) => (
                <ActionItem
                  key={action.id}
                  action={action}
                  onAddToTasks={onAddToTasks}
                  onDismiss={onDismiss}
                />
              ))}
              {processedStudentTasks.map((action) => (
                <ActionItem
                  key={action.id}
                  action={action}
                  onAddToTasks={onAddToTasks}
                  onDismiss={onDismiss}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Counselor tasks section */}
        {counselorTasks.length > 0 && (
          <Box>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1.5,
              }}
            >
              Counselor tasks
            </Typography>
            <Box className="space-y-2">
              {pendingCounselorTasks.map((action) => (
                <ActionItem
                  key={action.id}
                  action={action}
                  onAddToTasks={onAddToTasks}
                  onDismiss={onDismiss}
                />
              ))}
              {processedCounselorTasks.map((action) => (
                <ActionItem
                  key={action.id}
                  action={action}
                  onAddToTasks={onAddToTasks}
                  onDismiss={onDismiss}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Empty state */}
        {actions.length === 0 && (
          <Typography className="text-sm text-neutral-500 py-4 text-center">
            No suggested tasks from this interaction
          </Typography>
        )}
      </Box>
    </SectionCard>
  );
}

export default RecommendedActionsSection;
