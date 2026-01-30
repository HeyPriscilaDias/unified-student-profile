'use client';

import { Box, Typography } from '@mui/material';

interface CareerVisionSectionProps {
  careerVision: string;
}

export function CareerVisionSection({ careerVision }: CareerVisionSectionProps) {
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
        Career vision
      </Typography>
      {careerVision ? (
        <Typography className="text-neutral-600 italic leading-relaxed">
          &ldquo;{careerVision}&rdquo;
        </Typography>
      ) : (
        <Typography className="text-neutral-500 text-sm">
          No career vision statement added yet.
        </Typography>
      )}
    </Box>
  );
}

export default CareerVisionSection;
