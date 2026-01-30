'use client';

import { Box, Typography } from '@mui/material';

interface MissionSectionProps {
  mission: string;
}

export function MissionSection({ mission }: MissionSectionProps) {
  return (
    <Box>
      <Typography
        component="h3"
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 600,
          fontSize: '22px',
          color: '#111827',
          mb: 1.5,
        }}
      >
        Mission statement
      </Typography>
      {mission ? (
        <Typography className="text-neutral-600 italic leading-relaxed">
          &ldquo;{mission}&rdquo;
        </Typography>
      ) : (
        <Typography className="text-neutral-500 text-sm">
          No mission statement added yet.
        </Typography>
      )}
    </Box>
  );
}

export default MissionSection;
