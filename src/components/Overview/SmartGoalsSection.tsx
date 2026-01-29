'use client';

import { useState } from 'react';
import { Box, Typography, Checkbox, Collapse, IconButton } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SubTabNavigation, EmptyState } from '@/components/shared';
import type { SmartGoal, SmartGoalSubtask } from '@/types/student';

interface SmartGoalsSectionProps {
  goals: SmartGoal[];
  onGoalToggle?: (goal: SmartGoal) => void;
  onSubtaskToggle?: (goal: SmartGoal, subtask: SmartGoalSubtask) => void;
}

function GoalItem({
  goal,
  onToggle,
  onSubtaskToggle,
}: {
  goal: SmartGoal;
  onToggle?: () => void;
  onSubtaskToggle?: (subtask: SmartGoalSubtask) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedSubtasks = goal.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = goal.subtasks.length;
  const isCompleted = goal.status === 'completed';

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
            {totalSubtasks > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                  {completedSubtasks}/{totalSubtasks}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{ color: '#9CA3AF' }}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </IconButton>
              </Box>
            )}
          </Box>
          {goal.description && (
            <Typography sx={{ fontSize: '12px', color: '#6B7280', mt: 0.5 }}>
              {goal.description}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Subtasks */}
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
          {goal.subtasks.map((subtask) => (
            <Box key={subtask.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                checked={subtask.completed}
                onChange={() => onSubtaskToggle?.(subtask)}
                size="small"
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
                  color: subtask.completed ? '#9CA3AF' : '#374151',
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                }}
              >
                {subtask.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

export function SmartGoalsSection({
  goals,
  onGoalToggle,
  onSubtaskToggle,
}: SmartGoalsSectionProps) {
  const [filter, setFilter] = useState<'active' | 'completed' | 'archived'>('active');

  const filteredGoals = goals.filter((g) => g.status === filter);
  const activeCount = goals.filter((g) => g.status === 'active').length;
  const completedCount = goals.filter((g) => g.status === 'completed').length;
  const archivedCount = goals.filter((g) => g.status === 'archived').length;

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
              onToggle={() => onGoalToggle?.(goal)}
              onSubtaskToggle={(subtask) => onSubtaskToggle?.(goal, subtask)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

export default SmartGoalsSection;
