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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import { Search, X, Mic, Sparkles } from 'lucide-react';
import { getAllStudents, getStudentData } from '@/lib/mockData';
import { MEETING_TEMPLATES } from '@/lib/meetingTemplates';
import { generateCustomTalkingPoints } from '@/lib/geminiService';
import type { Student } from '@/types/student';

interface NewMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onStartMeeting: (
    studentId: string,
    studentName: string,
    options?: { templateId?: string; customTalkingPoints?: string }
  ) => void;
  preselectedStudentId?: string;
}

export function NewMeetingModal({
  open,
  onClose,
  onStartMeeting,
  preselectedStudentId,
}: NewMeetingModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    preselectedStudentId ?? null
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Custom talking points state
  const [talkingPointsMode, setTalkingPointsMode] = useState<'template' | 'custom'>('template');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedTalkingPoints, setGeneratedTalkingPoints] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

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

  const handleGenerateCustom = async () => {
    if (!customPrompt.trim() || !selectedStudentId) return;

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const studentData = getStudentData(selectedStudentId);
      if (!studentData) {
        throw new Error('Student data not found');
      }

      const talkingPoints = await generateCustomTalkingPoints(customPrompt, studentData);
      setGeneratedTalkingPoints(talkingPoints);
    } catch (error) {
      console.error('Failed to generate talking points:', error);
      setGenerateError('Failed to generate talking points. Please try again or select a template.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStart = () => {
    if (!selectedStudent) return;

    if (talkingPointsMode === 'template' && selectedTemplateId) {
      onStartMeeting(
        selectedStudent.id,
        `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        { templateId: selectedTemplateId }
      );
    } else if (talkingPointsMode === 'custom' && generatedTalkingPoints) {
      onStartMeeting(
        selectedStudent.id,
        `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        { customTalkingPoints: generatedTalkingPoints }
      );
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedStudentId(preselectedStudentId ?? null);
    setSelectedTemplateId('');
    setTalkingPointsMode('template');
    setCustomPrompt('');
    setGeneratedTalkingPoints(null);
    setGenerateError(null);
    onClose();
  };

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'template' | 'custom' | null
  ) => {
    if (newMode !== null) {
      setTalkingPointsMode(newMode);
      // Clear the other mode's state
      if (newMode === 'template') {
        setGeneratedTalkingPoints(null);
        setCustomPrompt('');
        setGenerateError(null);
      } else {
        setSelectedTemplateId('');
      }
    }
  };

  const canStart =
    !!selectedStudentId &&
    ((talkingPointsMode === 'template' && !!selectedTemplateId) ||
      (talkingPointsMode === 'custom' && !!generatedTalkingPoints));

  const canGenerate = !!selectedStudentId && customPrompt.trim().length >= 10;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '720px',
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
          New Meeting
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
        {/* Talking Points Mode Toggle */}
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 1,
            mt: 1,
          }}
        >
          Talking Points
        </Typography>
        <ToggleButtonGroup
          value={talkingPointsMode}
          exclusive
          onChange={handleModeChange}
          size="small"
          fullWidth
          sx={{
            mb: 2,
            '& .MuiToggleButtonGroup-grouped': {
              border: '1px solid #E5E7EB',
              borderRadius: '8px !important',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 500,
              py: 0.75,
              '&:not(:first-of-type)': {
                borderLeft: '1px solid #E5E7EB',
                marginLeft: '-1px',
              },
              '&.Mui-selected': {
                backgroundColor: '#062F29',
                color: '#fff',
                borderColor: '#062F29',
                '&:hover': {
                  backgroundColor: '#0A4A40',
                },
              },
              '&:not(.Mui-selected)': {
                backgroundColor: '#fff',
                color: '#374151',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
              },
            },
          }}
        >
          <ToggleButton value="template">Template</ToggleButton>
          <ToggleButton value="custom">
            <Sparkles size={14} style={{ marginRight: 6 }} />
            Custom with AI
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Template Selector - only show in template mode */}
        {talkingPointsMode === 'template' && (
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel
              sx={{
                fontSize: '14px',
                color: '#6B7280',
                '&.Mui-focused': {
                  color: '#062F29',
                },
              }}
            >
              Select template
            </InputLabel>
            <Select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              label="Select template"
              sx={{
                fontSize: '14px',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#062F29',
                },
              }}
            >
              {MEETING_TEMPLATES.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      {template.name}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                      {template.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Custom Prompt - only show in custom mode */}
        {talkingPointsMode === 'custom' && (
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Describe what you want to discuss... (e.g., 'Focus on college application deadlines and financial aid options')"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
              disabled={isGenerating}
              sx={{
                mb: 1,
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
            {!selectedStudentId && (
              <Typography sx={{ fontSize: '12px', color: '#9CA3AF', mb: 1 }}>
                Select a student below to generate personalized talking points.
              </Typography>
            )}
            <Button
              variant="outlined"
              onClick={handleGenerateCustom}
              disabled={!canGenerate || isGenerating}
              startIcon={
                isGenerating ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <Sparkles size={14} />
                )
              }
              fullWidth
              sx={{
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 500,
                borderColor: '#D1D5DB',
                color: '#374151',
                borderRadius: '8px',
                py: 0.75,
                '&:hover': {
                  borderColor: '#062F29',
                  backgroundColor: '#F9FAFB',
                },
                '&.Mui-disabled': {
                  borderColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              {isGenerating ? 'Generating...' : generatedTalkingPoints ? 'Regenerate' : 'Generate Talking Points'}
            </Button>

            {generateError && (
              <Typography sx={{ fontSize: '12px', color: '#DC2626', mt: 1 }}>
                {generateError}
              </Typography>
            )}

            {/* Preview generated talking points */}
            {generatedTalkingPoints && (
              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '8px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#16A34A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    mb: 0.5,
                  }}
                >
                  Preview
                </Typography>
                <Box
                  sx={{
                    fontSize: '12px',
                    color: '#374151',
                    '& h3': {
                      fontSize: '13px',
                      fontWeight: 600,
                      margin: '8px 0 4px 0',
                      '&:first-of-type': { marginTop: 0 },
                    },
                    '& ul': { margin: '4px 0', paddingLeft: '16px' },
                    '& li': { marginBottom: '2px' },
                    '& strong': { fontWeight: 600 },
                  }}
                  dangerouslySetInnerHTML={{ __html: generatedTalkingPoints }}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Student Search */}
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 1,
          }}
        >
          Student
        </Typography>
        <TextField
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
            mb: 1,
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
            maxHeight: '160px',
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
          onClick={handleStart}
          disabled={!canStart}
          startIcon={<Mic size={16} />}
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

export default NewMeetingModal;
