'use client';

import { useState, useMemo } from 'react';
import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Search, X } from 'lucide-react';
import { getAllStudents } from '@/lib/mockData';
import type { Student } from '@/types/student';

interface StudentPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string, studentName: string) => void;
  preselectedStudentId?: string;
}

export function StudentPickerModal({
  open,
  onClose,
  onSelectStudent,
  preselectedStudentId,
}: StudentPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    preselectedStudentId ?? null
  );

  const students = useMemo(() => getAllStudents(), []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [students, searchQuery]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) ?? null,
    [students, selectedStudentId]
  );

  const handleStartMeeting = () => {
    if (selectedStudent) {
      onSelectStudent(
        selectedStudent.id,
        `${selectedStudent.firstName} ${selectedStudent.lastName}`
      );
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedStudentId(preselectedStudentId ?? null);
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
          maxHeight: '520px',
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
          Select a Student
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

      <DialogContent sx={{ px: 3, py: 0 }}>
        {/* Search Field */}
        <TextField
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          size="small"
          autoFocus
          InputProps={{
            startAdornment: (
              <Search
                size={16}
                style={{ color: '#9CA3AF', marginRight: 8, flexShrink: 0 }}
              />
            ),
          }}
          sx={{
            mt: 1,
            mb: 1.5,
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

        {/* Student List */}
        <List
          sx={{
            py: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            mx: -1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#D1D5DB',
              borderRadius: '3px',
            },
          }}
        >
          {filteredStudents.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                No students found
              </Typography>
            </Box>
          ) : (
            filteredStudents.map((student: Student) => {
              const isSelected = selectedStudentId === student.id;
              const fullName = `${student.firstName} ${student.lastName}`;
              const isOnTrack = student.onTrackStatus === 'on_track';

              return (
                <ListItemButton
                  key={student.id}
                  selected={isSelected}
                  onClick={() => setSelectedStudentId(student.id)}
                  sx={{
                    borderRadius: '8px',
                    mx: 1,
                    mb: 0.5,
                    py: 1,
                    px: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: '#EFF6F4',
                      border: '1px solid #155E4C',
                      '&:hover': {
                        backgroundColor: '#E5F0ED',
                      },
                    },
                    '&:not(.Mui-selected)': {
                      border: '1px solid transparent',
                      '&:hover': {
                        backgroundColor: '#F9FAFB',
                      },
                    },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar
                      src={student.avatarUrl}
                      alt={fullName}
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: '#155E4C',
                        color: '#fff',
                      }}
                    >
                      {fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={fullName}
                    secondary={
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.25,
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{ fontSize: '12px', color: '#6B7280' }}
                        >
                          Grade {student.grade}
                        </Typography>
                        <Box
                          component="span"
                          sx={{
                            width: 3,
                            height: 3,
                            borderRadius: '50%',
                            backgroundColor: '#D1D5DB',
                            display: 'inline-block',
                          }}
                        />
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: isOnTrack ? '#16A34A' : '#DC2626',
                          }}
                        >
                          {isOnTrack ? 'On Track' : 'Off Track'}
                        </Typography>
                      </Box>
                    }
                    primaryTypographyProps={{
                      sx: {
                        fontSize: '14px',
                        fontWeight: isSelected ? 600 : 500,
                        color: '#111827',
                      },
                    }}
                  />
                </ListItemButton>
              );
            })
          )}
        </List>
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
          onClick={handleStartMeeting}
          disabled={!selectedStudentId}
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
            '&.Mui-disabled': {
              backgroundColor: '#E5E7EB',
              color: '#9CA3AF',
            },
          }}
        >
          Start Meeting
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StudentPickerModal;
