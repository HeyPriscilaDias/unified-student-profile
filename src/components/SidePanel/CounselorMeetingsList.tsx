'use client';

import { Avatar, Box, Typography, Button, Chip } from '@mui/material';
import { Plus, MessageSquare } from 'lucide-react';
import { useInteractionsContext } from '@/contexts/InteractionsContext';
import type { InteractionWithStudent } from '@/contexts/InteractionsContext';

interface CounselorMeetingsListProps {
  onStartTranscribing: () => void;
  onMeetingClick: (studentId: string, interactionId: string) => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'No date set';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function MeetingCard({
  interaction,
  onClick,
}: {
  interaction: InteractionWithStudent;
  onClick: () => void;
}) {
  const hasTranscriptOrRecording = !!(interaction.transcript || interaction.recordingUrl);

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        borderBottom: '1px solid #E5E7EB',
        transition: 'box-shadow 0.15s, background-color 0.15s',
        '&:hover': {
          backgroundColor: '#F9FAFB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#111827',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {interaction.title}
          </Typography>
          {interaction.status === 'draft' && (
            <Chip
              label="Draft"
              size="small"
              sx={{
                height: 20,
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <Avatar
            src={interaction.studentAvatarUrl}
            alt={interaction.studentName}
            sx={{
              width: 16,
              height: 16,
              fontSize: '8px',
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
          <Typography
            sx={{
              fontSize: '12px',
              color: '#6B7280',
            }}
          >
            {interaction.studentName}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '12px',
            color: '#4B5563',
            mt: 0.25,
          }}
        >
          {formatDate(interaction.interactionDate)}
        </Typography>
      </Box>

    </Box>
  );
}

export function CounselorMeetingsList({
  onStartTranscribing,
  onMeetingClick,
}: CounselorMeetingsListProps) {
  const { getAllCounselorInteractions } = useInteractionsContext();
  const meetings = getAllCounselorInteractions();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Start Transcribing Button */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Plus size={18} />}
          onClick={onStartTranscribing}
          sx={{
            backgroundColor: '#155E4C',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            py: 1.25,
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#0E4A3B',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            },
          }}
        >
          New Meeting
        </Button>
      </Box>

      {/* Meetings List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {meetings.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              px: 2,
              mx: 2,
              mt: 1,
              backgroundColor: '#F9FAFB',
              borderRadius: 2,
            }}
          >
            <MessageSquare
              size={24}
              style={{ color: '#9CA3AF', marginBottom: 8 }}
            />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                mb: 0.5,
              }}
            >
              No meetings yet
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#6B7280',
              }}
            >
              Meetings with students will appear here.
            </Typography>
          </Box>
        ) : (
          meetings.map((interaction) => (
            <MeetingCard
              key={interaction.id}
              interaction={interaction}
              onClick={() => onMeetingClick(interaction.studentId, interaction.id)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

export default CounselorMeetingsList;
