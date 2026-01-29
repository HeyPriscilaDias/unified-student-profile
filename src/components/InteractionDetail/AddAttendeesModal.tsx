'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { X, UserPlus } from 'lucide-react';

interface AddAttendeesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (attendees: string[]) => void;
  currentAttendees: string[];
}

export function AddAttendeesModal({
  open,
  onClose,
  onSave,
  currentAttendees,
}: AddAttendeesModalProps) {
  const [attendees, setAttendees] = useState<string[]>(currentAttendees);
  const [inputValue, setInputValue] = useState('');

  // Sync state when modal opens or currentAttendees changes
  useEffect(() => {
    if (open) {
      setAttendees(currentAttendees);
      setInputValue('');
    }
  }, [open, currentAttendees]);

  const handleAddAttendee = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !attendees.includes(trimmed)) {
      setAttendees([...attendees, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveAttendee = (attendeeToRemove: string) => {
    setAttendees(attendees.filter((a) => a !== attendeeToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAttendee();
    }
  };

  const handleSave = () => {
    onSave(attendees);
    onClose();
  };

  const handleClose = () => {
    setAttendees(currentAttendees);
    setInputValue('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 2.5,
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
          }}
        >
          Add Attendees
        </Typography>
        <Box
          onClick={handleClose}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '8px',
            color: '#6B7280',
            '&:hover': {
              backgroundColor: '#F3F4F6',
              color: '#111827',
            },
          }}
        >
          <X size={18} />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography
          sx={{
            fontSize: '14px',
            color: '#6B7280',
            mb: 2,
          }}
        >
          Add other people who attended this meeting (e.g., parent, guardian, teacher).
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            placeholder="Enter name (e.g., Jessica's mom)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
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
          <Button
            onClick={handleAddAttendee}
            disabled={!inputValue.trim()}
            variant="contained"
            sx={{
              minWidth: 'auto',
              px: 2,
              backgroundColor: '#155E4C',
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0E4A3B',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                backgroundColor: '#E5E7EB',
              },
            }}
          >
            <UserPlus size={18} />
          </Button>
        </Box>

        {attendees.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attendees.map((attendee) => (
              <Chip
                key={attendee}
                label={attendee}
                onDelete={() => handleRemoveAttendee(attendee)}
                deleteIcon={<X size={14} />}
                sx={{
                  backgroundColor: '#EFF6F4',
                  color: '#155E4C',
                  fontSize: '13px',
                  fontWeight: 500,
                  '& .MuiChip-deleteIcon': {
                    color: '#155E4C',
                    '&:hover': {
                      color: '#0E4A3B',
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #E5E7EB',
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            color: '#6B7280',
            px: 2,
            '&:hover': {
              backgroundColor: '#F9FAFB',
              color: '#111827',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            backgroundColor: '#155E4C',
            color: '#fff',
            borderRadius: '8px',
            px: 3,
            py: 0.75,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#0E4A3B',
              boxShadow: 'none',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddAttendeesModal;
