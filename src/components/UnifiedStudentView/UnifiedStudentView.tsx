'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Snackbar, Alert } from '@mui/material';
import { AppLayout } from '@/components/AppLayout';
import { StudentHeader } from '@/components/StudentHeader';
import { TabNavigation } from '@/components/TabNavigation';
import { OverviewTab } from '@/components/Overview';
import { ProfileTab } from '@/components/Profile';
import { PostsecondaryTab } from '@/components/Postsecondary';
import { StudentWorkTab } from '@/components/StudentWork';
import { NotesTab } from '@/components/Notes';
import { MeetingsTab } from '@/components/Meetings';
import { LoadingSection } from '@/components/shared';
import { SidePanel, SidePanelTabType } from '@/components/SidePanel';
import { useStudentData } from '@/hooks/useStudentData';
import { useInteractions, useInteractionsContext } from '@/contexts/InteractionsContext';
import { useTasks, useTasksContext } from '@/contexts/TasksContext';
import { usePersistentRightPanelTab } from '@/hooks/usePersistentRightPanelTab';
import type { TabType, Task, SuggestedAction, Interaction } from '@/types/student';

interface UnifiedStudentViewProps {
  studentId: string;
}

export function UnifiedStudentView({ studentId }: UnifiedStudentViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState(false);
  const [localSuggestedActions, setLocalSuggestedActions] = useState<SuggestedAction[]>([]);
  const [sidePanelTab, setSidePanelTab] = usePersistentRightPanelTab('alma');
  const [showInteractionToast, setShowInteractionToast] = useState(false);

  const studentData = useStudentData(studentId);
  const { addInteraction } = useInteractionsContext();
  const { addTask, updateTask, toggleTask, deleteTask } = useTasksContext();

  // Use interactions from context (allows adding new interactions)
  // Must be called before any conditional returns to follow rules of hooks
  const interactions = useInteractions(studentId, studentData?.interactions ?? []);

  // Use tasks from context (allows real-time updates from interaction recordings)
  const tasks = useTasks(studentId, studentData?.tasks ?? []);

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'profile', 'postsecondary', 'student-work', 'notes', 'meetings'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  // Initialize suggested actions from student data
  useEffect(() => {
    if (studentData) {
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
    smartGoals,
    almaSnapshot,
    bookmarks,
    recommendations,
    studentWork,
    aiReflections,
  } = studentData;

  const handleGenerateSnapshot = () => {
    setIsGeneratingSnapshot(true);
    // Simulate snapshot generation
    setTimeout(() => {
      setIsGeneratingSnapshot(false);
    }, 2000);
  };

  const handleCreateInteraction = () => {
    // Create a new interaction and navigate to detail view
    const newInteraction = addInteraction({
      studentId,
      title: `Meeting with ${student?.firstName || 'Student'}`,
      summary: '',
    });
    // Navigate to interaction detail page
    router.push(`/students/${studentId}/interactions/${newInteraction.id}`);
  };

  const handleInteractionClick = (interaction: Interaction) => {
    // Navigate to interaction detail page
    router.push(`/students/${interaction.studentId}/interactions/${interaction.id}`);
  };

  // Toggle task between open and completed
  const handleTaskToggle = (task: Task) => {
    toggleTask(studentId, task.id);
  };

  const handleNewTask = (title: string) => {
    addTask({
      studentId,
      title,
      taskType: 'staff',
      source: 'manual',
    });
  };

  const handleTaskEdit = (taskId: string, newTitle: string) => {
    updateTask(studentId, taskId, { title: newTitle });
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(studentId, taskId);
  };

  // Accept suggested action: convert to task and mark action as accepted
  const handleActionAccept = (action: SuggestedAction) => {
    addTask({
      studentId,
      title: action.title,
      taskType: 'staff',
      source: 'suggested_action',
    });
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'accepted' } : a
      )
    );
  };

  // Dismiss suggested action
  const handleActionDismiss = (action: SuggestedAction) => {
    setLocalSuggestedActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: 'dismissed' } : a
      )
    );
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
      case 'notes':
        return (
          <NotesTab
            studentId={studentId}
            studentFirstName={student.firstName}
          />
        );
      case 'meetings':
        return (
          <MeetingsTab
            studentId={studentId}
            interactions={interactions}
            onInteractionClick={handleInteractionClick}
            onScheduleInteraction={handleCreateInteraction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout
      rightPanel={
        <SidePanel
          studentFirstName={student.firstName}
          tasks={tasks}
          suggestedActions={localSuggestedActions}
          studentId={studentId}
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

      {/* Interaction Created Toast */}
      <Snackbar
        open={showInteractionToast}
        autoHideDuration={4000}
        onClose={() => setShowInteractionToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowInteractionToast(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Interaction created successfully
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}

export default UnifiedStudentView;
