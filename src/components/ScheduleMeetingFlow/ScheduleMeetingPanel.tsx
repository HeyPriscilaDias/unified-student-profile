'use client';

import { useState, useMemo } from 'react';
import { Box, Typography, IconButton, LinearProgress } from '@mui/material';
import { X } from 'lucide-react';
import { StepDuration } from './StepDuration';
import { StepTopics } from './StepTopics';
import { StepAgenda } from './StepAgenda';
import { StepConfirm } from './StepConfirm';
import { generateTopicRecommendations } from './topicRecommendations';
import type { StudentData, TopicRecommendation, AgendaItem } from '@/types/student';

interface ScheduleMeetingPanelProps {
  studentData: StudentData;
  onClose: () => void;
  onSchedule: (meeting: ScheduledMeetingData) => void;
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
  duration: 'Schedule Meeting',
  topics: 'Select Topics',
  agenda: 'Review Agenda',
  confirm: 'Confirm',
};

export function ScheduleMeetingPanel({ studentData, onClose, onSchedule }: ScheduleMeetingPanelProps) {
  const [currentStep, setCurrentStep] = useState<Step>('duration');
  const [duration, setDuration] = useState<number>(30);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('10:00');
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(new Set());
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [meetingTitle, setMeetingTitle] = useState<string>('');

  // Generate topic recommendations based on student data
  const recommendations = useMemo(
    () => generateTopicRecommendations(studentData),
    [studentData]
  );

  // Pre-select high priority topics
  useState(() => {
    const highPriority = recommendations
      .filter((r) => r.priority === 'high')
      .map((r) => r.id);
    setSelectedTopicIds(new Set(highPriority));
  });

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

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

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleSchedule = () => {
    const dateTime = `${scheduledDate}T${scheduledTime}:00Z`;
    onSchedule({
      title: meetingTitle || 'Meeting',
      scheduledDate: dateTime,
      duration,
      agenda,
    });
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
    <Box className="h-full flex flex-col bg-white">
      {/* Header */}
      <Box className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <Typography className="font-semibold text-neutral-900">
          {STEP_TITLES[currentStep]}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </Box>

      {/* Progress */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 2 }}
      />

      {/* Step indicator */}
      <Box className="flex items-center justify-center gap-2 py-3 border-b border-neutral-100">
        {STEPS.map((step, index) => (
          <Box
            key={step}
            className={`
              w-2 h-2 rounded-full transition-colors
              ${index <= currentStepIndex ? 'bg-blue-500' : 'bg-neutral-200'}
            `}
          />
        ))}
      </Box>

      {/* Content */}
      <Box className="flex-1 overflow-y-auto">
        {currentStep === 'duration' && (
          <StepDuration
            duration={duration}
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            onDurationChange={setDuration}
            onDateChange={setScheduledDate}
            onTimeChange={setScheduledTime}
            onNext={handleNext}
            onCancel={onClose}
            canProceed={canProceed()}
          />
        )}

        {currentStep === 'topics' && (
          <StepTopics
            studentFirstName={studentData.student.firstName}
            recommendations={recommendations}
            selectedTopicIds={selectedTopicIds}
            customTopics={customTopics}
            onTopicToggle={handleTopicToggle}
            onAddCustomTopic={handleAddCustomTopic}
            onRemoveCustomTopic={handleRemoveCustomTopic}
            onNext={handleNext}
            onBack={handleBack}
            canProceed={canProceed()}
          />
        )}

        {currentStep === 'agenda' && (
          <StepAgenda
            agenda={agenda}
            meetingTitle={meetingTitle}
            duration={duration}
            onAgendaChange={setAgenda}
            onTitleChange={setMeetingTitle}
            onNext={handleNext}
            onBack={handleBack}
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
            onBack={handleBack}
          />
        )}
      </Box>
    </Box>
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

export default ScheduleMeetingPanel;
