'use client';

import { Box, Typography } from '@mui/material';
import { SectionCard } from '@/components/shared';

interface IdDetailsSectionProps {
  location: string;
  email: string;
}

export function IdDetailsSection({ location, email }: IdDetailsSectionProps) {
  return (
    <SectionCard title="Contact">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '14px', color: '#535862', width: 150 }}>
            Location
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#252b37' }}>
            {location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '14px', color: '#535862', width: 150 }}>
            Email
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#252b37' }}>
            {email}
          </Typography>
        </Box>
      </Box>
    </SectionCard>
  );
}

export default IdDetailsSection;
