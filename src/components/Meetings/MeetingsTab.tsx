'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Snackbar, Alert } from '@mui/material';
import { UpcomingMeetingsSection } from './UpcomingMeetingsSection';
import { PastMeetingsSection } from './PastMeetingsSection';
import { ActivityHistorySection } from './ActivityHistorySection';
import { ScheduleMeetingModal } from '@/components/ScheduleMeetingFlow';
import type { ScheduledMeetingData as ModalScheduledMeetingData } from '@/components/ScheduleMeetingFlow/ScheduleMeetingModal';
import type { ActivityItem, Meeting, StudentData } from '@/types/student';

interface MeetingsTabProps {
  activities: ActivityItem[];
  meetings: Meeting[];
  studentId: string;
  studentData: StudentData;
}

export function MeetingsTab({ activities, meetings, studentId, studentData }: MeetingsTabProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleScheduleMeeting = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMeetingScheduled = (data: ModalScheduledMeetingData) => {
    // In a real app, this would save to the backend
    console.log('Meeting scheduled:', data);
    setIsModalOpen(false);
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
    // Navigate to meeting detail page
    router.push(`/students/${meeting.studentId}/meetings/${meeting.id}`);
  };

  return (
    <Box>
      <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
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

        {/* Activity History (non-meeting items) */}
        <ActivityHistorySection activities={activities} />
      </Box>

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSchedule={handleMeetingScheduled}
        studentData={studentData}
      />

      {/* Success Toast */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
          Meeting scheduled successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MeetingsTab;
