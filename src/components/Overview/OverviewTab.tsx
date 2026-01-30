'use client';

import { Box } from '@mui/material';
import { MilestonesSection } from './MilestonesSection';
import { AlmaSnapshotSection } from './AlmaSnapshotSection';
import { SmartGoalsSection } from './SmartGoalsSection';
import type {
  Milestone,
  SmartGoal,
  AlmaSnapshot,
  Task,
} from '@/types/student';

interface OverviewTabProps {
  milestones: Milestone[];
  smartGoals: SmartGoal[];
  tasks?: Task[];
  almaSnapshot: AlmaSnapshot | null;
  onGenerateSnapshot: () => void;
  isGeneratingSnapshot?: boolean;
  onGoalToggle?: (goal: SmartGoal) => void;
  onCreateTaskForGoal?: (goalId: string) => void;
  onTaskToggle?: (task: Task) => void;
  onArchiveGoal?: (goal: SmartGoal) => void;
}

export function OverviewTab({
  milestones,
  smartGoals,
  tasks = [],
  almaSnapshot,
  onGenerateSnapshot,
  isGeneratingSnapshot = false,
  onGoalToggle,
  onCreateTaskForGoal,
  onTaskToggle,
  onArchiveGoal,
}: OverviewTabProps) {
  // Placeholder handlers for prototype
  const handleMilestoneClick = (milestone: Milestone) => {
    console.log('Milestone clicked:', milestone.title);
  };

  const handleGoalToggle = (goal: SmartGoal) => {
    if (onGoalToggle) {
      onGoalToggle(goal);
    } else {
      console.log('Goal toggled:', goal.title);
    }
  };

  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: '40px', minWidth: 0 }}>
      {/* Row 1: Alma Snapshot */}
      <AlmaSnapshotSection
        snapshot={almaSnapshot}
        onGenerateSnapshot={onGenerateSnapshot}
        isLoading={isGeneratingSnapshot}
      />

      {/* Row 2: Milestones */}
      <MilestonesSection
        milestones={milestones}
        onMilestoneClick={handleMilestoneClick}
      />

      {/* Row 3: SMART Goals */}
      <SmartGoalsSection
        goals={smartGoals}
        tasks={tasks}
        onGoalToggle={handleGoalToggle}
        onCreateTaskForGoal={onCreateTaskForGoal}
        onTaskToggle={onTaskToggle}
        onArchiveGoal={onArchiveGoal}
      />
    </Box>
  );
}

export default OverviewTab;
