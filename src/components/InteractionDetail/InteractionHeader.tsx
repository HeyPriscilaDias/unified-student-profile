'use client';

import { Box, Typography, Chip } from '@mui/material';
import { Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction, InteractionStatus } from '@/types/student';

interface InteractionHeaderProps {
  interaction: Interaction;
}

const statusConfig: Record<InteractionStatus, { label: string; color: 'default' | 'primary' | 'success' }> = {
  planned: { label: 'Planned', color: 'primary' },
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
      <Box className="flex items-start justify-between mb-4">
        <Typography variant="h5" className="font-semibold text-neutral-900">
          {interaction.title}
        </Typography>
        <Chip
          label={status.label}
          color={status.color}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>

      <Box className="flex items-center gap-6 text-neutral-600">
        <Box className="flex items-center gap-2">
          <Calendar size={16} className="text-neutral-400" />
          <Typography className="text-sm">
            {formatDate(interaction.interactionDate)}
          </Typography>
        </Box>

        <Box className="flex items-center gap-2">
          <User size={16} className="text-neutral-400" />
          <Typography className="text-sm">
            {interaction.counselorName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default InteractionHeader;
