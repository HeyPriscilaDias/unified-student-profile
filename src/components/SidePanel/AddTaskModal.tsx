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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Search, X, User, Users } from 'lucide-react';
import { getAllStudents } from '@/lib/mockData';
import type { Student } from '@/types/student';
import dayjs, { Dayjs } from 'dayjs';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreateTask: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    studentId?: string;
    taskType: 'staff' | 'student';
  }) => void;
}

export function AddTaskModal({ open, onClose, onCreateTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [assignee, setAssignee] = useState<'staff' | 'student'>('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentPicker, setShowStudentPicker] = useState(false);

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

  const handleCreate = () => {
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : undefined,
      studentId: selectedStudentId || undefined,
      taskType: selectedStudentId ? assignee : 'staff',
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setSelectedStudentId(null);
    setAssignee('staff');
    setSearchQuery('');
    setShowStudentPicker(false);
    onClose();
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowStudentPicker(false);
    setSearchQuery('');
  };

  const handleRemoveStudent = () => {
    setSelectedStudentId(null);
    setAssignee('staff');
  };

  const canCreate = title.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '85vh',
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
          Add Task
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
        {/* Title Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              mb: 1,
            }}
          >
            Title <span style={{ color: '#EF4444' }}>*</span>
          </Typography>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
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
        </Box>

        {/* Description Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              mb: 1,
            }}
          >
            Description
          </Typography>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            fullWidth
            multiline
            rows={3}
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
        </Box>

        {/* Due Date Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              mb: 1,
            }}
          >
            Due Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  placeholder: 'Select a date',
                  sx: {
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
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Student Picker */}
        <Box sx={{ mb: selectedStudentId ? 3 : 0 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              mb: 1,
            }}
          >
            Link to Student
          </Typography>

          {selectedStudent ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: '8px',
                backgroundColor: '#EFF6F4',
                border: '1px solid #155E4C',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={selectedStudent.avatarUrl}
                  alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: '#155E4C',
                    color: '#fff',
                  }}
                >
                  {`${selectedStudent.firstName[0]}${selectedStudent.lastName[0]}`}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                    Grade {selectedStudent.grade}
                  </Typography>
                </Box>
              </Box>
              <Box
                onClick={handleRemoveStudent}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  color: '#6B7280',
                  '&:hover': {
                    backgroundColor: '#E5E7EB',
                    color: '#111827',
                  },
                }}
              >
                <X size={16} />
              </Box>
            </Box>
          ) : (
            <>
              <TextField
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowStudentPicker(true);
                }}
                onFocus={() => setShowStudentPicker(true)}
                placeholder="Search students..."
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <Search
                      size={16}
                      style={{ color: '#9CA3AF', marginRight: 8, flexShrink: 0 }}
                    />
                  ),
                }}
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

              {showStudentPicker && (
                <List
                  sx={{
                    mt: 1,
                    py: 0,
                    maxHeight: '180px',
                    overflowY: 'auto',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
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
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                        No students found
                      </Typography>
                    </Box>
                  ) : (
                    filteredStudents.map((student: Student) => {
                      const fullName = `${student.firstName} ${student.lastName}`;
                      const isOnTrack = student.onTrackStatus === 'on_track';

                      return (
                        <ListItemButton
                          key={student.id}
                          onClick={() => handleSelectStudent(student.id)}
                          sx={{
                            py: 1,
                            px: 1.5,
                            '&:hover': {
                              backgroundColor: '#F9FAFB',
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
                                fontSize: '11px',
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
                                fontWeight: 500,
                                color: '#111827',
                              },
                            }}
                          />
                        </ListItemButton>
                      );
                    })
                  )}
                </List>
              )}
            </>
          )}
        </Box>

        {/* Assignee Toggle - only show when student is selected */}
        {selectedStudentId && (
          <Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                mb: 1,
              }}
            >
              Assign to
            </Typography>
            <ToggleButtonGroup
              value={assignee}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setAssignee(newValue);
                }
              }}
              sx={{
                '& .MuiToggleButtonGroup-grouped': {
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px !important',
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#6B7280',
                  '&.Mui-selected': {
                    backgroundColor: '#EFF6F4',
                    borderColor: '#155E4C',
                    color: '#155E4C',
                    '&:hover': {
                      backgroundColor: '#E5F0ED',
                    },
                  },
                  '&:not(:first-of-type)': {
                    marginLeft: '8px',
                    borderLeft: '1px solid #E5E7EB',
                  },
                },
              }}
            >
              <ToggleButton value="staff">
                <User size={16} style={{ marginRight: 8 }} />
                Me (Counselor)
              </ToggleButton>
              <ToggleButton value="student">
                <Users size={16} style={{ marginRight: 8 }} />
                {selectedStudent?.firstName || 'Student'}
              </ToggleButton>
            </ToggleButtonGroup>
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
          Discard
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!canCreate}
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaskModal;
