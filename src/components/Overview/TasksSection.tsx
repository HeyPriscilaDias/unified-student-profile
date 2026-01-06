'use client';

import { useState } from 'react';
import { Box, Typography, Checkbox, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { SubTabNavigation, EmptyState } from '@/components/shared';
import type { Task } from '@/types/student';

interface TasksSectionProps {
  tasks: Task[];
  onTaskToggle?: (task: Task) => void;
  onNewTask?: () => void;
}

function TaskItem({
  task,
  onToggle,
}: {
  task: Task;
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
        <Typography
          sx={{
            fontSize: '14px',
            color: task.status === 'completed' ? '#9CA3AF' : '#062F29',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </Typography>
      </Box>
    </Box>
  );
}

export function TasksSection({ tasks, onTaskToggle, onNewTask }: TasksSectionProps) {
  const [filter, setFilter] = useState<'open' | 'completed'>('open');

  const filteredTasks = tasks.filter((t) => t.status === filter);
  const openCount = tasks.filter((t) => t.status === 'open').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

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
