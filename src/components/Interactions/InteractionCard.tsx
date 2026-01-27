'use client';

import { Box, Typography } from '@mui/material';
import { Calendar, ChevronRight, CheckCircle, ListChecks, FileText } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/dateUtils';
import type { Interaction } from '@/types/student';

interface InteractionCardProps {
  interaction: Interaction;
  onClick?: () => void;
}

export function InteractionCard({ interaction, onClick }: InteractionCardProps) {
  const isDraft = interaction.status === 'draft';
  const actionCount = interaction.aiSummary?.recommendedActions?.length || 0;

  return (
    <Box
      onClick={onClick}
      className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-neutral-50 border-neutral-200 bg-white"
    >
      {/* Icon */}
      <Box className="p-2 rounded-lg flex-shrink-0 bg-neutral-100">
        {isDraft ? (
          <FileText size={18} className="text-neutral-500" />
        ) : (
          <CheckCircle size={18} className="text-green-600" />
        )}
      </Box>

      {/* Content */}
      <Box className="flex-1 min-w-0">
        <Box className="flex items-center gap-2 mb-1">
          <Typography className="font-medium text-neutral-900 text-sm">
            {interaction.title}
          </Typography>
          {isDraft && (
            <Box className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">
              Draft
            </Box>
          )}
        </Box>

        <Box className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <Box className="flex items-center gap-1">
            <Calendar size={12} />
            <span>
              {interaction.interactionDate
                ? (isDraft ? formatDate(interaction.interactionDate) : formatRelativeTime(interaction.interactionDate))
                : 'No date set'}
            </span>
          </Box>
          <span>•</span>
          <span>with {interaction.counselorName}</span>
        </Box>

        {/* Summary preview for completed interactions */}
        {!isDraft && interaction.summary && (
          <Typography className="text-xs text-neutral-600 line-clamp-2 mb-2">
            {interaction.summary}
          </Typography>
        )}

        {/* AI Summary preview for completed interactions with recordings */}
        {!isDraft && !interaction.summary && interaction.aiSummary?.overview && (
          <Typography className="text-xs text-neutral-600 line-clamp-2 mb-2">
            {interaction.aiSummary.overview}
          </Typography>
        )}

        {/* Action items badge for completed interactions */}
        {!isDraft && actionCount > 0 && (
          <Box className="flex items-center gap-1 text-xs text-amber-600">
            <ListChecks size={12} />
            <span>{actionCount} action item{actionCount !== 1 ? 's' : ''} generated</span>
          </Box>
        )}
      </Box>

      {/* Arrow */}
      <ChevronRight size={18} className="text-neutral-400 flex-shrink-0 mt-1" />
    </Box>
  );
}

export default InteractionCard;
