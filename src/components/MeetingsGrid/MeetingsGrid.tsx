'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Calendar, Plus } from 'lucide-react';
import { useInteractionsContext } from '@/contexts/InteractionsContext';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { NewMeetingModal } from '@/components/SidePanel/StudentPickerModal';
import { MEETING_TEMPLATES, templateToHTML } from '@/lib/meetingTemplates';
import { MeetingCard } from './MeetingCard';

export function MeetingsGrid() {
  const router = useRouter();
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);

  const { getAllCounselorInteractions, addInteraction, updateInteractionTalkingPoints, updateInteractionTemplate } = useInteractionsContext();
  const { startMeeting } = useActiveMeetingContext();
  const meetings = getAllCounselorInteractions();

  const handleMeetingClick = (studentId: string, interactionId: string) => {
    router.push(`/students/${studentId}/interactions/${interactionId}`);
  };

  const handleStartMeeting = (
    selectedStudentId: string,
    studentName: string,
    options?: { templateId?: string; customTalkingPoints?: string }
  ) => {
    setIsNewMeetingModalOpen(false);
    const template = options?.templateId ? MEETING_TEMPLATES.find(t => t.id === options.templateId) : undefined;

    // Determine meeting title
    let meetingTitle: string;
    if (template) {
      meetingTitle = `${template.name} — ${studentName.split(' ')[0]}`;
    } else if (options?.customTalkingPoints) {
      meetingTitle = `Custom Meeting — ${studentName.split(' ')[0]}`;
    } else {
      meetingTitle = `Meeting with ${studentName.split(' ')[0]}`;
    }

    const newInteraction = addInteraction({
      studentId: selectedStudentId,
      title: meetingTitle,
    });

    // Set talking points from template OR custom
    const talkingPoints = options?.customTalkingPoints || (template ? templateToHTML(template) : undefined);

    if (talkingPoints) {
      updateInteractionTalkingPoints(selectedStudentId, newInteraction.id, talkingPoints);
    }
    if (template) {
      updateInteractionTemplate(selectedStudentId, newInteraction.id, template.id);
    }

    startMeeting(selectedStudentId, studentName, newInteraction.id, newInteraction.title, talkingPoints);
  };

  if (meetings.length === 0) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 4,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Calendar size={28} color="#9CA3AF" />
          </Box>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#374151',
              mb: 1,
            }}
          >
            No meetings yet
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: 320,
              mb: 3,
            }}
          >
            Start a new meeting to begin tracking your student interactions.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setIsNewMeetingModalOpen(true)}
            sx={{
              backgroundColor: '#155E4C',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              py: 1.25,
              px: 3,
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0E4A3B',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              },
            }}
          >
            New Meeting
          </Button>
        </Box>
        <NewMeetingModal
          open={isNewMeetingModalOpen}
          onClose={() => setIsNewMeetingModalOpen(false)}
          onStartMeeting={handleStartMeeting}
        />
      </>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {/* Section Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#111827',
                mb: 0.5,
              }}
            >
              Recent Meetings
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} with students
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setIsNewMeetingModalOpen(true)}
            sx={{
              backgroundColor: '#155E4C',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              py: 1.25,
              px: 2.5,
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0E4A3B',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              },
            }}
          >
            New Meeting
          </Button>
        </Box>

        {/* Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {meetings.map((interaction) => (
            <MeetingCard
              key={interaction.id}
              interaction={interaction}
              onClick={() => handleMeetingClick(interaction.studentId, interaction.id)}
            />
          ))}
        </Box>
      </Box>
      <NewMeetingModal
        open={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        onStartMeeting={handleStartMeeting}
      />
    </>
  );
}

export default MeetingsGrid;
