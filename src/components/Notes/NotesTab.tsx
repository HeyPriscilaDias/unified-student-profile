'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import { Lock, Globe, StickyNote } from 'lucide-react';
import { SectionCard } from '@/components/shared';

interface Note {
  id: string;
  content: string;
  visibility: 'public' | 'private';
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}

interface NotesTabProps {
  studentId: string;
  studentFirstName: string;
}

function NoteItem({ note }: { note: Note }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        py: 2.5,
        px: 3,
        borderBottom: '1px solid #E5E7EB',
        '&:last-child': {
          borderBottom: 'none',
        },
        '&:hover': {
          backgroundColor: '#FAFAFA',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
        <Avatar
          src={note.authorAvatar}
          sx={{
            width: 36,
            height: 36,
            fontSize: '14px',
            bgcolor: '#062F29',
            fontWeight: 500,
          }}
        >
          {note.authorName
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}
          >
            {note.authorName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
              {formatDate(note.createdAt)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#6B7280',
              }}
            >
              {note.visibility === 'private' ? (
                <>
                  <Lock size={12} />
                  <Typography sx={{ fontSize: '12px' }}>Private</Typography>
                </>
              ) : (
                <>
                  <Globe size={12} />
                  <Typography sx={{ fontSize: '12px' }}>
                    Visible to staff
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: '14px',
          color: '#374151',
          lineHeight: 1.6,
          pl: 6.5,
        }}
      >
        {note.content}
      </Typography>
    </Box>
  );
}

export function NotesTab({ studentId: _studentId, studentFirstName }: NotesTabProps) {
  // Note: _studentId is available for future API integration
  const [noteText, setNoteText] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<'private' | 'public'>(
    'private'
  );
  const [notes, setNotes] = useState<Note[]>([]);

  const handleSubmitNote = () => {
    if (noteText.trim()) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        content: noteText.trim(),
        visibility: noteVisibility,
        authorName: 'Ms. Rodriguez',
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
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
      <SectionCard
        title="Add a Note"
        icon={<StickyNote size={18} style={{ color: '#062F29' }} />}
      >
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
      </SectionCard>

      {/* Notes List */}
      <SectionCard title="Notes History" noPadding>
        {notes.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              px: 3,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <StickyNote size={24} style={{ color: '#9CA3AF' }} />
            </Box>
            <Typography
              sx={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#374151',
                mb: 0.5,
              }}
            >
              No notes yet
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6B7280',
                maxWidth: '320px',
                mx: 'auto',
              }}
            >
              Add context or reflections to help you and your team support{' '}
              {studentFirstName}.
            </Typography>
          </Box>
        ) : (
          <Box>
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </Box>
        )}
      </SectionCard>
    </Box>
  );
}

export default NotesTab;
