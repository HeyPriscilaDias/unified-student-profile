'use client';

import { Box, Typography } from '@mui/material';
import { SectionCard } from '@/components/shared';

interface StrengthsLanguagesSectionProps {
  interests?: string[];
  strengths: string[];
  languages: string[];
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            px: 1,
            py: 0.5,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: '1px solid #d5d7da',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#414651',
          }}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
}

function LabeledRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: '14px', color: '#535862', width: 150, flexShrink: 0 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export function StrengthsLanguagesSection({
  interests = [],
  strengths,
  languages,
}: StrengthsLanguagesSectionProps) {
  return (
    <SectionCard title="Interests, Strengths & Languages">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {interests.length > 0 && (
          <LabeledRow label="Interests">
            <TagList items={interests} />
          </LabeledRow>
        )}
        {strengths.length > 0 && (
          <LabeledRow label="Strengths">
            <TagList items={strengths} />
          </LabeledRow>
        )}
        {languages.length > 0 && (
          <LabeledRow label="Languages">
            <TagList items={languages} />
          </LabeledRow>
        )}
        {interests.length === 0 && strengths.length === 0 && languages.length === 0 && (
          <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
            No information added yet
          </Typography>
        )}
      </Box>
    </SectionCard>
  );
}

export default StrengthsLanguagesSection;
