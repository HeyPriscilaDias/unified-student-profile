'use client';

import { Box, Typography, IconButton } from '@mui/material';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import type { Interaction } from '@/types/student';

interface MeetingsTabProps {
  studentId: string;
  interactions: Interaction[];
  onInteractionClick: (interaction: Interaction) => void;
  onScheduleInteraction: (event: React.MouseEvent<HTMLElement>) => void;
}

// Status icons
function HeldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.875 10.625L8.75 12.5L13.125 8.125M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="#414651" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NotHeldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.12505 2.73356C9.35467 2.41433 10.6454 2.41433 11.875 2.73356M2.77271 7.99137C3.11127 6.76717 3.75663 5.64962 4.64771 4.7445M4.64771 15.2547C3.7564 14.3491 3.11102 13.231 2.77271 12.0062M11.875 17.2648C10.6454 17.584 9.35467 17.584 8.12505 17.2648M17.2274 12.007C16.8888 13.2312 16.2435 14.3487 15.3524 15.2539M15.3524 4.74371C16.2437 5.64928 16.8891 6.7674 17.2274 7.99215" stroke="#414651" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Meeting icon
function MeetingIcon({ size = 16, color = '#A4A7AE' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.25 6.75C6.66421 6.75 7 6.41421 7 6C7 5.58579 6.66421 5.25 6.25 5.25C5.83579 5.25 5.5 5.58579 5.5 6C5.5 6.41421 5.83579 6.75 6.25 6.75Z" fill={color}/>
      <path d="M9.75 6.75C10.1642 6.75 10.5 6.41421 10.5 6C10.5 5.58579 10.1642 5.25 9.75 5.25C9.33579 5.25 9 5.58579 9 6C9 6.41421 9.33579 6.75 9.75 6.75Z" fill={color}/>
      <path d="M9.75 8.5C9.22479 8.82679 8.61858 9 8 9C7.38142 9 6.77521 8.82679 6.25 8.5M2.82188 13.3819C2.74905 13.4431 2.66025 13.4823 2.56591 13.4949C2.47158 13.5074 2.37562 13.4928 2.28931 13.4527C2.20301 13.4126 2.12994 13.3487 2.07869 13.2685C2.02744 13.1883 2.00014 13.0952 2 13V3C2 2.86739 2.05268 2.74021 2.14645 2.64645C2.24021 2.55268 2.36739 2.5 2.5 2.5H13.5C13.6326 2.5 13.7598 2.55268 13.8536 2.64645C13.9473 2.74021 14 2.86739 14 3V11C14 11.1326 13.9473 11.2598 13.8536 11.3536C13.7598 11.4473 13.6326 11.5 13.5 11.5H5L2.82188 13.3819Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Format participants string (counselor + attendees)
function formatParticipants(interaction: Interaction): string {
  const parts: string[] = [];

  if (interaction.counselorName) {
    parts.push(interaction.counselorName);
  }

  if (interaction.attendees && interaction.attendees.length > 0) {
    parts.push(...interaction.attendees);
  }

  if (parts.length === 0) return '';
  return `with ${parts.join(', ')}`;
}

// Get status label
function getStatusLabel(status: 'draft' | 'completed'): string {
  return status === 'completed' ? 'Held' : 'Not held yet';
}

// Meeting row component
function MeetingRow({
  interaction,
  onClick,
  isLast,
}: {
  interaction: Interaction;
  onClick: () => void;
  isLast: boolean;
}) {
  const statusLabel = getStatusLabel(interaction.status);
  const participants = formatParticipants(interaction);

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        p: 2,
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid #D5D7DA',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: '#F9FAFB',
        },
      }}
    >
      {/* Left: Icon + Title/Participants */}
      <Box sx={{ display: 'flex', flex: 1, gap: 2, alignItems: 'center', minWidth: 0 }}>
        <Box sx={{ flexShrink: 0 }}><MeetingIcon /></Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              color: '#252B37',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {interaction.title}
          </Typography>
          {participants && (
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '16px',
                color: '#535862',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {participants}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Date */}
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          color: '#535862',
          width: 150,
          flexShrink: 0,
          textAlign: 'left',
        }}
      >
        {interaction.interactionDate ? formatDate(interaction.interactionDate) : 'No date'}
      </Typography>

      {/* Status pill */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          height: 24,
          px: 1,
          borderRadius: '100px',
          border: '1px solid #D5D7DA',
          backgroundColor: '#fff',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {interaction.status === 'completed' ? <HeldIcon /> : <NotHeldIcon />}
        </Box>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '16px',
            color: '#414651',
          }}
        >
          {statusLabel}
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * MeetingsTab component displays a list of meetings (interactions) for a student.
 * Meetings are sorted by date descending (newest first).
 */
export function MeetingsTab({
  studentId,
  interactions,
  onInteractionClick,
  onScheduleInteraction,
}: MeetingsTabProps) {
  // Sort interactions by date descending (newest first)
  const sortedMeetings = [...interactions].sort((a, b) => {
    const dateA = a.interactionDate ? new Date(a.interactionDate).getTime() : 0;
    const dateB = b.interactionDate ? new Date(b.interactionDate).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '22px',
            fontWeight: 500,
            lineHeight: '28px',
            letterSpacing: '-1px',
            color: '#03120F',
          }}
        >
          1:1 Meetings
        </Typography>
        <IconButton
          onClick={onScheduleInteraction}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            border: '1px solid #D5D7DA',
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: '#F9FAFB',
            },
          }}
        >
          <Plus size={20} color="#414651" />
        </IconButton>
      </Box>

      {/* Meetings list or empty state */}
      {interactions.length === 0 ? (
        <Box
          sx={{
            border: '1px solid #D5D7DA',
            borderRadius: '8px',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 400,
              color: '#535862',
            }}
          >
            No 1:1 meetings yet
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px solid #D5D7DA',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          {sortedMeetings.map((meeting, index) => (
            <MeetingRow
              key={meeting.id}
              interaction={meeting}
              onClick={() => onInteractionClick(meeting)}
              isLast={index === sortedMeetings.length - 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default MeetingsTab;
