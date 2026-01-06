'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, LinearProgress, Paper, CircularProgress } from '@mui/material';
import { ArrowLeft, Calendar, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { AlmaChatPanel } from '@/components/AlmaChatPanel';
import { StepDuration } from './StepDuration';
import { StepTopics } from './StepTopics';
import { StepAgenda } from './StepAgenda';
import { StepConfirm } from './StepConfirm';
import { generateTopicRecommendationsAsync, generateTopicRecommendations } from './topicRecommendations';
import { useStudentData } from '@/hooks/useStudentData';
import { useMeetingsContext } from '@/contexts/MeetingsContext';
import type { TopicRecommendation, AgendaItem } from '@/types/student';

interface ScheduleMeetingPageProps {
  studentId: string;
}

export interface ScheduledMeetingData {
  title: string;
  scheduledDate: string;
  duration: number;
  agenda: AgendaItem[];
}

type Step = 'duration' | 'topics' | 'agenda' | 'confirm';

const STEPS: Step[] = ['duration', 'topics', 'agenda', 'confirm'];

const STEP_TITLES: Record<Step, string> = {
  duration: 'Date & Duration',
  topics: 'Select Topics',
  agenda: 'Review Agenda',
  confirm: 'Confirm',
};

const STEP_DESCRIPTIONS: Record<Step, string> = {
  duration: 'Choose when and how long the meeting will be',
  topics: 'Select topics to discuss based on AI recommendations',
  agenda: 'Review and customize the meeting agenda',
  confirm: 'Review all details and schedule the meeting',
};

export function ScheduleMeetingPage({ studentId }: ScheduleMeetingPageProps) {
  const router = useRouter();
  const studentData = useStudentData(studentId);
  const { addMeeting } = useMeetingsContext();

  const [currentStep, setCurrentStep] = useState<Step>('duration');
  const [duration, setDuration] = useState<number>(30);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('10:00');
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(new Set());
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [meetingTitle, setMeetingTitle] = useState<string>('');

  // AI recommendation state
  const [recommendations, setRecommendations] = useState<TopicRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);

  // Load AI recommendations when entering the topics step
  const loadRecommendations = useCallback(async () => {
    if (!studentData || recommendationsLoaded) return;

    setIsLoadingRecommendations(true);
    try {
      const aiRecommendations = await generateTopicRecommendationsAsync(studentData);
      setRecommendations(aiRecommendations);

      // Pre-select high priority topics
      const highPriority = aiRecommendations
        .filter((r) => r.priority === 'high')
        .map((r) => r.id);
      setSelectedTopicIds(new Set(highPriority));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Fall back to static recommendations
      const staticRecs = generateTopicRecommendations(studentData);
      setRecommendations(staticRecs);
      const highPriority = staticRecs
        .filter((r) => r.priority === 'high')
        .map((r) => r.id);
      setSelectedTopicIds(new Set(highPriority));
    } finally {
      setIsLoadingRecommendations(false);
      setRecommendationsLoaded(true);
    }
  }, [studentData, recommendationsLoaded]);

  // Trigger recommendation loading when moving to topics step
  useEffect(() => {
    if (currentStep === 'topics' && !recommendationsLoaded && studentData) {
      loadRecommendations();
    }
  }, [currentStep, recommendationsLoaded, studentData, loadRecommendations]);

  if (!studentData) {
    return (
      <AppLayout currentStudentId={studentId}>
        <Box className="flex items-center justify-center h-screen">
          <Typography>Loading...</Typography>
        </Box>
      </AppLayout>
    );
  }

  const { student } = studentData;
  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleBack = () => {
    router.push(`/students/${studentId}`);
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      // If moving from topics to agenda, generate the agenda
      if (currentStep === 'topics') {
        const generatedAgenda = generateAgendaFromTopics(
          recommendations,
          selectedTopicIds,
          customTopics,
          duration
        );
        setAgenda(generatedAgenda);

        // Generate default title from first topic
        if (!meetingTitle && generatedAgenda.length > 0) {
          setMeetingTitle(generatedAgenda[0].topic);
        }
      }
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handlePrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleSchedule = () => {
    const dateTime = `${scheduledDate}T${scheduledTime}:00`;

    // Add meeting to context
    const newMeeting = addMeeting({
      studentId,
      title: meetingTitle || 'Meeting',
      scheduledDate: dateTime,
      duration,
      agenda,
    });

    console.log('Meeting scheduled:', newMeeting);

    // Navigate back to student profile, switch to meetings tab
    router.push(`/students/${studentId}?tab=meetings`);
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopicIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  const handleAddCustomTopic = (topic: string) => {
    setCustomTopics((prev) => [...prev, topic]);
  };

  const handleRemoveCustomTopic = (index: number) => {
    setCustomTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'duration':
        return duration > 0 && !!scheduledDate && !!scheduledTime;
      case 'topics':
        return selectedTopicIds.size > 0 || customTopics.length > 0;
      case 'agenda':
        return agenda.length > 0 && meetingTitle.trim().length > 0;
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  return (
    <AppLayout
      rightPanel={
        <AlmaChatPanel
          studentFirstName={student.firstName}
          tasks={studentData.tasks}
          suggestedActions={studentData.suggestedActions}
          onTaskToggle={() => {}}
          onNewTask={() => {}}
          onActionAccept={() => {}}
          onActionDismiss={() => {}}
        />
      }
      currentStudentId={studentId}
    >
      <Box className="min-h-screen bg-neutral-50">
        {/* Header */}
        <Box className="bg-white border-b border-neutral-200 px-6 py-4">
          <Box className="max-w-3xl mx-auto">
            <Button
              variant="text"
              startIcon={<ArrowLeft size={18} />}
              onClick={handleBack}
              sx={{ textTransform: 'none', color: 'text.secondary', mb: 2, ml: -1 }}
            >
              Back to {student.firstName}'s Profile
            </Button>

            <Box className="flex items-center gap-3">
              <Box className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar size={20} className="text-blue-600" />
              </Box>
              <Box>
                <Box className="flex items-center gap-2">
                  <Typography variant="h5" className="font-semibold text-neutral-900">
                    Schedule Meeting with {student.firstName}
                  </Typography>
                  <Typography className="text-sm text-neutral-500">
                    · Grade {student.grade}
                  </Typography>
                </Box>
                <Typography className="text-sm text-neutral-500">
                  {STEP_DESCRIPTIONS[currentStep]}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Progress */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 3 }}
        />

        {/* Step Indicators */}
        <Box className="bg-white border-b border-neutral-100">
          <Box className="max-w-3xl mx-auto px-6 py-3">
            <Box className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <Box
                  key={step}
                  className={`flex items-center gap-2 ${
                    index <= currentStepIndex ? 'text-blue-600' : 'text-neutral-400'
                  }`}
                >
                  <Box
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                      ${index < currentStepIndex ? 'bg-blue-600 text-white' : ''}
                      ${index === currentStepIndex ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : ''}
                      ${index > currentStepIndex ? 'bg-neutral-100 text-neutral-400' : ''}
                    `}
                  >
                    {index + 1}
                  </Box>
                  <Typography
                    className={`text-sm font-medium hidden sm:block ${
                      index <= currentStepIndex ? 'text-neutral-900' : 'text-neutral-400'
                    }`}
                  >
                    {STEP_TITLES[step]}
                  </Typography>
                  {index < STEPS.length - 1 && (
                    <Box
                      className={`w-12 h-0.5 mx-2 ${
                        index < currentStepIndex ? 'bg-blue-600' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box className="max-w-3xl mx-auto px-6 py-6">
          <Paper elevation={0} className="border border-neutral-200 rounded-lg overflow-hidden">
            {currentStep === 'duration' && (
              <StepDuration
                duration={duration}
                scheduledDate={scheduledDate}
                scheduledTime={scheduledTime}
                onDurationChange={setDuration}
                onDateChange={setScheduledDate}
                onTimeChange={setScheduledTime}
                onNext={handleNext}
                onCancel={handleBack}
                canProceed={canProceed()}
              />
            )}

            {currentStep === 'topics' && (
              isLoadingRecommendations ? (
                <Box className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <Box className="relative mb-4">
                    <CircularProgress size={48} />
                    <Box className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={20} className="text-amber-500" />
                    </Box>
                  </Box>
                  <Typography className="text-lg font-medium text-neutral-900 mb-2">
                    Analyzing Student Data
                  </Typography>
                  <Typography className="text-sm text-neutral-500 text-center max-w-md">
                    Our AI is reviewing {student.firstName}'s milestones, goals, and grade-level
                    requirements to recommend personalized discussion topics...
                  </Typography>
                </Box>
              ) : (
                <StepTopics
                  studentFirstName={student.firstName}
                  recommendations={recommendations}
                  selectedTopicIds={selectedTopicIds}
                  customTopics={customTopics}
                  onTopicToggle={handleTopicToggle}
                  onAddCustomTopic={handleAddCustomTopic}
                  onRemoveCustomTopic={handleRemoveCustomTopic}
                  onNext={handleNext}
                  onBack={handlePrevStep}
                  canProceed={canProceed()}
                />
              )
            )}

            {currentStep === 'agenda' && (
              <StepAgenda
                agenda={agenda}
                meetingTitle={meetingTitle}
                duration={duration}
                onAgendaChange={setAgenda}
                onTitleChange={setMeetingTitle}
                onNext={handleNext}
                onBack={handlePrevStep}
                canProceed={canProceed()}
              />
            )}

            {currentStep === 'confirm' && (
              <StepConfirm
                meetingTitle={meetingTitle}
                scheduledDate={scheduledDate}
                scheduledTime={scheduledTime}
                duration={duration}
                agenda={agenda}
                counselorName="Mr. Rodriguez"
                onConfirm={handleSchedule}
                onBack={handlePrevStep}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </AppLayout>
  );
}

// Helper function to generate agenda from selected topics
function generateAgendaFromTopics(
  recommendations: TopicRecommendation[],
  selectedIds: Set<string>,
  customTopics: string[],
  totalDuration: number
): AgendaItem[] {
  const selectedRecs = recommendations.filter((r) => selectedIds.has(r.id));
  const totalItems = selectedRecs.length + customTopics.length;

  if (totalItems === 0) return [];

  // Calculate duration per item (reserve 5 min for wrap-up)
  const availableTime = totalDuration - 5;
  const timePerItem = Math.floor(availableTime / totalItems);

  const agendaItems: AgendaItem[] = [];

  // Add selected recommendations
  selectedRecs.forEach((rec, index) => {
    const srcRef = rec.sourceReference;
    const agendaSourceRef = srcRef ? {
      type: srcRef.type as 'milestone' | 'task' | 'reflection' | 'bookmark' | 'grade_level' | 'goal',
      id: srcRef.id,
    } : undefined;
    agendaItems.push({
      id: `agenda-new-${index}`,
      topic: rec.topic,
      description: rec.description,
      source: 'ai_recommended',
      sourceReason: rec.reason,
      sourceReference: agendaSourceRef,
      duration: timePerItem,
      covered: false,
    });
  });

  // Add custom topics
  customTopics.forEach((topic, index) => {
    agendaItems.push({
      id: `agenda-custom-${index}`,
      topic,
      source: 'counselor_added',
      duration: timePerItem,
      covered: false,
    });
  });

  // Add wrap-up
  agendaItems.push({
    id: 'agenda-wrapup',
    topic: 'Wrap-up & Next Steps',
    description: 'Summarize action items and schedule follow-up if needed',
    source: 'counselor_added',
    duration: 5,
    covered: false,
  });

  return agendaItems;
}

export default ScheduleMeetingPage;
