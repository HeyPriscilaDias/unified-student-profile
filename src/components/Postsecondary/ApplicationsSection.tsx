'use client';

import { Box, Typography, Avatar, Chip } from '@mui/material';

type FitCategory = 'Reach' | 'Target' | 'Safety';

interface CollegeApplication {
  id: string;
  name: string;
  city: string;
  state: string;
  acceptanceRate: number;
  completionRate: number;
  fitCategory: FitCategory;
}

// Dummy data for the kanban board
const applyingColleges: CollegeApplication[] = [
  {
    id: '1',
    name: 'Stanford University',
    city: 'Stanford',
    state: 'CA',
    acceptanceRate: 4,
    completionRate: 96,
    fitCategory: 'Reach',
  },
];

const appliedColleges: CollegeApplication[] = [
  {
    id: '2',
    name: 'University of Michigan',
    city: 'Ann Arbor',
    state: 'MI',
    acceptanceRate: 20,
    completionRate: 92,
    fitCategory: 'Target',
  },
];

const acceptedColleges: CollegeApplication[] = [
  {
    id: '3',
    name: 'Arizona State University',
    city: 'Tempe',
    state: 'AZ',
    acceptanceRate: 88,
    completionRate: 69,
    fitCategory: 'Safety',
  },
];

function getFitChipColor(fitCategory: FitCategory): {
  bg: string;
  text: string;
  border: string;
} {
  switch (fitCategory) {
    case 'Reach':
      return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' };
    case 'Target':
      return { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' };
    case 'Safety':
      return { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' };
  }
}

function CollegeCard({ college }: { college: CollegeApplication }) {
  const chipColors = getFitChipColor(college.fitCategory);

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid #E5E7EB',
        p: 2,
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Fit Category Chip - Upper Right */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Chip
          label={college.fitCategory}
          size="small"
          sx={{
            backgroundColor: chipColors.bg,
            color: chipColors.text,
            border: `1px solid ${chipColors.border}`,
            fontWeight: 600,
            fontSize: '11px',
            height: '22px',
          }}
        />
      </Box>

      {/* Avatar and Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: '#111827',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {college.name.charAt(0)}
        </Avatar>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            color: '#111827',
            lineHeight: 1.3,
            pr: 6,
          }}
        >
          {college.name}
        </Typography>
      </Box>

      {/* Location */}
      <Typography
        sx={{
          fontSize: '13px',
          color: '#6B7280',
          mb: 1.5,
        }}
      >
        {college.city}, {college.state}
      </Typography>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box>
          <Typography
            sx={{
              fontSize: '11px',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 0.25,
            }}
          >
            Acceptance
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            {college.acceptanceRate}%
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '11px',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 0.25,
            }}
          >
            Completion
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            {college.completionRate}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function KanbanColumn({
  title,
  colleges,
  count,
}: {
  title: string;
  colleges: CollegeApplication[];
  count: number;
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Column Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            color: '#374151',
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#E5E7EB',
            borderRadius: '10px',
            px: 1,
            py: 0.25,
          }}
        >
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
            {count}
          </Typography>
        </Box>
      </Box>

      {/* Column Content */}
      <Box
        sx={{
          backgroundColor: '#F3F4F6',
          borderRadius: 2,
          p: 1.5,
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {colleges.map((college) => (
          <CollegeCard key={college.id} college={college} />
        ))}
        {colleges.length === 0 && (
          <Box
            sx={{
              border: '2px dashed #D1D5DB',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>
              No applications yet
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function ApplicationsSection() {
  return (
    <Box>
      <Typography
        component="h3"
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 600,
          fontSize: '22px',
          color: '#111827',
          mb: 2,
        }}
      >
        Applications
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        <KanbanColumn
          title="Applying"
          colleges={applyingColleges}
          count={applyingColleges.length}
        />
        <KanbanColumn
          title="Applied"
          colleges={appliedColleges}
          count={appliedColleges.length}
        />
        <KanbanColumn
          title="Accepted"
          colleges={acceptedColleges}
          count={acceptedColleges.length}
        />
      </Box>
    </Box>
  );
}

export default ApplicationsSection;
