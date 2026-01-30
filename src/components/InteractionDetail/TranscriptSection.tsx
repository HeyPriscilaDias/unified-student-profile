'use client';

import { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { Mic, ChevronDown, ChevronUp } from 'lucide-react';

interface TranscriptSectionProps {
  transcript: string;
}

export function TranscriptSection({ transcript }: TranscriptSectionProps) {
  const [expanded, setExpanded] = useState(false);

  // Parse transcript and convert to "You:" / "Them:" format
  const renderTranscript = () => {
    const lines = transcript.split('\n').filter((line) => line.trim());

    return lines.map((line, index) => {
      // Check if line starts with a speaker identifier
      const speakerMatch = line.match(/^(Counselor|Student):\s*(.+)/);

      if (speakerMatch) {
        const [, speaker, content] = speakerMatch;
        const displaySpeaker = speaker === 'Counselor' ? 'You' : 'Them';

        return (
          <Typography
            key={index}
            sx={{
              fontSize: '14px',
              lineHeight: '20px',
              color: '#252b37',
              fontFamily: 'Inter, sans-serif',
              mb: 2,
              '&:last-child': { mb: 0 },
            }}
          >
            {displaySpeaker}: {content}
          </Typography>
        );
      }

      // Plain line without speaker
      return (
        <Typography
          key={index}
          sx={{
            fontSize: '14px',
            lineHeight: '20px',
            color: '#252b37',
            fontFamily: 'Inter, sans-serif',
            mb: 2,
            '&:last-child': { mb: 0 },
          }}
        >
          {line}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
        }}
      >
        <Mic size={16} color="#414651" />
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            color: '#252b37',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Transcript
        </Typography>
        <IconButton size="small" sx={{ p: 0 }}>
          {expanded ? (
            <ChevronUp size={16} color="#252b37" />
          ) : (
            <ChevronDown size={16} color="#252b37" />
          )}
        </IconButton>
      </Box>

      {/* Collapsible transcript content */}
      <Collapse in={expanded}>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '12px',
            p: 2,
          }}
        >
          {renderTranscript()}
        </Box>
      </Collapse>
    </Box>
  );
}

export default TranscriptSection;
