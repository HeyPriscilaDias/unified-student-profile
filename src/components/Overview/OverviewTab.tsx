'use client';

import { Box } from '@mui/material';
import { MilestonesSection } from './MilestonesSection';
import { AlmaSnapshotSection } from './AlmaSnapshotSection';
import { SmartGoalsSection } from './SmartGoalsSection';
import type {
  Milestone,
  SmartGoal,
  AlmaSnapshot,
} from '@/types/student';

interface OverviewTabProps {
  milestones: Milestone[];
  smartGoals: SmartGoal[];
  almaSnapshot: AlmaSnapshot | null;
  onGenerateSnapshot: () => void;
  isGeneratingSnapshot?: boolean;
}

export function OverviewTab({
  milestones,
  smartGoals,
  almaSnapshot,
  onGenerateSnapshot,
  isGeneratingSnapshot = false,
}: OverviewTabProps) {
  // Placeholder handlers for prototype
  const handleMilestoneClick = (milestone: Milestone) => {
    console.log('Milestone clicked:', milestone.title);
  };

  const handleGoalToggle = (goal: SmartGoal) => {
    console.log('Goal toggled:', goal.title);
  };

  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      {/* Row 1: Milestones */}
      <MilestonesSection
        milestones={milestones}
        onMilestoneClick={handleMilestoneClick}
      />

      {/* Row 2: Alma Snapshot */}
      <AlmaSnapshotSection
        snapshot={almaSnapshot}
        onGenerateSnapshot={onGenerateSnapshot}
        isLoading={isGeneratingSnapshot}
      />

      {/* Row 3: SMART Goals */}
      <SmartGoalsSection
        goals={smartGoals}
        onGoalToggle={handleGoalToggle}
      />
    </Box>
  );
}

export default OverviewTab;
