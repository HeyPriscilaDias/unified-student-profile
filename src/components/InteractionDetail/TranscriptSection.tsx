'use client';

import { useState } from 'react';
import { Box, Typography, Button, Collapse } from '@mui/material';
import { FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface TranscriptSectionProps {
  transcript: string;
}

export function TranscriptSection({ transcript }: TranscriptSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse transcript line into speaker and content
  const renderTranscript = () => {
    const lines = transcript.split('\n').filter((line) => line.trim());

    return lines.map((line, index) => {
      // Check if line starts with a speaker identifier
      const speakerMatch = line.match(/^(Counselor|Student):\s*(.+)/);

      if (speakerMatch) {
        const [, speaker, content] = speakerMatch;
        const isCounselor = speaker === 'Counselor';

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: isCounselor ? 'flex-start' : 'flex-end',
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                maxWidth: '85%',
                px: 2,
                py: 1.5,
                borderRadius: isCounselor ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                backgroundColor: isCounselor ? '#E5E7EB' : '#062F29',
                color: isCounselor ? '#1F2937' : '#FFFFFF',
              }}
            >
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  mb: 0.5,
                  color: isCounselor ? '#374151' : 'rgba(255,255,255,0.9)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {speaker}
              </Typography>
              <Typography sx={{ fontSize: '13px', lineHeight: 1.5 }}>
                {content}
              </Typography>
            </Box>
          </Box>
        );
      }

      // Plain line without speaker
      return (
        <Typography key={index} sx={{ fontSize: '13px', color: '#4B5563', py: 1 }}>
          {line}
        </Typography>
      );
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      {/* Toggle button - always visible */}
      <Button
        fullWidth
        onClick={() => setExpanded(!expanded)}
        endIcon={expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        startIcon={<FileText size={18} />}
        sx={{
          justifyContent: 'space-between',
          textTransform: 'none',
          color: '#374151',
          fontWeight: 600,
          fontSize: '14px',
          py: 2,
          px: 2.5,
          borderRadius: 0,
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <span>Transcript</span>
        </Box>
      </Button>

      {/* Collapsible content */}
      <Collapse in={expanded}>
        <Box
          sx={{
            borderTop: '1px solid #E5E7EB',
            p: 2.5,
          }}
        >
          {/* Copy button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="text"
              size="small"
              startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={handleCopy}
              sx={{
                textTransform: 'none',
                color: copied ? 'success.main' : 'text.secondary',
              }}
            >
              {copied ? 'Copied!' : 'Copy transcript'}
            </Button>
          </Box>

          {/* Transcript content */}
          <Box
            sx={{
              maxHeight: '500px',
              overflow: 'auto',
              backgroundColor: '#FAFAFA',
              borderRadius: '8px',
              p: 2,
            }}
          >
            {renderTranscript()}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default TranscriptSection;
