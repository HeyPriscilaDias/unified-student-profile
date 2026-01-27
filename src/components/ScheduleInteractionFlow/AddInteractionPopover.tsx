'use client';

import { Dialog, Box, Typography, Button } from '@mui/material';

interface AddInteractionPopoverProps {
  anchorEl?: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onCreateInteraction: () => void;
}

export function AddInteractionPopover({
  open,
  onClose,
  onCreateInteraction,
}: AddInteractionPopoverProps) {
  const handleCreate = () => {
    onCreateInteraction();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        paper: {
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            p: 2.5,
            width: 340,
            maxWidth: '90vw',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header */}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          Create a new meeting to track conversations with this student.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              flex: 1,
              textTransform: 'none',
              borderColor: '#E5E7EB',
              color: '#374151',
              borderRadius: '8px',
              py: 1,
              fontWeight: 500,
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              flex: 1,
              textTransform: 'none',
              backgroundColor: '#062F29',
              borderRadius: '8px',
              py: 1,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#0a4a40',
              },
            }}
          >
            Create meeting
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default AddInteractionPopover;
