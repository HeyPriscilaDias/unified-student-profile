'use client';

import { useState } from 'react';
import { Box, Typography, Button, Checkbox, TextField, IconButton, Chip } from '@mui/material';
import { AlertTriangle, Sparkles, Plus, X, Target, Calendar, BookOpen, Bookmark, GraduationCap, RotateCcw } from 'lucide-react';
import type { TopicRecommendation, TopicCategory } from '@/types/student';

interface StepTopicsProps {
  studentFirstName: string;
  recommendations: TopicRecommendation[];
  selectedTopicIds: Set<string>;
  customTopics: string[];
  onTopicToggle: (topicId: string) => void;
  onAddCustomTopic: (topic: string) => void;
  onRemoveCustomTopic: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

const categoryIcons: Record<TopicCategory, typeof AlertTriangle> = {
  deadline: AlertTriangle,
  milestone: Target,
  goal: Target,
  reflection: BookOpen,
  bookmark: Bookmark,
  grade_level: GraduationCap,
  follow_up: RotateCcw,
};

const priorityStyles = {
  high: {
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50',
    chipColor: 'error' as const,
  },
  medium: {
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    chipColor: 'warning' as const,
  },
  low: {
    borderColor: 'border-neutral-200',
    bgColor: 'bg-white',
    chipColor: 'default' as const,
  },
};

export function StepTopics({
  studentFirstName,
  recommendations,
  selectedTopicIds,
  customTopics,
  onTopicToggle,
  onAddCustomTopic,
  onRemoveCustomTopic,
  onNext,
  onBack,
  canProceed,
}: StepTopicsProps) {
  const [newTopic, setNewTopic] = useState('');

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      onAddCustomTopic(newTopic.trim());
      setNewTopic('');
    }
  };

  const highPriorityTopics = recommendations.filter((r) => r.priority === 'high');
  const otherTopics = recommendations.filter((r) => r.priority !== 'high');

  return (
    <Box className="p-4 flex flex-col h-full">
      <Box className="flex-1 overflow-y-auto space-y-4">
        {/* Header */}
        <Box>
          <Typography className="text-sm text-neutral-600 mb-1">
            Select topics to discuss with {studentFirstName}
          </Typography>
          <Box className="flex items-center gap-1 text-xs text-neutral-500">
            <Sparkles size={12} className="text-amber-500" />
            <span>AI-recommended based on student data</span>
          </Box>
        </Box>

        {/* High Priority Section */}
        {highPriorityTopics.length > 0 && (
          <Box>
            <Typography className="text-xs font-medium text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <AlertTriangle size={12} />
              High Priority
            </Typography>
            <Box className="space-y-2">
              {highPriorityTopics.map((rec) => (
                <TopicCard
                  key={rec.id}
                  recommendation={rec}
                  isSelected={selectedTopicIds.has(rec.id)}
                  onToggle={() => onTopicToggle(rec.id)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Suggested Topics Section */}
        {otherTopics.length > 0 && (
          <Box>
            <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
              Suggested Topics
            </Typography>
            <Box className="space-y-2">
              {otherTopics.map((rec) => (
                <TopicCard
                  key={rec.id}
                  recommendation={rec}
                  isSelected={selectedTopicIds.has(rec.id)}
                  onToggle={() => onTopicToggle(rec.id)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Custom Topics Section */}
        <Box>
          <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
            Custom Topics
          </Typography>

          {/* Existing custom topics */}
          {customTopics.length > 0 && (
            <Box className="space-y-2 mb-3">
              {customTopics.map((topic, index) => (
                <Box
                  key={index}
                  className="flex items-center gap-2 p-3 border border-neutral-200 rounded-lg bg-white"
                >
                  <Checkbox checked disabled size="small" />
                  <Typography className="flex-1 text-sm text-neutral-900">
                    {topic}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveCustomTopic(index)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* Add new topic */}
          <Box className="flex gap-2">
            <TextField
              size="small"
              placeholder="Add a custom topic..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
              fullWidth
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
            <Button
              variant="outlined"
              onClick={handleAddTopic}
              disabled={!newTopic.trim()}
              sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
            >
              <Plus size={18} />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Selection summary */}
      <Box className="py-3 border-t border-neutral-100 mt-4">
        <Typography className="text-xs text-neutral-500 text-center">
          {selectedTopicIds.size + customTopics.length} topic{selectedTopicIds.size + customTopics.length !== 1 ? 's' : ''} selected
        </Typography>
      </Box>

      {/* Actions */}
      <Box className="flex gap-2">
        <Button
          variant="text"
          onClick={onBack}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!canProceed}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

interface TopicCardProps {
  recommendation: TopicRecommendation;
  isSelected: boolean;
  onToggle: () => void;
}

function TopicCard({ recommendation, isSelected, onToggle }: TopicCardProps) {
  const Icon = categoryIcons[recommendation.category];
  const styles = priorityStyles[recommendation.priority];

  return (
    <Box
      onClick={onToggle}
      className={`
        flex items-start gap-3 p-3 rounded-lg border cursor-pointer
        transition-colors
        ${isSelected ? 'border-blue-300 bg-blue-50' : `${styles.borderColor} ${styles.bgColor}`}
      `}
    >
      <Checkbox
        checked={isSelected}
        size="small"
        sx={{ p: 0, mt: 0.25 }}
      />

      <Box className="flex-1 min-w-0">
        <Box className="flex items-center gap-2 mb-1">
          <Icon size={14} className="text-neutral-400" />
          <Typography className="font-medium text-neutral-900 text-sm">
            {recommendation.topic}
          </Typography>
          {recommendation.priority === 'high' && (
            <Chip
              label="High"
              size="small"
              color={styles.chipColor}
              sx={{ height: 18, fontSize: '0.65rem' }}
            />
          )}
        </Box>

        {recommendation.description && (
          <Typography className="text-xs text-neutral-600 mb-1">
            {recommendation.description}
          </Typography>
        )}

        <Typography className="text-xs text-neutral-500 italic">
          {recommendation.reason}
        </Typography>
      </Box>
    </Box>
  );
}

export default StepTopics;
