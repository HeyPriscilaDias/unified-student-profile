'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Modal,
  Snackbar,
  Alert,
  Collapse,
} from '@mui/material';
import { SimpleTextEditor } from '@/components/shared/SimpleTextEditor';
import {
  Mic,
  Square,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ExtractedActionItem } from '@/lib/geminiService';
import { ActionItemsPanel } from './ActionItemsPanel';

interface InteractionIntelligenceProps {
  studentName?: string;
  onClose?: () => void;
  autoStart?: boolean;
  onInteractionCompleted?: (data: {
    summary: string;
    transcript: string;
    actionItems: ExtractedActionItem[];
  }) => void;
  onAddCounselorTask?: (title: string) => void;
  onAddStudentTask?: (title: string) => void;
}

// Mock data for the FAFSA meeting
const MOCK_SUMMARY = `<h3>Meeting Overview</h3>
<ul>
<li>Discussed the <strong>FAFSA application process</strong> and financial aid options for the upcoming academic year</li>
<li>Reviewed <strong>key deadlines</strong> including the <strong>March 2nd</strong> state priority deadline</li>
<li>Assessed family financial situation to determine eligibility for various aid programs</li>
</ul>

<h3>Key Discussion Points</h3>
<ul>
<li><strong>FSA ID creation</strong> - Both student and one parent need to create accounts at studentaid.gov</li>
<li><strong>Required documents</strong> - 2024 tax returns, W-2 forms, and records of untaxed income</li>
<li><strong>Housing plans</strong> - Student plans to live in dorms, affecting cost of attendance calculation</li>
<li><strong>Dependency status</strong> - Filing as dependent student (parents' income will be considered)</li>
</ul>

<h3>Student Interests</h3>
<ul>
<li>Expressed interest in <strong>federal work-study</strong> as preferred employment option</li>
<li>Interested in receiving list of <strong>local scholarship opportunities</strong></li>
</ul>`;

const MOCK_ACTION_ITEMS: ExtractedActionItem[] = [
  { id: 'action-1', text: 'Send list of scholarship opportunities to student', assignee: 'counselor', status: 'pending' },
  { id: 'action-2', text: 'Schedule parent meeting to review dependency status', assignee: 'counselor', status: 'pending' },
  { id: 'action-3', text: 'Create FSA ID at studentaid.gov', assignee: 'student', status: 'pending' },
  { id: 'action-4', text: 'Gather 2024 tax returns and W-2 forms from parents', assignee: 'student', status: 'pending' },
];

const MOCK_TRANSCRIPT = `Counselor: Good morning! Thanks for coming in today. I wanted to go over the FAFSA process with you since the application window is now open.

Student: Hi! Yes, I've been meaning to ask about this. My parents keep asking me when we need to fill it out.

Counselor: Great question. The FAFSA opened on December 31st, and I always recommend completing it as early as possible. Many states have priority deadlines, and some aid is distributed on a first-come, first-served basis.

Student: Oh, I didn't know that. What's our state's deadline?

Counselor: For us, the priority deadline is March 2nd. If you submit before then, you'll have the best chance at state grants and institutional aid. Have you or your parents created an FSA ID yet?

Student: No, what's that?

Counselor: The FSA ID is your electronic signature for the FAFSA. Both you and one parent will need one. You create it at studentaid.gov. I'd suggest doing that this week since it can take a few days to process.

Student: Okay, I'll do that tonight. What documents do we need?

Counselor: Good thinking ahead! You'll need your Social Security number, your parents' 2024 tax returns, W-2 forms, and records of any untaxed income. The IRS Data Retrieval Tool can help import the tax info directly.

Student: My parents file jointly, so we just need their one return?

Counselor: Exactly. Since they file jointly, you'll just need that single return. Now, let me ask—will you be living at home next year or on campus?

Student: I'm hoping to live in the dorms.

Counselor: Perfect. That affects your cost of attendance calculation. Also, based on our earlier conversation about your family situation, you'll be filing as a dependent student, which means your parents' income will be considered.

Student: Right, that makes sense. Is there anything else we should know about?

Counselor: One thing I always mention—consider federal work-study if it's offered. It's a great way to earn money for expenses without it affecting your future financial aid. Also, I'll send you a list of local scholarships you might qualify for.

Student: That would be really helpful. When should we have everything done by?

Counselor: Let's aim to have your FSA IDs created by this weekend, gather documents next week, and submit the FAFSA by February 15th. That gives us buffer time before the March 2nd deadline. How about we schedule a follow-up meeting for March 15th to review your Student Aid Report?

Student: That sounds great. Thank you so much for explaining all of this!

Counselor: Of course! I'll send a meeting recap to your email with all the action items. Don't hesitate to reach out if you have questions while filling out the application.`;

// Transcript types and parser
interface TranscriptMessage {
  speaker: 'counselor' | 'student';
  text: string;
}

const parseTranscript = (transcript: string): TranscriptMessage[] => {
  const lines = transcript.split('\n\n');
  return lines
    .map((line) => {
      if (line.startsWith('Counselor:')) {
        return { speaker: 'counselor' as const, text: line.replace('Counselor: ', '') };
      } else if (line.startsWith('Student:')) {
        return { speaker: 'student' as const, text: line.replace('Student: ', '') };
      }
      return null;
    })
    .filter((msg): msg is TranscriptMessage => msg !== null);
};

// Chat Bubble Component with accessible contrast
const ChatBubble: React.FC<{ message: TranscriptMessage }> = ({ message }) => {
  const isCounselor = message.speaker === 'counselor';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isCounselor ? 'flex-start' : 'flex-end',
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          maxWidth: '85%',
          px: 2,
          py: 1.5,
          borderRadius: isCounselor ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
          backgroundColor: isCounselor ? '#E5E7EB' : '#062F29',
          color: isCounselor ? '#1F2937' : '#FFFFFF',
        }}
      >
        <Typography
          sx={{
            fontSize: '10px',
            fontWeight: 700,
            mb: 0.5,
            color: isCounselor ? '#374151' : 'rgba(255,255,255,0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {isCounselor ? 'Counselor' : 'Student'}
        </Typography>
        <Typography sx={{ fontSize: '13px', lineHeight: 1.5 }}>
          {message.text}
        </Typography>
      </Box>
    </Box>
  );
};

// Audio Visualization Component
const AudioVisualizer: React.FC<{ analyser: AnalyserNode | null; isRecording: boolean }> = ({
  analyser,
  isRecording,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !isRecording || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = 3;
      const gap = 2;
      const bars = Math.floor(canvas.width / (barWidth + gap));
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        const dataIndex = Math.floor((i / bars) * bufferLength);
        const value = dataArray[dataIndex];
        const barHeight = (value / 255) * (canvas.height / 2 - 4);

        ctx.fillStyle = '#EF4444';
        ctx.fillRect(
          i * (barWidth + gap),
          centerY - barHeight,
          barWidth,
          barHeight * 2
        );
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={32}
      className="rounded"
      style={{ backgroundColor: '#FAFAFA' }}
    />
  );
};

// Shimmer Loading Component
const ShimmerLoader: React.FC = () => (
  <div className="space-y-4 w-full">
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 shimmer" />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full shimmer" />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6 shimmer" />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/6 shimmer" />
    </div>
    <div className="animate-pulse space-y-2 pt-4">
      <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/3 shimmer" />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/5 shimmer" />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 shimmer" />
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6 shimmer" />
    </div>
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      .shimmer {
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// Main Component
const InteractionIntelligence: React.FC<InteractionIntelligenceProps> = ({
  studentName = 'Student',
  onClose,
  autoStart = false,
  onInteractionCompleted,
  onAddCounselorTask,
  onAddStudentTask,
}) => {
  // State
  const [phase, setPhase] = useState<'idle' | 'recording' | 'processing' | 'results'>('idle');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [transcript, setTranscript] = useState('');
  const [actionItems, setActionItems] = useState<ExtractedActionItem[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current date formatted
  const getCurrentDate = (): string => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Show toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setPhase('recording');
      setRecordingTime(0);
      showToast('Recording started. Microphone active.');

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording and process with mock data
  const stopRecording = useCallback(() => {
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Transition to processing
    setPhase('processing');

    // Simulate AI processing with mock data
    setTimeout(() => {
      setMeetingNotes(MOCK_SUMMARY);
      setTranscript(MOCK_TRANSCRIPT);
      setActionItems(MOCK_ACTION_ITEMS.map(item => ({ ...item, status: 'pending' as const })));
      setPhase('results');

      // Notify parent
      onInteractionCompleted?.({
        summary: MOCK_SUMMARY,
        transcript: MOCK_TRANSCRIPT,
        actionItems: MOCK_ACTION_ITEMS,
      });
    }, 1500);
  }, [onInteractionCompleted]);

  // Reset to initial state
  const resetIntelligence = () => {
    setPhase('idle');
    setRecordingTime(0);
    setMeetingNotes('');
    setTranscript('');
    setActionItems([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Auto-start recording when autoStart prop is true
  useEffect(() => {
    if (autoStart && phase === 'idle') {
      startRecording();
    }
  }, [autoStart]);

  // Handle counselor task creation
  const handleAddCounselorTask = useCallback((text: string) => {
    onAddCounselorTask?.(text);
  }, [onAddCounselorTask]);

  // Handle student task creation (mock)
  const handleAddStudentTask = useCallback((text: string) => {
    onAddStudentTask?.(text);
  }, [onAddStudentTask]);

  // Content renderer
  const renderContent = () => {
    switch (phase) {
      case 'idle':
        return (
          <Box className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Box
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              sx={{ backgroundColor: '#F0FDF4' }}
            >
              <Mic size={40} color="#22C55E" />
            </Box>
            <Typography
              sx={{ fontSize: '18px', fontWeight: 600, color: '#111827', mb: 1 }}
            >
              Record Meeting
            </Typography>
            <Typography
              sx={{ fontSize: '14px', color: '#6B7280', mb: 4, maxWidth: '280px' }}
            >
              Record your meeting to automatically generate a summary, action items, and transcript.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Mic size={18} />}
              onClick={startRecording}
              sx={{
                backgroundColor: '#062F29',
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 4,
                py: 1.5,
                borderRadius: '24px',
                '&:hover': {
                  backgroundColor: '#2B4C46',
                },
              }}
            >
              Start Recording
            </Button>
          </Box>
        );

      case 'recording':
        return (
          <Box className="flex flex-col items-center justify-center py-12 px-4">
            {/* Pulsing red indicator */}
            <Box className="relative mb-6">
              <Box
                className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
                sx={{ backgroundColor: '#FEE2E2' }}
              >
                <Box
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  sx={{ backgroundColor: '#EF4444' }}
                >
                  <Mic size={24} color="white" />
                </Box>
              </Box>
              <Box
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
                sx={{ backgroundColor: '#EF4444' }}
              />
            </Box>

            {/* Recording status */}
            <Box className="flex items-center gap-2 mb-4">
              <Box
                className="w-2 h-2 rounded-full animate-pulse"
                sx={{ backgroundColor: '#EF4444' }}
              />
              <Typography
                sx={{ fontSize: '14px', fontWeight: 500, color: '#EF4444' }}
              >
                Recording
              </Typography>
            </Box>

            {/* Timer */}
            <Typography
              sx={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#111827',
                fontFamily: 'monospace',
                mb: 4,
              }}
            >
              {formatTime(recordingTime)}
            </Typography>

            {/* Audio visualization */}
            <Box className="mb-6">
              <AudioVisualizer
                analyser={analyserRef.current}
                isRecording={phase === 'recording'}
              />
            </Box>

            {/* Stop button */}
            <Button
              variant="contained"
              startIcon={<Square size={18} />}
              onClick={stopRecording}
              sx={{
                backgroundColor: '#EF4444',
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 4,
                py: 1.5,
                borderRadius: '24px',
                '&:hover': {
                  backgroundColor: '#DC2626',
                },
              }}
            >
              Stop & Generate Summary
            </Button>
          </Box>
        );

      case 'processing':
        return (
          <Box className="flex flex-col items-center justify-center py-16 px-6">
            {/* Animated processing icon */}
            <Box className="relative mb-6">
              <Box
                className="w-16 h-16 rounded-full flex items-center justify-center"
                sx={{ backgroundColor: '#E9EFEE' }}
              >
                <Box
                  className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                  sx={{ borderColor: '#062F29', borderTopColor: 'transparent', borderWidth: '3px' }}
                />
              </Box>
            </Box>

            <Typography
              sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', mb: 2 }}
            >
              Processing your meeting...
            </Typography>

            <Typography
              sx={{ fontSize: '13px', color: '#6B7280', mb: 6, textAlign: 'center' }}
            >
              Analyzing conversation and extracting key insights
            </Typography>

            {/* Shimmer loading skeleton */}
            <Box className="w-full max-w-sm">
              <ShimmerLoader />
            </Box>
          </Box>
        );

      case 'results':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header with meeting info */}
            <Box sx={{ px: 2, pt: 2, pb: 1.5, flexShrink: 0 }}>
              <Typography
                sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', mb: 0.25 }}
              >
                Meeting Summary - {getCurrentDate()}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                Meeting with {studentName}
              </Typography>
            </Box>

            {/* Scrollable content area */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Editable summary */}
              <SimpleTextEditor
                value={meetingNotes}
                onChange={setMeetingNotes}
                minRows={6}
              />

              {/* Action Items Panel */}
              {actionItems.length > 0 && (
                <ActionItemsPanel
                  actionItems={actionItems}
                  onActionItemsChange={setActionItems}
                  onAddCounselorTask={handleAddCounselorTask}
                  onAddStudentTask={handleAddStudentTask}
                />
              )}

              {/* Transcript Toggle */}
              {transcript && (
                <Box>
                  <Button
                    fullWidth
                    onClick={() => setShowTranscript(!showTranscript)}
                    endIcon={showTranscript ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    sx={{
                      justifyContent: 'space-between',
                      textTransform: 'none',
                      color: '#374151',
                      fontWeight: 600,
                      fontSize: '13px',
                      py: 1.5,
                      px: 2,
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      '&:hover': {
                        backgroundColor: '#F3F4F6',
                      },
                    }}
                  >
                    View Full Transcript
                  </Button>

                  <Collapse in={showTranscript}>
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FAFAFA',
                        maxHeight: '400px',
                        overflow: 'auto',
                      }}
                    >
                      {parseTranscript(transcript).map((message, index) => (
                        <ChatBubble key={index} message={message} />
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  // Main container - either in drawer or full-screen modal
  const mainContent = (
    <Box
      className="flex flex-col"
      sx={{
        backgroundColor: 'white',
        height: isFullScreen ? '80vh' : '70vh',
        maxHeight: isFullScreen ? '80vh' : '70vh',
      }}
    >
      {/* Header */}
      <Box
        className="flex items-center justify-between px-4 py-3 border-b"
        sx={{ borderColor: '#E5E7EB' }}
      >
        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
          Meeting Recording
        </Typography>
        <Box className="flex items-center gap-1">
          <IconButton
            size="small"
            onClick={() => setIsFullScreen(!isFullScreen)}
            sx={{ color: '#6B7280' }}
          >
            {isFullScreen ? (
              <Minimize2 size={20} />
            ) : (
              <Maximize2 size={20} />
            )}
          </IconButton>
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ color: '#6B7280' }}>
              <X size={20} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>{renderContent()}</Box>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{
            width: '100%',
            '& .MuiAlert-icon': {
              color: '#22C55E',
            },
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );

  // Render in full-screen modal or inline
  if (isFullScreen) {
    return (
      <Modal
        open={true}
        onClose={() => setIsFullScreen(false)}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1400,
        }}
      >
        <Box
          className="w-full max-w-3xl mx-4 rounded-xl overflow-hidden"
          sx={{
            backgroundColor: '#FFFFFF',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            outline: 'none',
          }}
        >
          {mainContent}
        </Box>
      </Modal>
    );
  }

  return mainContent;
};

export default InteractionIntelligence;
