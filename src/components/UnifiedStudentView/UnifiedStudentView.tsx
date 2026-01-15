'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { AppLayout } from '@/components/AppLayout';
import { StudentHeader } from '@/components/StudentHeader';
import { TabNavigation } from '@/components/TabNavigation';
import { OverviewTab } from '@/components/Overview';
import { ProfileTab } from '@/components/Profile';
import { PostsecondaryTab } from '@/components/Postsecondary';
import { StudentWorkTab } from '@/components/StudentWork';
import { ActivityTab } from '@/components/Activity';
import { LoadingSection } from '@/components/shared';
import { AlmaChatPanel } from '@/components/AlmaChatPanel';
import { ScheduleMeetingModal } from '@/components/ScheduleMeetingFlow';
import type { ScheduledMeetingData } from '@/components/ScheduleMeetingFlow/ScheduleMeetingModal';
import { useStudentData } from '@/hooks/useStudentData';
import { useMeetings, useMeetingsContext } from '@/contexts/MeetingsContext';
import { textToAgendaItems } from '@/components/ScheduleMeetingFlow';
import type { TabType, Task, SuggestedAction, Meeting } from '@/types/student';

interface UnifiedStudentViewProps {
  studentId: string;
}

export function UnifiedStudentView({ studentId }: UnifiedStudentViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [localSuggestedActions, setLocalSuggestedActions] = useState<SuggestedAction[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const studentData = useStudentData(studentId);
  const { addMeeting, updateMeeting } = useMeetingsContext();

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'profile', 'postsecondary', 'student-work', 'activity'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  // Initialize local state from student data
  useEffect(() => {
    if (studentData) {
      setLocalTasks(studentData.tasks);
      setLocalSuggestedActions(studentData.suggestedActions);
    }
  }, [studentData]);

  // Handle loading state
  if (!studentData) {
    return (
      <AppLayout>
        <Box sx={{ backgroundColor: '#FBFBFB', minHeight: '100vh' }}>
          <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #D5D7DA', px: 4, py: 3 }}>
            <LoadingSection variant="card" />
          </Box>
          <Box sx={{ p: 3 }}>
            <LoadingSection variant="grid" rows={6} />
          </Box>
        </Box>
      </AppLayout>
    );
  }

  const {
    student,
    profile,
    milestones,
    tasks,
    suggestedActions,
    smartGoals,
    almaSnapshot,
    bookmarks,
    recommendations,
    studentWork,
    activityHistory,
    aiReflections,
    meetings: initialMeetings,
  } = studentData;

  // Use meetings from context (allows adding new meetings)
  const meetings = useMeetings(studentId, initialMeetings);

  const handleGenerateSnapshot = () => {
    setIsGeneratingSnapshot(true);
    // Simulate snapshot generation
    setTimeout(() => {
      setIsGeneratingSnapshot(false);
    }, 2000);
  };

  const handleOpenScheduleModal = () => {
    setSelectedMeeting(null);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleMeetingScheduled = (data: ScheduledMeetingData) => {
    // Convert text agenda to a single AgendaItem for storage
    const agendaItems = data.agenda ? [{
      id: `agenda-${Date.now()}`,
      topic: 'Meeting Agenda',
      description: data.agenda,
      source: 'counselor_added' as const,
      covered: false,
    }] : [];

    addMeeting({
      studentId,
      title: data.title,
      scheduledDate: data.scheduledDate,
      duration: data.duration,
      agenda: agendaItems,
    });
    setIsScheduleModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleMeetingSaved = (data: ScheduledMeetingData) => {
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

    setIsScheduleModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleMeetingClick = (meeting: Meeting) => {
    // For upcoming/scheduled meetings, open the edit modal
    if (meeting.status === 'scheduled' || meeting.status === 'in_progress') {
      setSelectedMeeting(meeting);
      setIsScheduleModalOpen(true);
    } else {
      // For past/completed meetings, navigate to detail page
      router.push(`/students/${meeting.studentId}/meetings/${meeting.id}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            milestones={milestones}
            smartGoals={smartGoals}
            almaSnapshot={almaSnapshot}
            onGenerateSnapshot={handleGenerateSnapshot}
            isGeneratingSnapshot={isGeneratingSnapshot}
          />
        );
      case 'profile':
        return <ProfileTab student={student} profile={profile} />;
      case 'postsecondary':
        return (
          <PostsecondaryTab
            bookmarks={bookmarks}
            recommendations={recommendations}
          />
        );
      case 'student-work':
        return (
          <StudentWorkTab
            reflections={aiReflections}
            works={studentWork}
          />
        );
      case 'activity':
        return <ActivityTab activities={activityHistory} />;
      default:
        return null;
    }
  };

  // Toggle task between open and completed
  const handleTaskToggle = (task: Task) => {
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: t.status === 'open' ? 'completed' : 'open' }
          : t
      )
    );
  };

  const handleNewTask = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      dueDate: null,
      status: 'open',
      source: 'manual',
    };
    setLocalTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskEdit = (taskId: string, newTitle: string) => {
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t))
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Accept suggested action: convert to task and mark action as accepted
  const handleActionAccept = (action: SuggestedAction) => {
    // Create new task from the suggested action
    const newTask: Task = {
      id: `task-from-action-${action.id}`,
      title: action.title,
      dueDate: null,
      status: 'open',
      source: 'suggested_action',
    };

    // Add to tasks
    setLocalTasks((prev) => [newTask, ...prev]);

    // Mark action as accepted (removes from pending list)
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'accepted' } : a
      )
    );
  };

  // Dismiss suggested action: mark as dismissed (removes from list)
  const handleActionDismiss = (action: SuggestedAction) => {
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'dismissed' } : a
      )
    );
  };

  // Build student context for Alma panel
  const studentContext = {
    firstName: student.firstName,
    lastName: student.lastName,
    grade: student.grade,
    careerVision: profile.careerVision,
    milestones,
    smartGoals,
    bookmarks,
    profile,
  };

  return (
    <AppLayout
      rightPanel={
        <AlmaChatPanel
          studentFirstName={student.firstName}
          studentContext={studentContext}
          tasks={localTasks}
          suggestedActions={localSuggestedActions}
          meetings={meetings}
          studentId={studentId}
          onTaskToggle={handleTaskToggle}
          onNewTask={handleNewTask}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={handleTaskDelete}
          onActionAccept={handleActionAccept}
          onActionDismiss={handleActionDismiss}
          onMeetingClick={handleMeetingClick}
          onScheduleMeeting={handleOpenScheduleModal}
        />
      }
      currentStudentId={studentId}
    >
      <Box
        sx={{
          backgroundColor: '#FBFBFB',
          minHeight: '100vh',
        }}
      >
        {/* Student Header */}
        <StudentHeader
          student={student}
          studentId={studentId}
          onScheduleMeeting={handleOpenScheduleModal}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <Box sx={{ backgroundColor: '#FBFBFB' }}>
          {renderTabContent()}
        </Box>
      </Box>

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        open={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        onSchedule={handleMeetingScheduled}
        onSave={handleMeetingSaved}
        studentId={studentId}
        studentName={student.firstName}
        existingMeeting={selectedMeeting}
      />
    </AppLayout>
  );
}

export default UnifiedStudentView;
