'use client';

import { useState } from 'react';
import { Box, Typography, Button, Collapse } from '@mui/material';
import { Mic, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { SectionCard } from '@/components/shared';

interface TranscriptSectionProps {
  transcript: string;
  initiallyExpanded?: boolean;
}

export function TranscriptSection({ transcript, initiallyExpanded = false }: TranscriptSectionProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [copied, setCopied] = useState(false);

  const lines = transcript.split('\n').filter((line) => line.trim());
  const previewLines = lines.slice(0, 5);
  const hasMore = lines.length > 5;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse transcript line into timestamp and content
  const parseLine = (line: string) => {
    const match = line.match(/^\[(\d{1,2}:\d{2})\]\s*(.+?):\s*(.+)$/);
    if (match) {
      return {
        timestamp: match[1],
        speaker: match[2],
        content: match[3],
      };
    }
    return { timestamp: null, speaker: null, content: line };
  };

  const renderLine = (line: string, index: number) => {
    const parsed = parseLine(line);

    return (
      <Box key={index} className="flex gap-3 py-2">
        {parsed.timestamp && (
          <Typography className="text-xs text-neutral-400 font-mono w-12 flex-shrink-0">
            {parsed.timestamp}
          </Typography>
        )}
        <Box className="flex-1">
          {parsed.speaker && (
            <Typography
              component="span"
              className="text-sm font-medium text-neutral-900 mr-2"
            >
              {parsed.speaker}:
            </Typography>
          )}
          <Typography component="span" className="text-sm text-neutral-700">
            {parsed.content}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <SectionCard
      title="Transcript"
      icon={<Mic size={18} className="text-blue-500" />}
      action={
        <Button
          variant="text"
          size="small"
          startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
          onClick={handleCopy}
          sx={{ textTransform: 'none', color: copied ? 'success.main' : 'text.secondary' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      }
    >
      <Box>
        {/* Preview or full transcript */}
        <Box className="divide-y divide-neutral-100">
          {(expanded ? lines : previewLines).map((line, index) =>
            renderLine(line, index)
          )}
        </Box>

        {/* Expand/collapse button */}
        {hasMore && (
          <Box className="pt-3 border-t border-neutral-100 mt-2">
            <Button
              variant="text"
              fullWidth
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              {expanded ? 'Show less' : `View full transcript (${lines.length} lines)`}
            </Button>
          </Box>
        )}
      </Box>
    </SectionCard>
  );
}

export default TranscriptSection;
