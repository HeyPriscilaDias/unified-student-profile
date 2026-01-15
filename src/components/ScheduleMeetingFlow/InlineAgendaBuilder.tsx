'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  AlertTriangle,
  Sparkles,
  Plus,
  X,
  Target,
  BookOpen,
  Bookmark,
  GraduationCap,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { generateTopicRecommendationsAsync, generateTopicRecommendations } from './topicRecommendations';
import { generateAgendaFromTopics } from './agendaUtils';
import type { StudentData, TopicRecommendation, TopicCategory, AgendaItem } from '@/types/student';

interface InlineAgendaBuilderProps {
  studentData: StudentData;
  duration: number;
  onAgendaChange: (agenda: AgendaItem[]) => void;
  onCollapse: () => void;
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

export function InlineAgendaBuilder({
  studentData,
  duration,
  onAgendaChange,
  onCollapse,
}: InlineAgendaBuilderProps) {
  const [recommendations, setRecommendations] = useState<TopicRecommendation[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(new Set());
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  // Load recommendations on mount
  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [studentData]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Generate agenda when selections change
  useEffect(() => {
    if (!isLoading) {
      const agenda = generateAgendaFromTopics(
        recommendations,
        selectedTopicIds,
        customTopics,
        duration
      );
      onAgendaChange(agenda);
    }
  }, [recommendations, selectedTopicIds, customTopics, duration, isLoading, onAgendaChange]);

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

  const handleAddCustomTopic = () => {
    if (newTopic.trim()) {
      setCustomTopics((prev) => [...prev, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveCustomTopic = (index: number) => {
    setCustomTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const highPriorityTopics = recommendations.filter((r) => r.priority === 'high');
  const otherTopics = recommendations.filter((r) => r.priority !== 'high');
  const totalSelected = selectedTopicIds.size + customTopics.length;

  if (isLoading) {
    return (
      <Box className="border border-neutral-200 rounded-lg p-4">
        <Box className="flex items-center gap-3">
          <CircularProgress size={20} />
          <Box>
            <Typography className="text-sm font-medium text-neutral-700">
              Loading topic suggestions...
            </Typography>
            <Typography className="text-xs text-neutral-500">
              Analyzing student data for personalized recommendations
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="border border-neutral-200 rounded-lg overflow-hidden">
      {/* Header */}
      <Box
        className="flex items-center justify-between px-4 py-3 bg-neutral-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <Typography className="text-sm font-medium text-neutral-700">
            Meeting Agenda
          </Typography>
          {totalSelected > 0 && (
            <Chip
              label={`${totalSelected} topic${totalSelected !== 1 ? 's' : ''}`}
              size="small"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
        <Box className="flex items-center gap-2">
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onCollapse(); }}>
            <X size={16} />
          </IconButton>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {/* AI Recommendations Header */}
          <Box className="flex items-center gap-1 text-xs text-neutral-500">
            <Sparkles size={12} className="text-amber-500" />
            <span>AI-recommended based on {studentData.student.firstName}&apos;s data</span>
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
                    onToggle={() => handleTopicToggle(rec.id)}
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
                    onToggle={() => handleTopicToggle(rec.id)}
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
                    className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg bg-white"
                  >
                    <Checkbox checked disabled size="small" sx={{ p: 0 }} />
                    <Typography className="flex-1 text-sm text-neutral-900">
                      {topic}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveCustomTopic(index)}
                      sx={{ p: 0.5 }}
                    >
                      <X size={14} />
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
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTopic()}
                fullWidth
                sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              />
              <Button
                variant="outlined"
                onClick={handleAddCustomTopic}
                disabled={!newTopic.trim()}
                sx={{ textTransform: 'none', minWidth: 'auto', px: 1.5 }}
              >
                <Plus size={16} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
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
        flex items-start gap-2 p-2 rounded-lg border cursor-pointer
        transition-colors text-sm
        ${isSelected ? 'border-blue-300 bg-blue-50' : `${styles.borderColor} ${styles.bgColor}`}
      `}
    >
      <Checkbox
        checked={isSelected}
        size="small"
        sx={{ p: 0, mt: 0.25 }}
      />

      <Box className="flex-1 min-w-0">
        <Box className="flex items-center gap-1.5 mb-0.5">
          <Icon size={12} className="text-neutral-400" />
          <Typography className="font-medium text-neutral-900 text-sm">
            {recommendation.topic}
          </Typography>
          {recommendation.priority === 'high' && (
            <Chip
              label="High"
              size="small"
              color={styles.chipColor}
              sx={{ height: 16, fontSize: '0.6rem' }}
            />
          )}
        </Box>

        {recommendation.description && (
          <Typography className="text-xs text-neutral-600 mb-0.5">
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

export default InlineAgendaBuilder;
