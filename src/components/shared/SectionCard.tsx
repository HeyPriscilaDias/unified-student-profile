'use client';

import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function SectionCard({
  title,
  icon,
  action,
  children,
  className = '',
  noPadding = false,
}: SectionCardProps) {
  return (
    <Box
      className={className}
      sx={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      {(title || icon || action) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            {title && (
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
            )}
          </Box>
          {action}
        </Box>
      )}
      <Box sx={{ p: noPadding ? 0 : 3 }}>
        {children}
      </Box>
    </Box>
  );
}

export default SectionCard;
