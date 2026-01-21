'use client';

import { Box, Typography, Chip } from '@mui/material';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction, InteractionStatus } from '@/types/student';

interface InteractionHeaderProps {
  interaction: Interaction;
}

const statusConfig: Record<InteractionStatus, { label: string; color: 'default' | 'primary' | 'success' }> = {
  planned: { label: 'Upcoming', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
};

export function InteractionHeader({ interaction }: InteractionHeaderProps) {
  const status = statusConfig[interaction.status];

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid #E5E7EB',
        p: 3,
      }}
    >
      <Typography variant="h5" className="font-semibold text-neutral-900 mb-4">
        {interaction.title}
      </Typography>

      <Box className="flex items-center gap-3 text-neutral-600">
        <Calendar size={16} className="text-neutral-400" />
        <Typography className="text-sm">
          {formatDate(interaction.interactionDate)}
        </Typography>
        <Chip
          label={status.label}
          color={status.color}
          size="small"
          sx={{ fontWeight: 500, ml: 1 }}
        />
      </Box>
    </Box>
  );
}

export default InteractionHeader;
