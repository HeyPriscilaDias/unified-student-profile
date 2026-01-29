'use client';

import { Box, Typography, Avatar, Chip } from '@mui/material';
import { Calendar, Mic } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { InteractionWithStudent } from '@/contexts/InteractionsContext';

interface MeetingCardProps {
  interaction: InteractionWithStudent;
  onClick: () => void;
}

export function MeetingCard({ interaction, onClick }: MeetingCardProps) {
  const hasTranscript = !!interaction.transcript;

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        p: 2.5,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: '#D1D5DB',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Header: Student info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Avatar
          src={interaction.studentAvatarUrl}
          alt={interaction.studentName}
          sx={{
            width: 36,
            height: 36,
            fontSize: '14px',
            fontWeight: 600,
            backgroundColor: '#155E4C',
            color: '#fff',
          }}
        >
          {interaction.studentName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#111827',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {interaction.studentName}
          </Typography>
        </Box>
        {interaction.status === 'draft' && (
          <Chip
            label="Draft"
            size="small"
            sx={{
              height: 22,
              fontSize: '11px',
              fontWeight: 500,
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        )}
      </Box>

      {/* Meeting Title */}
      <Typography
        sx={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#062F29',
          mb: 1.5,
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {interaction.title}
      </Typography>

      {/* Footer: Date and indicator */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 1.5,
          borderTop: '1px solid #F3F4F6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Calendar size={14} color="#9CA3AF" />
          <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
            {interaction.interactionDate ? formatDate(interaction.interactionDate) : 'No date'}
          </Typography>
        </Box>
        {hasTranscript && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Mic size={14} color="#9CA3AF" />
            <Typography sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
              Transcribed
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MeetingCard;
