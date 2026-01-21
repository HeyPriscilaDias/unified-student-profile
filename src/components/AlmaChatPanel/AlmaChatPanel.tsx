'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material';
import { ChevronDown, ChevronUp, Send, X, Maximize2, Minimize2, Plus } from 'lucide-react';
import { Alma } from '@/components/icons/AlmaIcon';
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

interface AlmaChatPanelProps {
  studentFirstName: string;
  studentContext?: StudentContext;
  studentId?: string;
  isFloating?: boolean;
  isExpanded?: boolean;
  showStudentContext?: boolean;
  onClose?: () => void;
  onToggleExpand?: () => void;
  onDismissContext?: () => void;
  onAddContext?: () => void;
}

function generateContextAwareSuggestions(studentFirstName?: string, context?: StudentContext): { initial: string[]; more: string[] } {
  // No student context - show general suggestions
  if (!studentFirstName && !context) {
    return {
      initial: [
        'How to choose the best college for a student?',
        'What are the key milestones for college readiness?',
      ],
      more: [
        'How do I help students with financial aid applications?',
        'What resources are available for first-generation students?',
        'Tips for writing effective recommendation letters',
      ],
    };
  }

  // Student context but no detailed data - show student-specific general suggestions
  if (studentFirstName && !context) {
    return {
      initial: [
        `What colleges might be a good fit for ${studentFirstName}?`,
        `How can I help ${studentFirstName} explore career options?`,
      ],
      more: [
        `What are ${studentFirstName}'s upcoming deadlines?`,
        `How to support ${studentFirstName}'s college applications?`,
        `What scholarships might ${studentFirstName} qualify for?`,
      ],
    };
  }

  // Full context available - generate detailed suggestions
  const suggestions: string[] = [];
  const { firstName, grade, careerVision, milestones, smartGoals, bookmarks, profile } = context!;
  const name = studentFirstName || firstName;

  // Get career interests from bookmarks
  const careerBookmarks = bookmarks.filter(b => b.type === 'career' && b.isBookmarked);
  const schoolBookmarks = bookmarks.filter(b => b.type === 'school' && b.isBookmarked);

  // Get in-progress milestones
  const pendingMilestones = milestones.filter(m => m.status === 'not_done');

  // Get active goals
  const activeGoals = smartGoals.filter(g => g.status === 'active');

  // Career-specific suggestions
  if (careerBookmarks.length > 0) {
    const topCareer = careerBookmarks[0];
    suggestions.push(`What are the best pathways to become a ${topCareer.title}?`);
    if (topCareer.tags?.includes('Healthcare')) {
      suggestions.push(`What clinical experiences would help ${name}'s healthcare career goals?`);
    }
  }

  // School-specific suggestions
  if (schoolBookmarks.length > 0) {
    const topSchool = schoolBookmarks[0];
    suggestions.push(`How can ${name} strengthen their ${topSchool.title} application?`);
  }

  // Milestone-based suggestions
  if (pendingMilestones.length > 0) {
    const urgentMilestone = pendingMilestones[0];
    if (urgentMilestone.title.toLowerCase().includes('fafsa')) {
      suggestions.push(`What documents does ${name} need for FAFSA completion?`);
    } else if (urgentMilestone.title.toLowerCase().includes('college')) {
      suggestions.push(`What are the key deadlines ${name} should track?`);
    } else if (urgentMilestone.title.toLowerCase().includes('shadow')) {
      suggestions.push(`How can ${name} find job shadowing opportunities?`);
    }
  }

  // Goal-based suggestions
  if (activeGoals.length > 0) {
    const topGoal = activeGoals[0];
    if (topGoal.title.toLowerCase().includes('application')) {
      suggestions.push(`Tips for completing ${name}'s remaining college applications?`);
    } else if (topGoal.title.toLowerCase().includes('sat') || topGoal.title.toLowerCase().includes('score')) {
      suggestions.push(`What study strategies could help ${name} improve test scores?`);
    }
  }

  // Grade-level suggestions
  if (grade === 12) {
    suggestions.push(`What should ${name} know about senior year financial aid?`);
    suggestions.push(`How to prepare for college transition?`);
  } else if (grade === 11) {
    suggestions.push(`What can ${name} do this year to prepare for college applications?`);
  }

  // Career vision suggestions
  if (careerVision && careerVision.toLowerCase().includes('nurs')) {
    suggestions.push(`What nursing programs align with ${name}'s goals?`);
  }

  // Profile-based suggestions
  if (profile?.experiences?.some(exp => exp.type === 'volunteer')) {
    suggestions.push(`How can ${name}'s volunteer experience strengthen applications?`);
  }

  // Deduplicate and split into initial and more
  const uniqueSuggestions = [...new Set(suggestions)];

  // If we don't have enough suggestions, add some defaults
  if (uniqueSuggestions.length < 2) {
    uniqueSuggestions.push(`What colleges might be a good fit for ${name}?`);
    uniqueSuggestions.push(`How can I help ${name} with their applications?`);
  }

  return {
    initial: uniqueSuggestions.slice(0, 2),
    more: uniqueSuggestions.slice(2, 5),
  };
}

export function AlmaChatPanel({
  studentFirstName,
  studentContext,
  isFloating = false,
  isExpanded = false,
  showStudentContext = false,
  onClose,
  onToggleExpand,
  onDismissContext,
  onAddContext
}: AlmaChatPanelProps) {
  // Determine if we can show add context option (student exists but context is dismissed)
  const canAddContext = Boolean(onAddContext) && !showStudentContext && Boolean(studentFirstName);
  const [message, setMessage] = useState('');
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);

  // Only use student name for suggestions/welcome when context is active
  const activeStudentName = showStudentContext ? studentFirstName : '';

  // Generate context-aware suggestions based on student data (only when context is shown)
  const contextSuggestions = generateContextAwareSuggestions(activeStudentName, showStudentContext ? studentContext : undefined);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
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
          <Alma size={18} color="#fff" />
        </Box>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#111827',
          }}
        >
          Ask Alma
        </Typography>

        {/* Student Context Tag */}
        {showStudentContext && studentFirstName && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              backgroundColor: '#F3F4F6',
              borderRadius: '20px',
              pl: 1.5,
              pr: 0.75,
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#4B5563',
              }}
            >
              about {studentFirstName}
            </Typography>
            {onDismissContext && (
              <IconButton
                size="small"
                onClick={onDismissContext}
                sx={{
                  p: 0.25,
                  color: '#6B7280',
                  '&:hover': {
                    backgroundColor: '#E5E7EB',
                  },
                }}
              >
                <X size={14} />
              </IconButton>
            )}
          </Box>
        )}

        {/* Add Student Context Tag */}
        {canAddContext && (
          <Box
            onClick={onAddContext}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: '#F3F4F6',
              borderRadius: '20px',
              px: 1.5,
              py: 0.5,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#E5E7EB',
              },
            }}
          >
            <Plus size={14} color="#6B7280" />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#4B5563',
              }}
            >
              add student context
            </Typography>
          </Box>
        )}

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Expand/Collapse Button */}
        {isFloating && onToggleExpand && (
          <IconButton
            size="small"
            onClick={onToggleExpand}
            sx={{
              color: '#6B7280',
              '&:hover': { backgroundColor: '#F3F4F6' },
            }}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </IconButton>
        )}

        {/* Close Button */}
        {isFloating && onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: '#6B7280',
              '&:hover': { backgroundColor: '#F3F4F6' },
            }}
          >
            <X size={18} />
          </IconButton>
        )}
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
        {/* Welcome Message */}
        <Typography
          sx={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: 1.5,
          }}
        >
          {activeStudentName
            ? `Hey Sarah, how can I help you support ${activeStudentName} today?`
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
              <Alma size={16} color="#12B76A" style={{ marginTop: 2, flexShrink: 0 }} />
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
                <Alma size={16} color="#12B76A" style={{ marginTop: 2, flexShrink: 0 }} />
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

          {/* More suggestions toggle - only show if there are more suggestions */}
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
    </Box>
  );
}

export default AlmaChatPanel;
