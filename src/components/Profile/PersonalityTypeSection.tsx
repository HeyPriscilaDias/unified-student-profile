'use client';

import { Box, Typography } from '@mui/material';
import type { PersonalityType } from '@/types/student';

interface PersonalityTypeSectionProps {
  personalityType: PersonalityType;
  onViewDetails?: () => void;
}

function TraitCard({ name, description }: { name: string; description: string }) {
  return (
    <Box
      sx={{
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '16px',
          color: '#111827',
        }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: '#4B5563',
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export function PersonalityTypeSection({
  personalityType,
  onViewDetails,
}: PersonalityTypeSectionProps) {
  if (!personalityType.name) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          padding: '24px',
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
          Personality type
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#9CA3AF', mt: 1 }}>
          No personality assessment completed yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        padding: '24px',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
        }}
      >
        <Box>
          <Typography
            component="h3"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: '22px',
              color: '#111827',
              mb: 0.5,
            }}
          >
            Personality type
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: '24px',
              color: '#111827',
            }}
          >
            {personalityType.name}
          </Typography>
        </Box>
        {onViewDetails && (
          <Typography
            onClick={onViewDetails}
            sx={{
              fontSize: '14px',
              color: '#111827',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View details
          </Typography>
        )}
      </Box>

      {/* Traits Grid - 2x2 */}
      {personalityType.traits.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {personalityType.traits.slice(0, 4).map((trait, index) => (
            <TraitCard
              key={index}
              name={trait.name}
              description={trait.description}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PersonalityTypeSection;
