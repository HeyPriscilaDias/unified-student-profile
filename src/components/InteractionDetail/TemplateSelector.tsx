'use client';

import { Box, Chip, Typography } from '@mui/material';
import { LayoutTemplate } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import { MEETING_TEMPLATES } from '@/lib/meetingTemplates';

interface TemplateSelectorProps {
  currentTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
  disabled?: boolean;
}

export function TemplateSelector({ currentTemplateId, onSelectTemplate, disabled }: TemplateSelectorProps) {
  return (
    <SectionCard title="Meeting template" icon={<LayoutTemplate size={18} />}>
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
    </SectionCard>
  );
}

export default TemplateSelector;
