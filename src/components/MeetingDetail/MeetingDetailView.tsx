'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowLeft, Edit, Trash2, Mic } from 'lucide-react';
import { MeetingIntelligence } from '@/components/MeetingIntelligence';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSection, SectionCard } from '@/components/shared';
import { useStudentData } from '@/hooks/useStudentData';
import { useMeetings, useMeetingsContext } from '@/contexts/MeetingsContext';
import { MeetingHeader } from './MeetingHeader';
import { NotesSection } from './NotesSection';
import { SummarySection } from './SummarySection';
import { TranscriptSection } from './TranscriptSection';
import { RecommendedActionsSection } from './RecommendedActionsSection';

interface MeetingDetailViewProps {
  studentId: string;
  meetingId: string;
}

export function MeetingDetailView({ studentId, meetingId }: MeetingDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentData = useStudentData(studentId);
  const startMeetingParam = searchParams.get('startMeeting') === 'true';
  const [isInMeetingMode, setIsInMeetingMode] = useState(startMeetingParam);
  const { updateMeetingNotes, completeMeeting } = useMeetingsContext();

  // Clean up the URL after reading the param
  useEffect(() => {
    if (startMeetingParam) {
      router.replace(`/students/${studentId}/meetings/${meetingId}`, { scroll: false });
    }
  }, [startMeetingParam, router, studentId, meetingId]);

  // Use meetings from context (allows real-time updates)
  const meetings = useMeetings(studentId, studentData?.meetings || []);

  const meeting = useMemo(() => {
    return meetings.find((m) => m.id === meetingId) || null;
  }, [meetings, meetingId]);

  const handleNotesChange = useCallback((notes: string) => {
    updateMeetingNotes(studentId, meetingId, notes);
  }, [studentId, meetingId, updateMeetingNotes]);

  const handleMeetingCompleted = useCallback((notes: string) => {
    completeMeeting(studentId, meetingId, notes);
    setIsInMeetingMode(false);
  }, [studentId, meetingId, completeMeeting]);

  const handleStartMeeting = useCallback(() => {
    setIsInMeetingMode(true);
  }, []);

  const handleCancelMeeting = useCallback(() => {
    setIsInMeetingMode(false);
  }, []);

  const handleBack = () => {
    router.push(`/students/${studentId}?tab=meetings`);
  };

  const handleEdit = () => {
    console.log('Edit meeting clicked');
    // TODO: Enable edit mode
  };

  const handleDelete = () => {
    console.log('Delete meeting clicked');
    // TODO: Show confirmation dialog
  };

  const handleAddToTasks = (actionId: string) => {
    console.log('Add to tasks:', actionId);
    // TODO: Convert action to task
  };

  const handleDismissAction = (actionId: string) => {
    console.log('Dismiss action:', actionId);
    // TODO: Dismiss action
  };

  // Loading state
  if (!studentData) {
    return (
      <AppLayout>
        <Box sx={{ backgroundColor: '#FBFBFB', minHeight: '100vh', p: 3 }}>
          <LoadingSection variant="card" />
        </Box>
      </AppLayout>
    );
  }

  // Meeting not found
  if (!meeting) {
    return (
      <AppLayout>
        <Box sx={{ backgroundColor: '#FBFBFB', minHeight: '100vh', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={handleBack}
            sx={{ mb: 3, textTransform: 'none' }}
          >
            Back to {studentData.student.firstName} {studentData.student.lastName}
          </Button>
          <Typography variant="h6" color="error">
            Meeting not found
          </Typography>
        </Box>
      </AppLayout>
    );
  }

  const isUpcoming = meeting.status === 'scheduled';
  const isCompleted = meeting.status === 'completed';

  return (
    <AppLayout currentStudentId={studentId}>
      <Box sx={{ backgroundColor: '#FBFBFB', minHeight: '100vh' }}>
        {/* Top Bar */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid #E5E7EB',
            px: 4,
            py: 2,
          }}
        >
          <Box className="flex items-center justify-between">
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={handleBack}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Back to {studentData.student.firstName} {studentData.student.lastName}
            </Button>

            <Box className="flex items-center gap-2">
              {isUpcoming && !isInMeetingMode && (
                <Button
                  variant="contained"
                  startIcon={<Mic size={16} />}
                  onClick={handleStartMeeting}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#062F29',
                    '&:hover': {
                      backgroundColor: '#2B4C46',
                    },
                  }}
                >
                  Start Meeting
                </Button>
              )}
              {!isInMeetingMode && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Edit size={16} />}
                    onClick={handleEdit}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <IconButton onClick={handleDelete} size="small" className="text-neutral-500">
                    <Trash2 size={18} />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
          {/* Meeting Header */}
          <MeetingHeader meeting={meeting} />

          {/* Meeting Intelligence - shown inline when in meeting mode */}
          {isInMeetingMode && (
            <Box sx={{ mt: 4 }}>
              <SectionCard title="Meeting Notes" icon={<Mic size={18} className="text-green-600" />}>
                <MeetingIntelligence
                  studentName={`${studentData.student.firstName} ${studentData.student.lastName}`}
                  onClose={handleCancelMeeting}
                  onMeetingCompleted={handleMeetingCompleted}
                  autoStart
                />
              </SectionCard>
            </Box>
          )}

          {/* Notes - show when not in meeting mode */}
          {!isInMeetingMode && (
            <Box sx={{ mt: 4 }}>
              <NotesSection
                notes={meeting.notes}
                onNotesChange={handleNotesChange}
              />
            </Box>
          )}

          {/* AI Summary (completed meetings only) */}
          {isCompleted && meeting.summary && (
            <Box sx={{ mt: 4 }}>
              <SummarySection
                summary={meeting.summary}
                onRegenerate={() => console.log('Regenerate summary')}
              />
            </Box>
          )}

          {/* Recommended Actions (completed meetings with actions) */}
          {isCompleted && meeting.summary?.recommendedActions && meeting.summary.recommendedActions.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <RecommendedActionsSection
                actions={meeting.summary.recommendedActions}
                onAddToTasks={handleAddToTasks}
                onDismiss={handleDismissAction}
              />
            </Box>
          )}

          {/* Transcript (completed meetings only) */}
          {isCompleted && meeting.transcript && (
            <Box sx={{ mt: 4 }}>
              <TranscriptSection transcript={meeting.transcript} />
            </Box>
          )}
        </Box>
      </Box>
    </AppLayout>
  );
}

export default MeetingDetailView;
