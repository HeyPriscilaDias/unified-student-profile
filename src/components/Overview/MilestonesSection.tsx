'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Check, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { EmptyState } from '@/components/shared';
import { getMilestoneCompletionRate } from '@/lib/onTrackCalculation';
import type { Milestone } from '@/types/student';

interface MilestonesSectionProps {
  milestones: Milestone[];
  onMilestoneClick?: (milestone: Milestone) => void;
  initialShowCount?: number;
}

function ChecklistIcon({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#0C4F42',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Check size={12} color="white" strokeWidth={3} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: '1.5px dashed #A4A7AE',
        flexShrink: 0,
      }}
    />
  );
}

function MilestoneItem({
  milestone,
  onClick,
}: {
  milestone: Milestone;
  onClick?: () => void;
}) {
  const isCompleted = milestone.status === 'done';
  const isCustom = milestone.type === 'custom';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            }
          : {},
      }}
    >
      <Box sx={{ p: '2px' }}>
        <ChecklistIcon completed={isCompleted} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#252B37',
              flexShrink: 0,
            }}
          >
            {milestone.title}
          </Typography>
          {milestone.description && (
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#535862',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {` · ${milestone.description}`}
            </Typography>
          )}
        </Box>

        {isCustom && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
              ml: 1,
            }}
          >
            <Pencil size={16} color="#717680" />
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#535862',
              }}
            >
              Custom milestone
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function MilestonesSection({
  milestones,
  onMilestoneClick,
  initialShowCount = 3,
}: MilestonesSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const { completed, total, percentage } = getMilestoneCompletionRate(milestones);

  const displayedMilestones = showAll
    ? milestones
    : milestones.slice(0, initialShowCount);
  const hasMore = milestones.length > initialShowCount;

  if (milestones.length === 0) {
    return (
      <Box>
        <Box sx={{ mb: 1 }}>
          <Typography
            component="h3"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: '22px',
              color: '#111827',
            }}
          >
            Milestones
          </Typography>
        </Box>
        <EmptyState type="no_milestones" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Header with title and progress */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '22px',
            color: '#111827',
            flex: 1,
          }}
        >
          Milestones
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#252B37',
              }}
            >
              {completed}/{total}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 4,
              }}
            >
              {/* Background */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#D5D7DA',
                  borderRadius: '100px',
                }}
              />
              {/* Progress */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: '#0C4F42',
                  borderRadius: '100px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Container */}
      <Box
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '12px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Checklist items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {displayedMilestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              onClick={
                onMilestoneClick ? () => onMilestoneClick(milestone) : undefined
              }
            />
          ))}
        </Box>

        {/* Show more/less toggle */}
        {hasMore && (
          <Box
            onClick={() => setShowAll(!showAll)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              pl: 1.5,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            {showAll ? (
              <ChevronUp size={16} color="#535862" />
            ) : (
              <ChevronDown size={16} color="#535862" />
            )}
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#535862',
              }}
            >
              {showAll ? 'Show less' : 'Show more'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MilestonesSection;
