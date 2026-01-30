'use client';

import { Box, Typography } from '@mui/material';

interface ValuesSectionProps {
  values: string;
}

export function ValuesSection({ values }: ValuesSectionProps) {
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
        Values
      </Typography>
      {values ? (
        <Typography className="text-neutral-600 italic leading-relaxed">
          &ldquo;{values}&rdquo;
        </Typography>
      ) : (
        <Typography className="text-neutral-500 text-sm">
          No values statement added yet.
        </Typography>
      )}
    </Box>
  );
}

export default ValuesSection;
