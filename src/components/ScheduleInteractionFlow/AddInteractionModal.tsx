'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { X, FileText, Mic } from 'lucide-react';

interface AddInteractionModalProps {
  open: boolean;
  onClose: () => void;
  onAddSummary: (interactionDate: string) => void;
  onStartRecording: (interactionDate: string) => void;
  studentName: string;
}

export function AddInteractionModal({
  open,
  onClose,
  onAddSummary,
  onStartRecording,
  studentName,
}: AddInteractionModalProps) {
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

  const handleAddSummary = () => {
    if (!interactionDate) return;
    onAddSummary(interactionDate);
    handleClose();
  };

  const handleStartRecording = () => {
    if (!interactionDate) return;
    onStartRecording(interactionDate);
    handleClose();
  };

  const isDateValid = !!interactionDate;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: 400,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
          }}
        >
          Add interaction
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: '#6B7280' }}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Date selection */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              mb: 1.5,
            }}
          >
            Date
          </Typography>
          <TextField
              type="date"
              value={interactionDate}
              onChange={(e) => setInteractionDate(e.target.value)}
              onClick={handleDateFieldClick}
              inputRef={dateInputRef}
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  cursor: 'pointer',
                },
                '& .MuiOutlinedInput-input': {
                  cursor: 'pointer',
                },
              }}
            />
        </Box>

        {/* Action options */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Add summary option */}
          <Button
            variant="outlined"
            startIcon={<FileText size={20} />}
            onClick={handleAddSummary}
            disabled={!isDateValid}
            sx={{
              textTransform: 'none',
              justifyContent: 'flex-start',
              py: 2,
              px: 2.5,
              borderColor: '#E5E7EB',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
              },
              '&.Mui-disabled': {
                borderColor: '#E5E7EB',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: isDateValid ? '#111827' : '#9CA3AF',
                }}
              >
                Add summary
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#6B7280',
                  fontWeight: 400,
                }}
              >
                Write notes about a conversation
              </Typography>
            </Box>
          </Button>

          {/* Start recording option */}
          <Button
            variant="outlined"
            startIcon={<Mic size={20} />}
            onClick={handleStartRecording}
            disabled={!isDateValid}
            sx={{
              textTransform: 'none',
              justifyContent: 'flex-start',
              py: 2,
              px: 2.5,
              borderColor: '#E5E7EB',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
              },
              '&.Mui-disabled': {
                borderColor: '#E5E7EB',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: isDateValid ? '#111827' : '#9CA3AF',
                }}
              >
                Start recording
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#6B7280',
                  fontWeight: 400,
                }}
              >
                Record and auto-generate summary
              </Typography>
            </Box>
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AddInteractionModal;
