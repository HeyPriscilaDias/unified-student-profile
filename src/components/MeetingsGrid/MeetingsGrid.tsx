'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { Calendar } from 'lucide-react';
import { useInteractionsContext } from '@/contexts/InteractionsContext';
import { MeetingCard } from './MeetingCard';

export function MeetingsGrid() {
  const router = useRouter();

  const { getAllCounselorInteractions } = useInteractionsContext();
  const meetings = getAllCounselorInteractions();

  const handleMeetingClick = (studentId: string, interactionId: string) => {
    router.push(`/students/${studentId}/interactions/${interactionId}`);
  };

  if (meetings.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 4,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Calendar size={28} color="#9CA3AF" />
        </Box>
        <Typography
          sx={{
            fontSize: '18px',
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
            textAlign: 'center',
            maxWidth: 320,
          }}
        >
          Start a new meeting to begin tracking your student interactions.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#111827',
            mb: 0.5,
          }}
        >
          Recent Meetings
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            color: '#6B7280',
          }}
        >
          {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} with students
        </Typography>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {meetings.map((interaction) => (
          <MeetingCard
            key={interaction.id}
            interaction={interaction}
            onClick={() => handleMeetingClick(interaction.studentId, interaction.id)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default MeetingsGrid;
