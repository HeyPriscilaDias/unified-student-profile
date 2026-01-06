'use client';

import { Box, Typography, Button, Avatar } from '@mui/material';
import { ArrowLeft, Calendar, MapPin, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Student } from '@/types/student';

interface StudentHeaderProps {
  student: Student;
  studentId: string;
}

function OnTrackPill({ status }: { status: 'on_track' | 'off_track' }) {
  const isOnTrack = status === 'on_track';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: '9999px',
        backgroundColor: isOnTrack ? '#DCFCE7' : '#FEE2E2',
        color: isOnTrack ? '#15803D' : '#B91C1C',
        fontSize: '12px',
        fontWeight: 500,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: isOnTrack ? '#22C55E' : '#EF4444',
        }}
      />
      {isOnTrack ? 'On track' : 'Off track'}
    </Box>
  );
}

export function StudentHeader({ student, studentId }: StudentHeaderProps) {
  const router = useRouter();

  const handleScheduleMeeting = () => {
    router.push(`/students/${studentId}/meetings/schedule`);
  };

  return (
    <Box>
      {/* Back button bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.back()}
          sx={{
            color: '#414651',
            textTransform: 'none',
            fontWeight: 400,
            fontSize: '14px',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notification icons would go here */}
        </Box>
      </Box>

      {/* Main header content */}
      <Box sx={{ py: 2.5 }}>
        {/* Top row: Avatar + Name/Grade/Schedule */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            mb: 1.5,
          }}
        >
          {/* Avatar with On Track badge below */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Avatar
              src={student.avatarUrl}
              alt={`${student.firstName} ${student.lastName}`}
              sx={{
                width: 64,
                height: 64,
                border: '2px solid #E9EAEB',
              }}
            >
              {student.firstName[0]}{student.lastName[0]}
            </Avatar>
            <OnTrackPill status={student.onTrackStatus} />
          </Box>

          {/* Name, grade, location, schedule button */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography
                sx={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#181D27',
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                {student.firstName} {student.lastName}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#535862' }}>
                ·
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#535862' }}>
                Grade {student.grade}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Calendar size={16} />}
                onClick={handleScheduleMeeting}
                sx={{
                  textTransform: 'none',
                  borderColor: '#D5D7DA',
                  color: '#414651',
                  fontWeight: 500,
                  fontSize: '13px',
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    backgroundColor: '#FAFAFA',
                    borderColor: '#D5D7DA',
                  },
                }}
              >
                Schedule meeting
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#717680' }}>
              <MapPin size={14} />
              <Typography sx={{ fontSize: '13px' }}>{student.location}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Mission statement */}
        {student.missionStatement && (
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#535862',
                lineHeight: '20px',
              }}
            >
              &ldquo;{student.missionStatement}&rdquo;
            </Typography>
          </Box>
        )}

        {/* Stats row - inline text style */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
            {student.gpa.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#717680' }}>GPA</Typography>
          <Typography sx={{ fontSize: '14px', color: '#D5D7DA' }}>·</Typography>

          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
            {student.satScore || '-'}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#717680' }}>SAT</Typography>
          <Typography sx={{ fontSize: '14px', color: '#D5D7DA' }}>·</Typography>

          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
            {student.actScore || '-'}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#717680' }}>ACT</Typography>
          <Typography sx={{ fontSize: '14px', color: '#D5D7DA' }}>·</Typography>

          <Typography sx={{ fontSize: '14px', color: '#717680' }}>
            {student.classRank || 'Class rank'}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#D5D7DA' }}>·</Typography>

          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
            {student.readinessScore}%
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#717680' }}>Readiness score</Typography>
          <Info size={14} style={{ color: '#A4A7AE', cursor: 'help' }} />
        </Box>
      </Box>
    </Box>
  );
}

export default StudentHeader;
