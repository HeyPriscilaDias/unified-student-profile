'use client';

import { useState, type ReactNode } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  defaultExpanded?: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  icon,
  badge,
  defaultExpanded = true,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Box
      className={className}
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #D5D7DA',
        overflow: 'hidden',
      }}
    >
      <Box
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography
            component="h3"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: '22px',
              color: '#111827',
            }}
          >
            {title}
          </Typography>
          {badge}
        </Box>
        <IconButton size="small" sx={{ color: '#6B7280' }}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box sx={{ px: 3, pb: 3 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

export default CollapsibleSection;
