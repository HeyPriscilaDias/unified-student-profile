import { Box, Typography, Avatar } from '@mui/material';
import { Check } from 'lucide-react';
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
      {isOnTrack ? (
        <Check size={12} strokeWidth={2.5} />
      ) : (
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#EF4444',
          }}
        />
      )}
      {isOnTrack ? 'On track' : 'Off track'}
    </Box>
  );
}

export function StudentHeader({ student }: StudentHeaderProps) {
  return (
    <Box>
      <Box sx={{ py: 2.5 }}>
        {/* Top row: Avatar + Name/Grade/OnTrack */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            mb: 1.5,
          }}
        >
          {/* Avatar */}
          <Avatar
            src={student.avatarUrl}
            alt={`${student.firstName} ${student.lastName}`}
            variant="rounded"
            sx={{
              width: 80,
              height: 80,
              borderRadius: '12px',
              border: '2px solid #E9EAEB',
            }}
          >
            {student.firstName[0]}{student.lastName[0]}
          </Avatar>

          {/* Name, grade, on-track status, stats, mission */}
          <Box sx={{ flex: 1 }}>
            {/* Row 1: Name · Grade · On Track */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
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
              <Typography sx={{ fontSize: '14px', color: '#535862' }}>
                ·
              </Typography>
              <OnTrackPill status={student.onTrackStatus} />
            </Box>

            {/* Row 2: Stats - GPA · Weighted GPA · SAT · ACT */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                flexWrap: 'wrap',
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
                {student.gpa.toFixed(2)}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#717680' }}>GPA</Typography>

              {student.weightedGpa !== undefined && (
                <>
                  <Typography sx={{ fontSize: '14px', color: '#D5D7DA' }}>·</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
                    {student.weightedGpa.toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#717680' }}>Weighted GPA</Typography>
                </>
              )}

              {student.satScore && (
                <>
                  <Typography sx={{ fontSize: '14px', color: '#D5D7DA' }}>·</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
                    {student.satScore}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#717680' }}>SAT</Typography>
                </>
              )}

              {student.actScore && (
                <>
                  <Typography sx={{ fontSize: '14px', color: '#D5D7DA' }}>·</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#181D27' }}>
                    {student.actScore}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#717680' }}>ACT</Typography>
                </>
              )}
            </Box>

            {/* Row 3: Mission statement */}
            {student.missionStatement && (
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
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default StudentHeader;
