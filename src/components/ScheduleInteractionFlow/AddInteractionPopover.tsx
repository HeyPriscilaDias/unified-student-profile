'use client';

import { useState, useRef } from 'react';
import { Popover, Box, Typography, Button, TextField } from '@mui/material';

interface AddInteractionPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onCreateInteraction: (interactionDate: string) => void;
}

export function AddInteractionPopover({
  anchorEl,
  open,
  onClose,
  onCreateInteraction,
}: AddInteractionPopoverProps) {
  const [interactionDate, setInteractionDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Default to today YYYY-MM-DD
  );
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateFieldClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleClose = () => {
    // Reset date when closing
    setInteractionDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const handleCreate = () => {
    if (!interactionDate) return;
    onCreateInteraction(interactionDate);
    handleClose();
  };

  const isDateValid = !!interactionDate;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            mt: 1,
            p: 2.5,
            width: 300,
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
          When is this interaction expected to happen?
        </Typography>

        {/* Date Input */}
        <Box onClick={handleDateFieldClick} sx={{ cursor: 'pointer' }}>
          <TextField
            fullWidth
            type="date"
            value={interactionDate}
            onChange={(e) => setInteractionDate(e.target.value)}
            inputRef={dateInputRef}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#062F29',
                },
              },
            }}
          />
        </Box>

        {/* Create Button */}
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!isDateValid}
          sx={{
            textTransform: 'none',
            backgroundColor: '#062F29',
            borderRadius: '8px',
            py: 1,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#0a4a40',
            },
            '&.Mui-disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF',
            },
          }}
        >
          Create interaction
        </Button>
      </Box>
    </Popover>
  );
}

export default AddInteractionPopover;
