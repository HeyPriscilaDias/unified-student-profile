'use client';

import { Box, Typography, Button } from '@mui/material';
import { Plus, Mic, MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import type { Interaction } from '@/types/student';

interface MeetingsTabProps {
  studentId: string;
  interactions: Interaction[];
  onInteractionClick: (interaction: Interaction) => void;
  onScheduleInteraction: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Formats an interaction date string (YYYY-MM-DD) to a human-readable format.
 */
function formatMeetingDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Individual meeting card component for display in the meetings grid.
 */
function MeetingCard({
  interaction,
  onClick,
}: {
  interaction: Interaction;
  onClick: () => void;
}) {
  const hasRecording = !!interaction.recordingUrl || !!interaction.transcript;
  const isDraft = interaction.status === 'draft';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2.5,
        borderRadius: '12px',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#F9FAFB',
          borderColor: '#D1D5DB',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '10px',
          backgroundColor: hasRecording ? '#062F29' : '#6B7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {hasRecording ? (
          <Mic size={20} color="#fff" />
        ) : (
          <MessageSquare size={20} color="#fff" />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#111827',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {interaction.title}
          </Typography>
          {isDraft && (
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '6px',
                backgroundColor: '#F3F4F6',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                flexShrink: 0,
              }}
            >
              Draft
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {interaction.interactionDate ? (
            <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
              {formatMeetingDate(interaction.interactionDate)}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '13px', color: '#9CA3AF', fontStyle: 'italic' }}>
              No date set
            </Typography>
          )}
          {hasRecording && (
            <>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: '#D1D5DB',
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Mic size={12} color="#6B7280" />
                <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                  Recorded
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Show counselor name if available */}
        {interaction.counselorName && (
          <Typography
            sx={{
              fontSize: '12px',
              color: '#9CA3AF',
              mt: 0.75,
            }}
          >
            with {interaction.counselorName}
          </Typography>
        )}
      </Box>

      {/* Chevron */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <ChevronRight size={18} color="#9CA3AF" />
      </Box>
    </Box>
  );
}

/**
 * Empty state component for when there are no meetings.
 */
function MeetingsEmptyState({
  onSchedule,
}: {
  onSchedule: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '16px',
          backgroundColor: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <Calendar size={32} color="#9CA3AF" />
      </Box>
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#374151',
          mb: 1,
        }}
      >
        No meetings yet
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: '#6B7280',
          mb: 3,
          maxWidth: 320,
        }}
      >
        Track conversations, check-ins, and follow-ups with this student by creating your first meeting.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Plus size={18} />}
        onClick={onSchedule}
        sx={{
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 500,
          px: 3,
          py: 1,
          backgroundColor: '#062F29',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#2B4C46',
          },
        }}
      >
        Add meeting
      </Button>
    </Box>
  );
}

/**
 * MeetingsTab component displays a list of meetings (interactions) for a student.
 * Meetings are sorted by date ascending (oldest first).
 * Meetings without dates are shown at the end.
 */
export function MeetingsTab({
  studentId,
  interactions,
  onInteractionClick,
  onScheduleInteraction,
}: MeetingsTabProps) {
  // Sort interactions by date ascending, meetings without dates at the end
  const sortedMeetings = [...interactions].sort((a, b) => {
    if (!a.interactionDate && !b.interactionDate) return 0;
    if (!a.interactionDate) return 1;
    if (!b.interactionDate) return -1;
    return a.interactionDate.localeCompare(b.interactionDate);
  });

  const draftCount = interactions.filter((i) => i.status === 'draft').length;
  const completedCount = interactions.filter((i) => i.status === 'completed').length;

  const AddMeetingButton = (
    <Button
      variant="contained"
      size="small"
      startIcon={<Plus size={16} />}
      onClick={onScheduleInteraction}
      sx={{
        textTransform: 'none',
        fontSize: '13px',
        fontWeight: 500,
        px: 2,
        py: 0.75,
        backgroundColor: '#062F29',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#2B4C46',
        },
      }}
    >
      Add meeting
    </Button>
  );

  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: '22px',
              color: '#111827',
            }}
          >
            Meetings
          </Typography>
          {interactions.length > 0 && AddMeetingButton}
        </Box>

        {interactions.length === 0 ? (
          <MeetingsEmptyState onSchedule={onScheduleInteraction} />
        ) : (
          <Box>
            {/* Description */}
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6B7280',
                mb: 3,
              }}
            >
              Keep track of meaningful conversations and follow-ups with this student.
            </Typography>

            {/* Meetings grid - 2 columns on larger screens */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: 2,
              }}
            >
              {sortedMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  interaction={meeting}
                  onClick={() => onInteractionClick(meeting)}
                />
              ))}
            </Box>

            {/* Show count summary if there are many meetings */}
            {sortedMeetings.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                  {draftCount > 0 && (
                    <Box component="span" sx={{ fontWeight: 500, color: '#6B7280' }}>
                      {draftCount} draft
                    </Box>
                  )}
                  {draftCount > 0 && completedCount > 0 && ' · '}
                  {completedCount > 0 && (
                    <Box component="span">
                      {completedCount} completed
                    </Box>
                  )}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MeetingsTab;
