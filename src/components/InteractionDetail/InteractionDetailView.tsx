'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Users, FileEdit, Sparkles, CheckSquare, Mic, Plus, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { LoadingSection } from '@/components/shared';
import { SidePanel } from '@/components/SidePanel';
import { useStudentData } from '@/hooks/useStudentData';
import { useInteractions, useInteractionsContext } from '@/contexts/InteractionsContext';
import { useTasks, useTasksContext } from '@/contexts/TasksContext';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import { usePersistentRightPanelTab } from '@/hooks/usePersistentRightPanelTab';
import { InteractionHeader } from './InteractionHeader';
import { TranscriptSection } from './TranscriptSection';
import { AddAttendeesModal } from './AddAttendeesModal';
import type { Task, SuggestedAction, Interaction, InteractionStatus } from '@/types/student';
import type { BreadcrumbItem } from '@/components/Breadcrumbs';

interface InteractionDetailViewProps {
  studentId: string;
  interactionId: string;
}

// Section header component for consistent styling
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box sx={{ color: '#374151', display: 'flex' }}>{icon}</Box>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
        {title}
      </Typography>
    </Box>
  );
}

export function InteractionDetailView({ studentId, interactionId }: InteractionDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentData = useStudentData(studentId);
  const showSummaryParam = searchParams.get('showSummary') === 'true';
  const [notes, setNotes] = useState('');
  const [isAddAttendeesModalOpen, setIsAddAttendeesModalOpen] = useState(false);
  const [sidePanelTab, setSidePanelTab] = usePersistentRightPanelTab('alma');
  const [localSuggestedActions, setLocalSuggestedActions] = useState<SuggestedAction[]>([]);
  const { updateInteraction, updateInteractionSummary, updateInteractionWithRecording, updateInteractionStatus, updateInteractionAttendees, deleteInteraction, addInteraction } = useInteractionsContext();
  const { addTask, updateTask, toggleTask, deleteTask } = useTasksContext();
  const { activeMeeting, startMeeting, endMeeting } = useActiveMeetingContext();

  // Check if this interaction is currently being recorded
  const isRecording = activeMeeting?.interactionId === interactionId && activeMeeting?.phase === 'recording';

  // Clean up the URL after reading the params
  useEffect(() => {
    if (showSummaryParam) {
      router.replace(`/students/${studentId}/interactions/${interactionId}`, { scroll: false });
    }
  }, [showSummaryParam, router, studentId, interactionId]);

  // Handle showSummary param - triggered when recording stops from SidePanel
  useEffect(() => {
    if (showSummaryParam) {
      const MOCK_SUMMARY = `<h3>Meeting Overview</h3>
<ul>
<li>Discussed the <strong>FAFSA application process</strong> and financial aid options</li>
<li>Reviewed <strong>key deadlines</strong> including the <strong>March 2nd</strong> state priority deadline</li>
</ul>`;

      const MOCK_TRANSCRIPT = `Counselor: Good morning! Thanks for coming in today. I wanted to go over the FAFSA process with you since the application window is now open.

Student: Hi! Yes, I've been meaning to ask about this. My parents keep asking me when we need to fill it out.

Counselor: Great question. The FAFSA opened on December 31st, and I always recommend completing it as early as possible.`;

      const MOCK_ACTION_ITEMS = [
        { id: 'action-1', title: 'Send list of scholarship opportunities', priority: 'medium' as const, status: 'pending' as const, assignee: 'staff' as const },
        { id: 'action-2', title: 'Create FSA ID at studentaid.gov', priority: 'medium' as const, status: 'pending' as const, assignee: 'student' as const },
      ];

      updateInteractionWithRecording(studentId, interactionId, {
        summary: MOCK_SUMMARY,
        transcript: MOCK_TRANSCRIPT,
        actionItems: MOCK_ACTION_ITEMS,
      });
      endMeeting();
    }
  }, [showSummaryParam, studentId, interactionId, updateInteractionWithRecording, endMeeting]);

  // Use interactions from context
  const interactions = useInteractions(studentId, studentData?.interactions || []);
  const tasks = useTasks(studentId, studentData?.tasks ?? []);

  // Initialize suggested actions from student data
  useEffect(() => {
    if (studentData) {
      setLocalSuggestedActions(studentData.suggestedActions);
    }
  }, [studentData]);

  const interaction = useMemo(() => {
    return interactions.find((m) => m.id === interactionId) || null;
  }, [interactions, interactionId]);

  // Initialize notes from interaction
  useEffect(() => {
    if (interaction?.summary !== undefined) {
      setNotes(interaction.summary || '');
    }
  }, [interaction?.summary]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    updateInteractionSummary(studentId, interactionId, newNotes);
  }, [studentId, interactionId, updateInteractionSummary]);

  const handleStatusChange = useCallback((status: InteractionStatus) => {
    updateInteractionStatus(studentId, interactionId, status);
  }, [studentId, interactionId, updateInteractionStatus]);

  const handleDateChange = useCallback((date: string | undefined) => {
    updateInteraction({
      id: interactionId,
      studentId,
      interactionDate: date,
    });
  }, [studentId, interactionId, updateInteraction]);

  const handleSaveAttendees = useCallback((attendees: string[]) => {
    updateInteractionAttendees(studentId, interactionId, attendees);
  }, [studentId, interactionId, updateInteractionAttendees]);

  const handleStartRecording = useCallback(() => {
    if (!studentData || !interaction) return;
    const studentName = `${studentData.student.firstName} ${studentData.student.lastName}`;
    startMeeting(
      studentId,
      studentName,
      interactionId,
      interaction.title,
      interaction.summary
    );
  }, [studentData, interaction, studentId, interactionId, startMeeting]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteInteraction(studentId, interactionId);
      router.push(`/students/${studentId}?tab=interactions`);
    }
  };

  const handleTaskToggle = (task: Task) => {
    toggleTask(studentId, task.id);
  };

  const handleNewTask = (title: string) => {
    addTask({
      studentId,
      title,
      source: 'manual',
    });
  };

  const handleTaskEdit = (taskId: string, newTitle: string) => {
    updateTask(studentId, taskId, { title: newTitle });
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(studentId, taskId);
  };

  const handleActionAccept = (action: SuggestedAction) => {
    addTask({
      studentId,
      title: action.title,
      source: 'suggested_action',
    });
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'accepted' } : a
      )
    );
  };

  const handleActionDismiss = (action: SuggestedAction) => {
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'dismissed' } : a
      )
    );
  };

  // Loading state
  if (!studentData) {
    return (
      <AppLayout>
        <Box sx={{ p: 3 }}>
          <LoadingSection variant="card" />
        </Box>
      </AppLayout>
    );
  }

  // Interaction not found
  if (!interaction) {
    return (
      <AppLayout
        breadcrumbs={[
          { label: `${studentData.student.firstName} ${studentData.student.lastName}`, href: `/students/${studentId}` },
          { label: 'Meeting not found' },
        ]}
      >
        <Typography variant="h6" color="error">
          Interaction not found
        </Typography>
      </AppLayout>
    );
  }

  const isCompleted = interaction.status === 'completed';
  const hasTranscript = !!interaction.transcript;
  const hasAISummary = !!interaction.aiSummary;
  const studentName = `${studentData.student.firstName} ${studentData.student.lastName}`;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: studentName, href: `/students/${studentId}` },
    { label: 'Meetings', href: `/students/${studentId}?tab=meetings` },
    { label: interaction.title },
  ];

  return (
    <AppLayout
      rightPanel={
        <SidePanel
          studentFirstName={studentData.student.firstName}
          tasks={tasks}
          suggestedActions={localSuggestedActions}
          studentId={studentId}
          currentStudentId={studentId}
          activeTab={sidePanelTab}
          onTabChange={setSidePanelTab}
          onTaskToggle={handleTaskToggle}
          onNewTask={handleNewTask}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={handleTaskDelete}
          onActionAccept={handleActionAccept}
          onActionDismiss={handleActionDismiss}
        />
      }
      currentStudentId={studentId}
      breadcrumbs={breadcrumbs}
    >
      <Box>
        {/* Header */}
        <InteractionHeader
          interaction={interaction}
          onStatusChange={handleStatusChange}
          onDateChange={handleDateChange}
        />

        {/* Attendees Section */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader icon={<Users size={18} />} title="Attendees" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '14px', color: '#374151' }}>
              You, {studentName}
              {interaction.attendees && interaction.attendees.length > 0 && (
                <>, {interaction.attendees.join(', ')}</>
              )}
            </Typography>
            <Button
              startIcon={<Plus size={14} />}
              onClick={() => setIsAddAttendeesModalOpen(true)}
              sx={{
                textTransform: 'none',
                fontSize: '14px',
                color: '#6B7280',
                p: 0,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#374151',
                },
              }}
            >
              Add people
            </Button>
          </Box>
        </Box>

        {/* Notes & Talking Points Section */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader icon={<FileEdit size={18} />} title="Notes & talking points" />
          <Box
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = e.currentTarget.innerHTML;
              if (newContent !== notes) {
                setNotes(newContent);
                updateInteractionSummary(studentId, interactionId, newContent);
              }
            }}
            dangerouslySetInnerHTML={{ __html: notes || '' }}
            sx={{
              width: '100%',
              minHeight: '200px',
              p: 2,
              fontSize: '14px',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              color: '#374151',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              outline: 'none',
              '&:focus': {
                borderColor: '#9CA3AF',
              },
              '&:empty::before': {
                content: '"Talking points:\\A• How things are going overall (school, stress, workload)\\A• What\'s top of mind right now\\A• Anything blocking progress (academic, personal, logistical)"',
                whiteSpace: 'pre-wrap',
                color: '#9CA3AF',
              },
              '& h1, & h2, & h3, & h4': { fontSize: '15px', fontWeight: 600, mt: 2, mb: 1, '&:first-of-type': { mt: 0 } },
              '& ul, & ol': { pl: 2.5, mb: 2 },
              '& li': { mb: 0.5 },
              '& p': { mb: 1.5 },
              '& strong': { fontWeight: 600 },
            }}
          />
        </Box>

        {/* AI Summary Section */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader icon={<Sparkles size={18} />} title="AI Summary" />
          {hasAISummary ? (
            <Box
              sx={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: 1.6,
                '& h3': { fontSize: '15px', fontWeight: 600, mt: 2, mb: 1 },
                '& ul': { pl: 2.5, mb: 2 },
                '& li': { mb: 0.5 },
              }}
              dangerouslySetInnerHTML={{ __html: interaction.summary || '' }}
            />
          ) : (
            <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
              Add notes above or transcribe the meeting so Alma generates a summary.
            </Typography>
          )}
        </Box>

        {/* Tasks Section */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader icon={<CheckSquare size={18} />} title="Tasks" />
          {interaction.aiSummary?.recommendedActions && interaction.aiSummary.recommendedActions.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {interaction.aiSummary.recommendedActions.map((action) => (
                <Box
                  key={action.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 0.5,
                  }}
                >
                  <Box
                    component="input"
                    type="checkbox"
                    checked={action.status === 'converted_to_task'}
                    readOnly
                    sx={{
                      width: 16,
                      height: 16,
                      cursor: 'pointer',
                    }}
                  />
                  <Typography sx={{ fontSize: '14px', color: '#374151' }}>
                    {action.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
              Add tasks or transcribe the meeting so Alma generates tasks.
            </Typography>
          )}
          <Button
            startIcon={<Plus size={14} />}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              color: '#6B7280',
              p: 0,
              mt: 1.5,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#374151',
              },
            }}
          >
            Add task
          </Button>
        </Box>

        {/* Transcript Section */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader icon={<Mic size={18} />} title="Transcript" />
          {hasTranscript ? (
            <TranscriptSection transcript={interaction.transcript!} />
          ) : (
            <Typography
              onClick={!isCompleted && !isRecording ? handleStartRecording : undefined}
              sx={{
                fontSize: '14px',
                color: !isCompleted && !isRecording ? '#155E4C' : '#6B7280',
                cursor: !isCompleted && !isRecording ? 'pointer' : 'default',
                '&:hover': !isCompleted && !isRecording ? {
                  textDecoration: 'underline',
                } : {},
              }}
            >
              {isCompleted ? 'This meeting was not transcribed.' : 'Start transcribing.'}
            </Typography>
          )}
        </Box>

        {/* Delete meeting */}
        {!isRecording && (
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #E5E7EB' }}>
            <Button
              variant="text"
              startIcon={<Trash2 size={16} />}
              onClick={handleDelete}
              sx={{
                textTransform: 'none',
                color: '#DC2626',
                '&:hover': {
                  backgroundColor: '#FEF2F2',
                },
              }}
            >
              Delete meeting
            </Button>
          </Box>
        )}
      </Box>

      {/* Add Attendees Modal */}
      <AddAttendeesModal
        open={isAddAttendeesModalOpen}
        onClose={() => setIsAddAttendeesModalOpen(false)}
        onSave={handleSaveAttendees}
        currentAttendees={interaction.attendees || []}
      />
    </AppLayout>
  );
}

export default InteractionDetailView;
