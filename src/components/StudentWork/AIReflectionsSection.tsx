'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { EmptyState } from '@/components/shared';
import { AIReflectionItem } from './AIReflectionItem';
import type { AIReflection } from '@/types/student';

interface AIReflectionsSectionProps {
  reflections: AIReflection[];
  pageSize?: number;
}

export function AIReflectionsSection({
  reflections,
  pageSize = 5,
}: AIReflectionsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedReflections = showAll
    ? reflections
    : reflections.slice(0, pageSize);
  const hasMore = reflections.length > pageSize;

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
        Guided Alma Reflections
      </Typography>

      {reflections.length === 0 ? (
        <EmptyState type="no_reflections" />
      ) : (
        <>
          <Box>
            {displayedReflections.map((reflection) => (
              <AIReflectionItem key={reflection.id} reflection={reflection} />
            ))}
          </Box>

          {hasMore && (
            <Box className="mt-4 text-center">
              <Button
                variant="text"
                onClick={() => setShowAll(!showAll)}
                className="text-slate-600 hover:text-slate-800"
                sx={{ textTransform: 'none' }}
              >
                {showAll
                  ? 'Show less'
                  : `View all ${reflections.length} reflections`}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default AIReflectionsSection;
