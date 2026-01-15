'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, IconButton, Typography, Switch, Chip, Slide, TextField, InputAdornment } from '@mui/material';
import { Sparkles, X, RotateCcw, History, ChevronDown, ChevronUp, Info, Send } from 'lucide-react';
import { useAlmaChatContext } from '@/contexts/AlmaChatContext';
import { useStudentData } from '@/hooks/useStudentData';
import type { Milestone, SmartGoal, Bookmark, StudentProfile } from '@/types/student';

interface StudentContext {
  firstName: string;
  lastName: string;
  grade: number;
  careerVision?: string;
  milestones: Milestone[];
  smartGoals: SmartGoal[];
  bookmarks: Bookmark[];
  profile?: StudentProfile;
}

function generateContextAwareSuggestions(context?: StudentContext): { initial: string[]; more: string[] } {
  if (!context) {
    return {
      initial: [
        'How to choose the best college for me?',
        'How to choose a major?',
      ],
      more: [
        'What scholarships am I eligible for?',
        'How do I write a strong personal statement?',
        'What extracurriculars should I focus on?',
      ],
    };
  }

  const suggestions: string[] = [];
  const { firstName, grade, careerVision, milestones, smartGoals, bookmarks, profile } = context;

  const careerBookmarks = bookmarks.filter(b => b.type === 'career' && b.isBookmarked);
  const schoolBookmarks = bookmarks.filter(b => b.type === 'school' && b.isBookmarked);
  const pendingMilestones = milestones.filter(m => m.status === 'not_done');
  const activeGoals = smartGoals.filter(g => g.status === 'active');

  if (careerBookmarks.length > 0) {
    const topCareer = careerBookmarks[0];
    suggestions.push(`What are the best pathways to become a ${topCareer.title}?`);
    if (topCareer.tags?.includes('Healthcare')) {
      suggestions.push(`What clinical experiences would help ${firstName}'s healthcare career goals?`);
    }
  }

  if (schoolBookmarks.length > 0) {
    const topSchool = schoolBookmarks[0];
    suggestions.push(`How can ${firstName} strengthen their ${topSchool.title} application?`);
  }

  if (pendingMilestones.length > 0) {
    const urgentMilestone = pendingMilestones[0];
    if (urgentMilestone.title.toLowerCase().includes('fafsa')) {
      suggestions.push(`What documents does ${firstName} need for FAFSA completion?`);
    } else if (urgentMilestone.title.toLowerCase().includes('college')) {
      suggestions.push(`What are the key deadlines ${firstName} should track?`);
    } else if (urgentMilestone.title.toLowerCase().includes('shadow')) {
      suggestions.push(`How can ${firstName} find job shadowing opportunities?`);
    }
  }

  if (activeGoals.length > 0) {
    const topGoal = activeGoals[0];
    if (topGoal.title.toLowerCase().includes('application')) {
      suggestions.push(`Tips for completing ${firstName}'s remaining college applications?`);
    } else if (topGoal.title.toLowerCase().includes('sat') || topGoal.title.toLowerCase().includes('score')) {
      suggestions.push(`What study strategies could help ${firstName} improve test scores?`);
    }
  }

  if (grade === 12) {
    suggestions.push(`What should ${firstName} know about senior year financial aid?`);
    suggestions.push(`How to prepare for college transition?`);
  } else if (grade === 11) {
    suggestions.push(`What can ${firstName} do this year to prepare for college applications?`);
  }

  if (careerVision && careerVision.toLowerCase().includes('nurs')) {
    suggestions.push(`What nursing programs align with ${firstName}'s goals?`);
  }

  if (profile?.experiences?.some(exp => exp.type === 'volunteer')) {
    suggestions.push(`How can ${firstName}'s volunteer experience strengthen applications?`);
  }

  const uniqueSuggestions = [...new Set(suggestions)];

  return {
    initial: uniqueSuggestions.slice(0, 2),
    more: uniqueSuggestions.slice(2, 5),
  };
}

export function FloatingAlmaChat() {
  const params = useParams();
  const studentId = params?.studentId as string | undefined;

  const {
    isExpanded,
    toggleExpanded,
    currentStudent,
    setCurrentStudent,
    isContextEnabled,
    setIsContextEnabled,
  } = useAlmaChatContext();

  const [message, setMessage] = useState('');
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);

  // Get student data if we're on a student page
  const studentData = useStudentData(studentId || '');

  // Update current student context when navigating to student pages
  useEffect(() => {
    if (studentId && studentData?.student) {
      setCurrentStudent({
        id: studentId,
        firstName: studentData.student.firstName,
        lastName: studentData.student.lastName,
      });
    } else if (!studentId) {
      setCurrentStudent(null);
    }
  }, [studentId, studentData?.student, setCurrentStudent]);

  // Build student context for suggestions
  const studentContext: StudentContext | undefined = studentData && isContextEnabled ? {
    firstName: studentData.student.firstName,
    lastName: studentData.student.lastName,
    grade: studentData.student.grade,
    careerVision: studentData.profile.careerVision,
    milestones: studentData.milestones,
    smartGoals: studentData.smartGoals,
    bookmarks: studentData.bookmarks,
    profile: studentData.profile,
  } : undefined;

  const contextSuggestions = generateContextAwareSuggestions(studentContext);
  const displayName = isContextEnabled && currentStudent ? currentStudent.firstName : '';

  const handleSend = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
  };

  const handleReset = () => {
    console.log('Reset chat');
  };

  const handleHistory = () => {
    console.log('View history');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button - shown when collapsed */}
      {!isExpanded && (
        <Box
          onClick={toggleExpanded}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#12B76A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(18, 183, 106, 0.4)',
            transition: 'all 0.2s ease',
            zIndex: 1100,
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(18, 183, 106, 0.5)',
            },
          }}
        >
          <Sparkles size={24} color="#fff" />
        </Box>
      )}

      {/* Expanded Chat Panel */}
      <Slide direction="up" in={isExpanded} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            height: 'calc(100vh - 48px)',
            maxHeight: 600,
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1100,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              borderBottom: '1px solid #E5E7EB',
              backgroundColor: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#12B76A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="#fff" />
              </Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                Alma AI Coach
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={handleReset}
                sx={{
                  color: '#6B7280',
                  fontSize: '13px',
                  gap: 0.5,
                  borderRadius: '6px',
                  '&:hover': { backgroundColor: '#F3F4F6' },
                }}
              >
                <RotateCcw size={14} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleHistory}
                sx={{
                  color: '#6B7280',
                  fontSize: '13px',
                  gap: 0.5,
                  borderRadius: '6px',
                  '&:hover': { backgroundColor: '#F3F4F6' },
                }}
              >
                <History size={14} />
              </IconButton>
              <IconButton
                size="small"
                onClick={toggleExpanded}
                sx={{
                  color: '#6B7280',
                  '&:hover': { backgroundColor: '#F3F4F6' },
                }}
              >
                <X size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: 1.5,
              }}
            >
              {displayName
                ? `Hey Sarah, how can I help you support ${displayName} today?`
                : 'Hey Sarah, how can I help you today?'}
            </Typography>
          </Box>

          {/* Suggestions & Input */}
          <Box
            sx={{
              borderTop: '1px solid #E5E7EB',
              px: 2,
              py: 2,
            }}
          >
            {/* Suggestions */}
            <Box sx={{ mb: 2 }}>
              {contextSuggestions.initial.map((suggestion) => (
                <Box
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    py: 0.75,
                    cursor: 'pointer',
                    '&:hover': {
                      '& .suggestion-text': {
                        color: '#062F29',
                      },
                    },
                  }}
                >
                  <Sparkles size={16} color="#12B76A" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography
                    className="suggestion-text"
                    sx={{
                      fontSize: '13px',
                      color: '#374151',
                      lineHeight: 1.4,
                    }}
                  >
                    {suggestion}
                  </Typography>
                </Box>
              ))}

              {showMoreSuggestions &&
                contextSuggestions.more.map((suggestion) => (
                  <Box
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      py: 0.75,
                      cursor: 'pointer',
                      '&:hover': {
                        '& .suggestion-text': {
                          color: '#062F29',
                        },
                      },
                    }}
                  >
                    <Sparkles size={16} color="#12B76A" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Typography
                      className="suggestion-text"
                      sx={{
                        fontSize: '13px',
                        color: '#374151',
                        lineHeight: 1.4,
                      }}
                    >
                      {suggestion}
                    </Typography>
                  </Box>
                ))}

              {contextSuggestions.more.length > 0 && (
                <Box
                  onClick={() => setShowMoreSuggestions(!showMoreSuggestions)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    pt: 0.5,
                    cursor: 'pointer',
                    color: '#6B7280',
                    '&:hover': { color: '#374151' },
                  }}
                >
                  {showMoreSuggestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <Typography sx={{ fontSize: '13px' }}>
                    {showMoreSuggestions ? 'Less suggestions' : 'More suggestions'}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Input */}
            <TextField
              fullWidth
              placeholder="Message Alma..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  backgroundColor: '#F9FAFB',
                  fontSize: '14px',
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
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: '#9CA3AF' }}>
                        <Info size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleSend}
                        sx={{
                          backgroundColor: '#062F29',
                          color: '#fff',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: '#2B4C46',
                          },
                        }}
                      >
                        <Send size={14} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Context Toggle Footer - only show when on a student page */}
          {currentStudent && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderTop: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  label={`${currentStudent.firstName} ${currentStudent.lastName}`}
                  size="small"
                  sx={{
                    backgroundColor: isContextEnabled ? '#DCFCE7' : '#F3F4F6',
                    color: isContextEnabled ? '#166534' : '#6B7280',
                    fontWeight: 500,
                    fontSize: '13px',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
                <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                  {isContextEnabled ? 'Context on' : 'Context off'}
                </Typography>
              </Box>
              <Switch
                checked={isContextEnabled}
                onChange={(e) => setIsContextEnabled(e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#22C55E',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#22C55E',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Slide>
    </>
  );
}

export default FloatingAlmaChat;
