'use client';

import { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { FileText } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import { Slate } from '@/theme/primitives';

interface NotesSectionProps {
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

export function NotesSection({ notes: initialNotes = '', onNotesChange }: NotesSectionProps) {
  const [notes, setNotes] = useState(initialNotes);

  // Sync local state with prop changes (e.g., when meeting data loads)
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onNotesChange?.(newNotes);
  };

  return (
    <SectionCard
      title="Notes"
      icon={<FileText size={18} />}
    >
      <Box>
        <TextField
          fullWidth
          multiline
          minRows={12}
          maxRows={20}
          value={notes}
          onChange={handleNotesChange}
          placeholder="Meeting notes..."
          sx={{
            '& .MuiInputBase-root': {
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              lineHeight: 1.7,
              backgroundColor: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: Slate[200],
              },
              '&:hover fieldset': {
                borderColor: Slate[300],
              },
              '&.Mui-focused fieldset': {
                borderColor: Slate[400],
              },
            },
            '& .MuiInputBase-input': {
              whiteSpace: 'pre-wrap',
            },
          }}
        />
      </Box>
    </SectionCard>
  );
}

export default NotesSection;
