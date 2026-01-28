'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { Mic, Square, ExternalLink, Clock } from 'lucide-react';

interface ActiveMeetingPanelProps {
  activeMeeting: {
    studentId: string;
    studentName: string;
    interactionId: string;
    interactionTitle: string;
    phase: 'recording' | 'processing' | 'results';
    startTime: number;
    talkingPoints?: string;
  };
  onStopRecording: () => void;
  onViewMeeting: () => void;
}

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function ActiveMeetingPanel({
  activeMeeting,
  onStopRecording,
  onViewMeeting,
}: ActiveMeetingPanelProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => {
      setElapsed(Math.floor((Date.now() - activeMeeting.startTime) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeMeeting.startTime]);

  // ---------- Recording phase ----------
  if (activeMeeting.phase === 'recording') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header: recording indicator + timer */}
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              flexShrink: 0,
              animation: 'pulse-recording 1.5s ease-in-out infinite',
              '@keyframes pulse-recording': {
                '0%': { opacity: 1, boxShadow: '0 0 0 0 rgba(239,68,68,0.5)' },
                '50%': { opacity: 0.6, boxShadow: '0 0 0 6px rgba(239,68,68,0)' },
                '100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
              },
            }}
          />
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: '18px',
              fontWeight: 600,
              color: '#EF4444',
              lineHeight: 1,
            }}
          >
            {formatElapsed(elapsed)}
          </Typography>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#6B7280',
              ml: 'auto',
            }}
          >
            Recording
          </Typography>
          <Mic size={16} color="#EF4444" />
        </Box>

        {/* Student / meeting info */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#062F29',
              mb: 0.25,
            }}
          >
            {activeMeeting.studentName}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
            {activeMeeting.interactionTitle}
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            gap: 1,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Button
            variant="contained"
            startIcon={<Square size={14} />}
            onClick={onStopRecording}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              py: 1,
              '&:hover': {
                backgroundColor: '#DC2626',
              },
            }}
          >
            Stop Recording
          </Button>
          <IconButton
            onClick={onViewMeeting}
            sx={{
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#062F29',
              '&:hover': {
                backgroundColor: '#F9FAFB',
                borderColor: '#D1D5DB',
              },
            }}
          >
            <ExternalLink size={18} />
          </IconButton>
        </Box>

        {/* Talking points */}
        {activeMeeting.talkingPoints ? (
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                px: 2,
                pt: 1.5,
                pb: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Talking Points
              </Typography>
            </Box>
            <Box
              sx={{
                px: 2,
                pb: 2,
                flex: 1,
                overflowY: 'auto',
                '& h3': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#062F29',
                  margin: '12px 0 6px 0',
                  '&:first-of-type': {
                    marginTop: '4px',
                  },
                },
                '& ul': {
                  margin: '4px 0',
                  paddingLeft: '20px',
                },
                '& li': {
                  fontSize: '13px',
                  color: '#374151',
                  lineHeight: 1.6,
                  mb: 0.5,
                },
                '& p': {
                  fontSize: '13px',
                  color: '#374151',
                  lineHeight: 1.6,
                  margin: '4px 0',
                },
                '& strong': {
                  fontWeight: 600,
                  color: '#062F29',
                },
              }}
              dangerouslySetInnerHTML={{ __html: activeMeeting.talkingPoints }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                px: 2,
                backgroundColor: '#F9FAFB',
                borderRadius: 2,
                width: '100%',
              }}
            >
              <Mic size={24} color="#9CA3AF" style={{ marginBottom: 8 }} />
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  mb: 0.5,
                }}
              >
                Meeting in progress
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                No talking points available for this meeting.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  // ---------- Processing phase ----------
  if (activeMeeting.phase === 'processing') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Clock size={16} color="#6B7280" />
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#062F29',
            }}
          >
            Processing Meeting
          </Typography>
        </Box>

        {/* Student / meeting info */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#062F29',
              mb: 0.25,
            }}
          >
            {activeMeeting.studentName}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
            {activeMeeting.interactionTitle}
          </Typography>
        </Box>

        {/* Processing spinner */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              px: 2,
              backgroundColor: '#F9FAFB',
              borderRadius: 2,
              width: '100%',
            }}
          >
            <CircularProgress
              size={32}
              sx={{ color: '#062F29', mb: 2 }}
            />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                mb: 0.5,
              }}
            >
              Processing meeting...
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
              Generating summary and action items.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // ---------- Results phase ----------
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 2,
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#22C55E',
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#062F29',
          }}
        >
          Meeting Completed
        </Typography>
      </Box>

      {/* Student / meeting info */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#062F29',
            mb: 0.25,
          }}
        >
          {activeMeeting.studentName}
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
          {activeMeeting.interactionTitle}
        </Typography>
      </Box>

      {/* View Summary button */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
            backgroundColor: '#F9FAFB',
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              mb: 2,
            }}
          >
            The meeting summary is ready.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ExternalLink size={16} />}
            onClick={onViewMeeting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: '#062F29',
              color: '#fff',
              borderRadius: '8px',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#0A4A40',
              },
            }}
          >
            View Summary
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ActiveMeetingPanel;
