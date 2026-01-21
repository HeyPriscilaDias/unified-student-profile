'use client';

import { Box, Typography, IconButton, Button } from '@mui/material';
import { Sparkles, Check, X, Plus } from 'lucide-react';
import { AIReviewBadge } from '@/components/shared';
import type { SuggestedAction } from '@/types/student';

interface SuggestedActionsPanelProps {
  actions: SuggestedAction[];
  onAccept: (action: SuggestedAction) => void;
  onDismiss: (action: SuggestedAction) => void;
}

function ActionItem({
  action,
  onAccept,
  onDismiss,
}: {
  action: SuggestedAction;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderRadius: '8px',
        background: 'linear-gradient(to right, #FFFBEB, #F0FDF4)',
        border: '1px solid #FDE68A',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 500,
            color: '#062F29',
            fontSize: '14px',
            mb: 0.5,
          }}
        >
          {action.title}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: '#4B5563' }}>
          {action.description}
        </Typography>
        {action.sourceDate && (
          <Typography sx={{ fontSize: '12px', color: '#6B7280', mt: 0.5 }}>
            From {action.source === 'meeting_summary' ? 'meeting summary' : 'Alma snapshot'} - {action.sourceDate}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {action.assignee === 'student' ? (
          <Button
            size="small"
            variant="outlined"
            startIcon={<Plus size={14} />}
            onClick={onAccept}
            sx={{
              textTransform: 'none',
              fontSize: '12px',
              fontWeight: 500,
              color: '#062F29',
              borderColor: '#D1D5DB',
              backgroundColor: 'white',
              px: 1.5,
              py: 0.5,
              '&:hover': {
                borderColor: '#062F29',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            Add to student tasks
          </Button>
        ) : (
          <IconButton
            size="small"
            onClick={onAccept}
            sx={{
              color: '#16A34A',
              '&:hover': {
                backgroundColor: '#DCFCE7',
              },
            }}
          >
            <Check size={18} />
          </IconButton>
        )}
        <IconButton
          size="small"
          onClick={onDismiss}
          sx={{
            color: '#9CA3AF',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          <X size={18} />
        </IconButton>
      </Box>
    </Box>
  );
}

export function SuggestedActionsPanel({
  actions,
  onAccept,
  onDismiss,
}: SuggestedActionsPanelProps) {
  const pendingActions = actions.filter((a) => a.status === 'pending');

  if (pendingActions.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #D5D7DA',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 3,
          py: 2,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Sparkles size={20} style={{ color: '#F59E0B' }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: '#062F29',
          }}
        >
          Suggested Actions
        </Typography>
        <AIReviewBadge />
      </Box>

      {/* Actions list */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {pendingActions.map((action) => (
          <ActionItem
            key={action.id}
            action={action}
            onAccept={() => onAccept(action)}
            onDismiss={() => onDismiss(action)}
          />
        ))}
      </Box>

      {/* Footer note */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          backgroundColor: '#F9FAFB',
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
          These suggestions are AI-generated based on meeting summaries and student data.
        </Typography>
      </Box>
    </Box>
  );
}

export default SuggestedActionsPanel;
