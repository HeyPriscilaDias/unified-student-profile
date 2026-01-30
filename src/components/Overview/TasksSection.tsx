'use client';

import { useState } from 'react';
import { Box, Typography, Checkbox, Button, Chip } from '@mui/material';
import { Plus, Target } from 'lucide-react';
import { SubTabNavigation, EmptyState } from '@/components/shared';
import type { Task, SmartGoal } from '@/types/student';

interface TasksSectionProps {
  tasks: Task[];
  goals?: SmartGoal[];
  onTaskToggle?: (task: Task) => void;
  onNewTask?: () => void;
}

function TaskItem({
  task,
  goalName,
  onToggle,
}: {
  task: Task;
  goalName?: string;
  onToggle?: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.5,
        borderBottom: '1px solid #E5E7EB',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Checkbox
        checked={task.status === 'completed'}
        onChange={onToggle}
        size="small"
        sx={{
          padding: 0,
          marginTop: '2px',
          '&.Mui-checked': {
            color: '#22C55E',
          },
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            sx={{
              fontSize: '14px',
              color: task.status === 'completed' ? '#9CA3AF' : '#062F29',
              textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </Typography>
          {goalName && (
            <Chip
              icon={<Target size={12} style={{ color: '#D97706' }} />}
              label={goalName}
              size="small"
              sx={{
                height: '20px',
                fontSize: '11px',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                maxWidth: '150px',
                '& .MuiChip-icon': {
                  marginLeft: '4px',
                  marginRight: '-2px',
                },
                '& .MuiChip-label': {
                  paddingLeft: '4px',
                  paddingRight: '6px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export function TasksSection({ tasks, goals = [], onTaskToggle, onNewTask }: TasksSectionProps) {
  const [filter, setFilter] = useState<'open' | 'completed'>('open');

  // Filter out archived tasks from all displays
  const activeTasks = tasks.filter((t) => t.status !== 'archived');

  const filteredTasks = activeTasks.filter((t) => t.status === filter);
  const openCount = activeTasks.filter((t) => t.status === 'open').length;
  const completedCount = activeTasks.filter((t) => t.status === 'completed').length;

  // Create a map of goal IDs to goal titles for quick lookup
  const goalNameMap = new Map(goals.map(g => [g.id, g.title]));
  const getGoalName = (goalId?: string) => goalId ? goalNameMap.get(goalId) : undefined;

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #D5D7DA',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: '#062F29',
          }}
        >
          Tasks
        </Typography>
        <SubTabNavigation
          options={[
            { value: 'open', label: `Open (${openCount})` },
            { value: 'completed', label: `Completed (${completedCount})` },
          ]}
          value={filter}
          onChange={(v) => setFilter(v as 'open' | 'completed')}
        />
      </Box>

      {/* Tasks list */}
      <Box sx={{ px: 3, py: 1 }}>
        {filteredTasks.length === 0 ? (
          <EmptyState type="no_tasks" onAction={onNewTask} />
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              goalName={getGoalName(task.smartGoalId)}
              onToggle={() => onTaskToggle?.(task)}
            />
          ))
        )}
      </Box>

      {/* New task button */}
      {filter === 'open' && filteredTasks.length > 0 && (
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <Button
            variant="text"
            startIcon={<Plus size={16} />}
            onClick={onNewTask}
            sx={{
              textTransform: 'none',
              padding: 0,
              color: '#4B5563',
              fontSize: '14px',
              '&:hover': {
                color: '#062F29',
                backgroundColor: 'transparent',
              },
            }}
          >
            New task
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default TasksSection;
