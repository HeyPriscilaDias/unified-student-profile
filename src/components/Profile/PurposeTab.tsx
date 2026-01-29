'use client';

import { Box } from '@mui/material';
import { ValuesSection } from './ValuesSection';
import { MissionSection } from './MissionSection';
import { CareerVisionSection } from './CareerVisionSection';

interface PurposeTabProps {
  values: string;
  mission: string;
  careerVision: string;
}

export function PurposeTab({ values, mission, careerVision }: PurposeTabProps) {
  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MissionSection mission={mission} />
      <CareerVisionSection careerVision={careerVision} />
      <ValuesSection values={values} />
    </Box>
  );
}

export default PurposeTab;
