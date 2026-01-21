'use client';

import { Box, TextField, Button } from '@mui/material';
import { FileText } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
import { SectionCard } from '@/components/shared';
import { Slate } from '@/theme/primitives';

interface NotesSectionProps {
  notes?: string;
  onNotesChange?: (notes: string) => void;
  label?: string;
  placeholder?: string;
  showGenerateButton?: boolean;
  onGenerate?: () => void;
  readOnly?: boolean;
}

export function NotesSection({
  notes = '',
  onNotesChange,
  label = 'Summary',
  placeholder = 'Add a summary of your interaction...',
  showGenerateButton = false,
  onGenerate,
  readOnly = false,
}: NotesSectionProps) {
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNotesChange?.(e.target.value);
  };

  return (
    <SectionCard
      title={label}
      icon={<FileText size={18} />}
    >
      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          multiline
          minRows={readOnly ? undefined : 12}
          maxRows={readOnly ? undefined : 20}
          value={notes}
          onChange={handleNotesChange}
          placeholder={placeholder}
          disabled={readOnly}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              lineHeight: 1.7,
              backgroundColor: readOnly ? '#F9FAFB' : 'white',
              paddingBottom: showGenerateButton && !readOnly ? '56px' : undefined,
              ...(readOnly && {
                height: '300px',
                alignItems: 'flex-start',
                overflow: 'auto',
              }),
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: Slate[200],
              },
              '&:hover fieldset': {
                borderColor: readOnly ? Slate[200] : Slate[300],
              },
              '&.Mui-focused fieldset': {
                borderColor: Slate[400],
              },
              '&.Mui-disabled': {
                '& fieldset': {
                  borderColor: Slate[200],
                },
              },
            },
            '& .MuiInputBase-input': {
              whiteSpace: 'pre-wrap',
              WebkitTextFillColor: readOnly ? '#374151' : undefined,
            },
          }}
        />
        {showGenerateButton && !readOnly && (
          <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
            <Button
              variant="outlined"
              startIcon={<Alma size={16} color="#12B76A" />}
              onClick={onGenerate}
              sx={{
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                borderColor: '#E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white',
                px: 2,
                py: 0.75,
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              Generate talking points
            </Button>
          </Box>
        )}
      </Box>
    </SectionCard>
  );
}

export default NotesSection;
