'use client';

import { useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import { LayoutTemplate, Sparkles } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import { MEETING_TEMPLATES } from '@/lib/meetingTemplates';

interface TemplateSelectorProps {
  currentTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
  onGenerateCustom?: (prompt: string) => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

export function TemplateSelector({
  currentTemplateId,
  onSelectTemplate,
  onGenerateCustom,
  isGenerating = false,
  disabled = false,
}: TemplateSelectorProps) {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'template' | 'custom' | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleGenerate = () => {
    if (onGenerateCustom && customPrompt.trim().length >= 10) {
      onGenerateCustom(customPrompt);
    }
  };

  const canGenerate = customPrompt.trim().length >= 10 && !isGenerating && !disabled;

  return (
    <SectionCard title="Talking points source" icon={<LayoutTemplate size={18} />}>
      {/* Mode Toggle */}
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        size="small"
        fullWidth
        disabled={disabled || isGenerating}
        sx={{
          mb: 2,
          '& .MuiToggleButtonGroup-grouped': {
            border: '1px solid #E5E7EB',
            borderRadius: '8px !important',
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 500,
            py: 0.75,
            '&:not(:first-of-type)': {
              borderLeft: '1px solid #E5E7EB',
              marginLeft: '-1px',
            },
            '&.Mui-selected': {
              backgroundColor: '#062F29',
              color: '#fff',
              borderColor: '#062F29',
              '&:hover': {
                backgroundColor: '#0A4A40',
              },
            },
            '&:not(.Mui-selected)': {
              backgroundColor: '#fff',
              color: '#374151',
              '&:hover': {
                backgroundColor: '#F9FAFB',
              },
            },
          },
        }}
      >
        <ToggleButton value="template">Templates</ToggleButton>
        <ToggleButton value="custom">
          <Sparkles size={14} style={{ marginRight: 6 }} />
          Custom with AI
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Template chips - only show in template mode */}
      {mode === 'template' && (
        <>
          <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 2 }}>
            Choose a template to pre-fill your talking points.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {MEETING_TEMPLATES.map((template) => {
              const isActive = currentTemplateId === template.id;
              return (
                <Chip
                  key={template.id}
                  label={template.name}
                  variant={isActive ? 'filled' : 'outlined'}
                  onClick={() => onSelectTemplate(template.id)}
                  disabled={disabled}
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    ...(isActive
                      ? {
                          backgroundColor: '#062F29',
                          color: '#fff',
                          '&:hover': { backgroundColor: '#0a4a40' },
                        }
                      : {
                          borderColor: '#D1D5DB',
                          color: '#374151',
                          '&:hover': { backgroundColor: '#F3F4F6' },
                        }),
                  }}
                />
              );
            })}
          </Box>
        </>
      )}

      {/* Custom prompt input - only show in custom mode */}
      {mode === 'custom' && (
        <>
          <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 1.5 }}>
            Describe what you want to discuss and AI will generate personalized talking points.
          </Typography>
          <TextField
            placeholder="e.g., 'Focus on college application deadlines and financial aid options for this student'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            disabled={isGenerating || disabled}
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#062F29',
                },
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleGenerate}
            disabled={!canGenerate}
            startIcon={
              isGenerating ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <Sparkles size={14} />
              )
            }
            fullWidth
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 500,
              borderColor: '#D1D5DB',
              color: '#374151',
              borderRadius: '8px',
              py: 0.75,
              '&:hover': {
                borderColor: '#062F29',
                backgroundColor: '#F9FAFB',
              },
              '&.Mui-disabled': {
                borderColor: '#E5E7EB',
                color: '#9CA3AF',
              },
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Talking Points'}
          </Button>
          {customPrompt.trim().length > 0 && customPrompt.trim().length < 10 && (
            <Typography sx={{ fontSize: '12px', color: '#9CA3AF', mt: 1 }}>
              Please enter at least 10 characters to generate talking points.
            </Typography>
          )}
        </>
      )}
    </SectionCard>
  );
}

export default TemplateSelector;
