'use client';

import { Box, Typography, Button } from '@mui/material';
import { Sparkles, RefreshCw } from 'lucide-react';
import type { AlmaSnapshot } from '@/types/student';

interface AlmaSnapshotSectionProps {
  snapshot: AlmaSnapshot | null;
  onGenerateSnapshot: () => void;
  isLoading?: boolean;
}

function formatGeneratedDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AlmaSnapshotSection({
  snapshot,
  onGenerateSnapshot,
  isLoading = false,
}: AlmaSnapshotSectionProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Section Header - Outside container */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 500,
          fontSize: '22px',
          lineHeight: '28px',
          letterSpacing: '-0.01em',
          color: '#051D19',
        }}
      >
        Alma Snapshot
      </Typography>

      {/* Container */}
      <Box
        sx={{
          backgroundColor: '#F5F8FF',
          borderRadius: '12px',
          border: '1px solid #C6D7FD',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {snapshot ? (
          <>
            {/* Generated date with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sparkles size={16} style={{ color: '#414651' }} />
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#252B37',
                }}
              >
                Generated {formatGeneratedDate(snapshot.generatedAt)}
              </Typography>
            </Box>

            {/* Content */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#252B37',
                  mb: 2,
                }}
              >
                {snapshot.content}
              </Typography>

              {snapshot.bulletPoints.length > 0 && (
                <Box
                  component="ul"
                  sx={{
                    listStyleType: 'disc',
                    pl: '21px',
                    m: 0,
                  }}
                >
                  {snapshot.bulletPoints.map((point, index) => (
                    <Box
                      key={index}
                      component="li"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#252B37',
                      }}
                    >
                      {point}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#252B37',
            }}
          >
            No snapshot generated yet. Generate one to get AI-powered insights about this student.
          </Typography>
        )}

        {/* Update button */}
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={20} style={{ color: '#414651' }} />}
          onClick={onGenerateSnapshot}
          disabled={isLoading}
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'none',
            backgroundColor: 'white',
            borderColor: '#D5D7DA',
            borderRadius: '8px',
            color: '#414651',
            fontFamily: '"Inter", sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            py: '6px',
            px: '12px',
            gap: 2,
            '&:hover': {
              borderColor: '#A4A7AE',
              backgroundColor: '#FAFAFA',
            },
            '&:disabled': {
              backgroundColor: 'white',
              borderColor: '#D5D7DA',
            },
          }}
        >
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </Box>
    </Box>
  );
}

export default AlmaSnapshotSection;
