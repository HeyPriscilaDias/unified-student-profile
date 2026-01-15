'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Snackbar, Alert, Button, Collapse } from '@mui/material';
import { Mic, ChevronDown, ChevronUp } from 'lucide-react';
import { UpcomingMeetingsSection } from './UpcomingMeetingsSection';
import { PastMeetingsSection } from './PastMeetingsSection';
import { ScheduleMeetingModal, textToAgendaItems } from '@/components/ScheduleMeetingFlow';
import { MeetingIntelligence } from '@/components/MeetingIntelligence';
import type { ScheduledMeetingData as ModalScheduledMeetingData } from '@/components/ScheduleMeetingFlow/ScheduleMeetingModal';
import type { Meeting } from '@/types/student';
import { useMeetingsContext } from '@/contexts/MeetingsContext';

interface MeetingsTabProps {
  meetings: Meeting[];
  studentId: string;
  studentName: string;
}

export function MeetingsTab({ meetings, studentId, studentName }: MeetingsTabProps) {
  const router = useRouter();
  const { updateMeeting } = useMeetingsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Meeting scheduled successfully');
  const [showIntelligence, setShowIntelligence] = useState(false);

  const handleScheduleMeeting = () => {
    setSelectedMeeting(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleMeetingScheduled = (data: ModalScheduledMeetingData) => {
    // In a real app, this would save to the backend
    console.log('Meeting scheduled:', data);
    setIsModalOpen(false);
    setSelectedMeeting(null);
    setToastMessage('Meeting scheduled successfully');
    setShowToast(true);
  };

  const handleMeetingSaved = (data: ModalScheduledMeetingData) => {
    if (!selectedMeeting) return;

    // Convert text agenda to AgendaItem[]
    const agendaItems = textToAgendaItems(data.agenda, data.duration);

    updateMeeting({
      id: selectedMeeting.id,
      studentId: selectedMeeting.studentId,
      title: data.title,
      scheduledDate: data.scheduledDate,
      duration: data.duration,
      agenda: agendaItems,
    });

    setIsModalOpen(false);
    setSelectedMeeting(null);
    setToastMessage('Meeting updated successfully');
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  // Separate meetings by status
  const { upcomingMeetings, pastMeetings } = useMemo(() => {
    const upcoming = meetings.filter((m) => m.status === 'scheduled' || m.status === 'in_progress');
    const past = meetings.filter((m) => m.status === 'completed');
    return {
      upcomingMeetings: upcoming.sort(
        (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      ),
      pastMeetings: past.sort(
        (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
      ),
    };
  }, [meetings]);

  // Get last completed meeting
  const lastMeeting = useMemo(() => {
    if (pastMeetings.length === 0) return null;
    const mostRecent = pastMeetings[0];
    return {
      date: mostRecent.scheduledDate,
      conductedBy: mostRecent.counselorName,
    };
  }, [pastMeetings]);

  const handleMeetingClick = (meeting: Meeting) => {
    // For upcoming/scheduled meetings, open the edit modal
    if (meeting.status === 'scheduled' || meeting.status === 'in_progress') {
      setSelectedMeeting(meeting);
      setIsModalOpen(true);
    } else {
      // For past/completed meetings, navigate to detail page
      router.push(`/students/${meeting.studentId}/meetings/${meeting.id}`);
    }
  };

  return (
    <Box>
      <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Meeting Intelligence Toggle Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Mic size={18} />}
          endIcon={showIntelligence ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          onClick={() => setShowIntelligence(!showIntelligence)}
          sx={{
            justifyContent: 'space-between',
            textTransform: 'none',
            py: 1.5,
            px: 2,
            borderRadius: '8px',
            borderColor: showIntelligence ? '#062F29' : '#D5D7DA',
            backgroundColor: showIntelligence ? '#E9EFEE' : 'white',
            color: '#111827',
            fontWeight: 500,
            fontSize: '14px',
            '&:hover': {
              borderColor: '#062F29',
              backgroundColor: '#E9EFEE',
            },
            '& .MuiButton-startIcon': {
              color: showIntelligence ? '#062F29' : '#6B7280',
            },
          }}
        >
          Meeting Intelligence
        </Button>

        {/* Meeting Intelligence Panel */}
        <Collapse in={showIntelligence}>
          <Box
            sx={{
              border: '1px solid #D5D7DA',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              minHeight: '400px',
            }}
          >
            <MeetingIntelligence
              studentName={studentName}
              onClose={() => setShowIntelligence(false)}
            />
          </Box>
        </Collapse>

        {/* Upcoming Meetings */}
        <UpcomingMeetingsSection
          meetings={upcomingMeetings}
          onMeetingClick={handleMeetingClick}
          lastMeeting={lastMeeting}
          onScheduleMeeting={handleScheduleMeeting}
        />

        {/* Past Meetings */}
        <PastMeetingsSection
          meetings={pastMeetings}
          onMeetingClick={handleMeetingClick}
        />
      </Box>

      {/* Schedule/Edit Meeting Modal */}
      <ScheduleMeetingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSchedule={handleMeetingScheduled}
        onSave={handleMeetingSaved}
        studentId={studentId}
        studentName={studentName}
        existingMeeting={selectedMeeting}
      />

      {/* Success Toast */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MeetingsTab;
