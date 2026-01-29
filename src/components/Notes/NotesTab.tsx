'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { Lock, Globe, Pencil, Trash2 } from 'lucide-react';
import { useNotesContext, Note } from '@/contexts/NotesContext';
import { formatRelativeTime } from '@/lib/dateUtils';

interface NotesTabProps {
  studentId: string;
  studentFirstName: string;
}

export function NotesTab({ studentId, studentFirstName }: NotesTabProps) {
  const { getNotesForStudent, addNote, deleteNote } = useNotesContext();
  const [noteText, setNoteText] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<'private' | 'public'>(
    'private'
  );

  const notes = getNotesForStudent(studentId);

  const handleSubmitNote = () => {
    if (noteText.trim()) {
      addNote(studentId, noteText.trim(), noteVisibility);
      setNoteText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmitNote();
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(studentId, noteId);
  };

  return (
    <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
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
          Notes
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

      {/* Saved Notes List */}
      {notes.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

interface NoteItemProps {
  note: Note;
  onDelete: () => void;
}

function NoteItem({ note, onDelete }: NoteItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        py: 2,
        borderBottom: '1px solid #F3F4F6',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
          height: 'fit-content',
          flexShrink: 0,
        }}
      >
        <Pencil size={18} style={{ color: '#6B7280' }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Note
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {note.visibility === 'private' ? (
              <Lock size={12} style={{ color: '#9CA3AF' }} />
            ) : (
              <Globe size={12} style={{ color: '#9CA3AF' }} />
            )}
            <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>
              {note.visibility === 'private' ? 'Private' : 'Visible to staff'}
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {note.content}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>
          {formatRelativeTime(note.createdAt)}
        </Typography>
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            p: 0.5,
            color: '#9CA3AF',
            '&:hover': {
              color: '#EF4444',
              backgroundColor: '#FEE2E2',
            },
          }}
        >
          <Trash2 size={14} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default NotesTab;
