'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Lock, Globe } from 'lucide-react';

interface NotesTabProps {
  studentId: string;
  studentFirstName: string;
}

export function NotesTab({ studentId: _studentId, studentFirstName }: NotesTabProps) {
  // Note: _studentId is available for future API integration
  const [noteText, setNoteText] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<'private' | 'public'>(
    'private'
  );

  const handleSubmitNote = () => {
    if (noteText.trim()) {
      // TODO: Save note to backend
      setNoteText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmitNote();
    }
  };

  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Note Input Form */}
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
          Add a Note
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
            Add notes to remember important context about {studentFirstName}.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={`What would you like to remember about ${studentFirstName}?`}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                backgroundColor: '#FAFAFA',
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

          {/* Visibility controls */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noteVisibility === 'private'}
                    onChange={() => setNoteVisibility('private')}
                    size="small"
                    sx={{
                      color: '#9CA3AF',
                      '&.Mui-checked': {
                        color: '#062F29',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Lock size={14} style={{ color: '#6B7280' }} />
                    <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                      Only visible to me
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noteVisibility === 'public'}
                    onChange={() => setNoteVisibility('public')}
                    size="small"
                    sx={{
                      color: '#9CA3AF',
                      '&.Mui-checked': {
                        color: '#062F29',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Globe size={14} style={{ color: '#6B7280' }} />
                    <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                      Visible to all staff
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Submit button */}
            <Button
              variant="contained"
              onClick={handleSubmitNote}
              disabled={!noteText.trim()}
              sx={{
                textTransform: 'none',
                backgroundColor: '#062F29',
                fontSize: '14px',
                fontWeight: 500,
                px: 3,
                '&:hover': {
                  backgroundColor: '#2B4C46',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              Save Note
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default NotesTab;
