'use client';

import { useState } from 'react';
import { Box, Typography, Checkbox, Collapse, IconButton, Chip } from '@mui/material';
import { ChevronDown, ChevronUp, Plus, Archive } from 'lucide-react';
import { SubTabNavigation, EmptyState } from '@/components/shared';
import type { SmartGoal, Task } from '@/types/student';

interface SmartGoalsSectionProps {
  goals: SmartGoal[];
  tasks?: Task[];
  onGoalToggle?: (goal: SmartGoal) => void;
  onCreateTaskForGoal?: (goalId: string) => void;
  onTaskToggle?: (task: Task) => void;
  onArchiveGoal?: (goal: SmartGoal) => void;
}

function GoalItem({
  goal,
  linkedTasks = [],
  onToggle,
  onCreateTask,
  onTaskToggle,
  onArchiveGoal,
}: {
  goal: SmartGoal;
  linkedTasks?: Task[];
  onToggle?: () => void;
  onCreateTask?: () => void;
  onTaskToggle?: (task: Task) => void;
  onArchiveGoal?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter out archived linked tasks for display and counting
  const activeLinkedTasks = linkedTasks.filter(t => t.status !== 'archived');
  const completedLinkedTasks = activeLinkedTasks.filter(t => t.status === 'completed').length;
  const totalLinkedTasks = activeLinkedTasks.length;

  const isCompleted = goal.status === 'completed';
  const isArchived = goal.status === 'archived';

  return (
    <Box
      sx={{
        borderBottom: '1px solid #E5E7EB',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          py: 1.5,
        }}
      >
        <Checkbox
          checked={isCompleted}
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: isCompleted ? '#9CA3AF' : '#062F29',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {goal.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {totalLinkedTasks > 0 && (
                <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                  {completedLinkedTasks}/{totalLinkedTasks}
                </Typography>
              )}
              {totalLinkedTasks > 0 && (
                <IconButton
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{ color: '#9CA3AF' }}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </IconButton>
              )}
              {!isArchived && !isCompleted && (
                <IconButton
                  size="small"
                  onClick={onCreateTask}
                  sx={{
                    color: '#9CA3AF',
                    '&:hover': { color: '#155E4C', backgroundColor: '#EFF6F4' },
                  }}
                  title="Add task to this goal"
                >
                  <Plus size={16} />
                </IconButton>
              )}
              {!isArchived && (
                <IconButton
                  size="small"
                  onClick={onArchiveGoal}
                  sx={{
                    color: '#9CA3AF',
                    '&:hover': { color: '#DC2626', backgroundColor: '#FEE2E2' },
                  }}
                  title="Archive goal"
                >
                  <Archive size={16} />
                </IconButton>
              )}
            </Box>
          </Box>
          {goal.description && (
            <Typography sx={{ fontSize: '12px', color: '#6B7280', mt: 0.5 }}>
              {goal.description}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Linked Tasks */}
      <Collapse in={isExpanded}>
        <Box
          sx={{
            pl: 4.5,
            pb: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {activeLinkedTasks.map((task) => (
            <Box key={task.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                checked={task.status === 'completed'}
                onChange={() => onTaskToggle?.(task)}
                size="small"
                disabled={isArchived}
                sx={{
                  padding: 0,
                  '&.Mui-checked': {
                    color: '#22C55E',
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: '12px',
                  color: task.status === 'completed' ? '#9CA3AF' : '#374151',
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {task.title}
              </Typography>
              <Chip
                label={task.taskType === 'staff' ? 'Staff' : 'Student'}
                size="small"
                sx={{
                  height: '18px',
                  fontSize: '10px',
                  backgroundColor: task.taskType === 'staff' ? '#EFF6F4' : '#E0E7FF',
                  color: task.taskType === 'staff' ? '#155E4C' : '#4338CA',
                }}
              />
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

export function SmartGoalsSection({
  goals,
  tasks = [],
  onGoalToggle,
  onCreateTaskForGoal,
  onTaskToggle,
  onArchiveGoal,
}: SmartGoalsSectionProps) {
  const [filter, setFilter] = useState<'active' | 'completed' | 'archived'>('active');

  const filteredGoals = goals.filter((g) => g.status === filter);
  const activeCount = goals.filter((g) => g.status === 'active').length;
  const completedCount = goals.filter((g) => g.status === 'completed').length;
  const archivedCount = goals.filter((g) => g.status === 'archived').length;

  // Helper to get linked tasks for a goal
  const getLinkedTasks = (goalId: string) => tasks.filter(t => t.smartGoalId === goalId);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '22px',
            color: '#111827',
          }}
        >
          SMART Goals
        </Typography>
        <SubTabNavigation
          options={[
            { value: 'active', label: `Active (${activeCount})` },
            { value: 'completed', label: `Completed (${completedCount})` },
            { value: 'archived', label: `Archived (${archivedCount})` },
          ]}
          value={filter}
          onChange={(v) => setFilter(v as 'active' | 'completed' | 'archived')}
        />
      </Box>

      {/* Goals list */}
      <Box>
        {filteredGoals.length === 0 ? (
          <EmptyState type="no_goals" />
        ) : (
          filteredGoals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              linkedTasks={getLinkedTasks(goal.id)}
              onToggle={() => onGoalToggle?.(goal)}
              onCreateTask={() => onCreateTaskForGoal?.(goal.id)}
              onTaskToggle={onTaskToggle}
              onArchiveGoal={() => onArchiveGoal?.(goal)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

export default SmartGoalsSection;
