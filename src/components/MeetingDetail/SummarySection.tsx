'use client';

import { Box, Typography, Button, Chip } from '@mui/material';
import { Sparkles, RefreshCw, ThumbsUp, Minus, AlertTriangle } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import type { MeetingSummary } from '@/types/student';

interface SummarySectionProps {
  summary: MeetingSummary;
  onRegenerate?: () => void;
}

const sentimentConfig = {
  positive: {
    icon: ThumbsUp,
    label: 'Positive',
    color: 'success' as const,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  neutral: {
    icon: Minus,
    label: 'Neutral',
    color: 'default' as const,
    bgColor: 'bg-neutral-50',
    textColor: 'text-neutral-700',
  },
  concerned: {
    icon: AlertTriangle,
    label: 'Concerned',
    color: 'warning' as const,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
};

export function SummarySection({ summary, onRegenerate }: SummarySectionProps) {
  const sentiment = summary.studentSentiment
    ? sentimentConfig[summary.studentSentiment]
    : null;
  const SentimentIcon = sentiment?.icon;

  return (
    <SectionCard
      title="AI Summary"
      icon={<Sparkles size={18} className="text-amber-500" />}
      action={
        <Button
          variant="text"
          size="small"
          startIcon={<RefreshCw size={14} />}
          onClick={onRegenerate}
          sx={{ textTransform: 'none', color: 'text.secondary' }}
        >
          Regenerate
        </Button>
      }
    >
      <Box className="space-y-4">
        {/* Sentiment badge */}
        {sentiment && SentimentIcon && (
          <Box className="flex items-center gap-2">
            <Typography className="text-xs text-neutral-500">Student sentiment:</Typography>
            <Chip
              icon={<SentimentIcon size={12} />}
              label={sentiment.label}
              size="small"
              color={sentiment.color}
              sx={{ height: 22, fontSize: '0.75rem' }}
            />
          </Box>
        )}

        {/* Overview */}
        <Typography className="text-sm text-neutral-700 leading-relaxed">
          {summary.overview}
        </Typography>

        {/* Key points */}
        {summary.keyPoints.length > 0 && (
          <Box>
            <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
              Key Points
            </Typography>
            <Box component="ul" className="list-disc list-inside space-y-1">
              {summary.keyPoints.map((point, index) => (
                <Typography
                  key={index}
                  component="li"
                  className="text-sm text-neutral-700"
                >
                  {point}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {/* Generated timestamp */}
        <Typography className="text-xs text-neutral-400 pt-2">
          Generated {new Date(summary.generatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Typography>
      </Box>
    </SectionCard>
  );
}

export default SummarySection;
