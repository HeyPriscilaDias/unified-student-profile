'use client';

import { Box, Typography } from '@mui/material';
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsBarProps {
  items: BreadcrumbItem[];
  actionButton?: ReactNode;
}

export function BreadcrumbsBar({ items, actionButton }: BreadcrumbsBarProps) {
  return (
    <Box
      sx={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
      }}
    >
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Home icon */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Home
            size={18}
            color="#6B7280"
            style={{ cursor: 'pointer' }}
          />
        </Link>

        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChevronRight size={16} color="#9CA3AF" />
            {item.href ? (
              <Link href={item.href} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#6B7280',
                    '&:hover': {
                      color: '#374151',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            ) : (
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#374151',
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* Action button */}
      {actionButton && (
        <Box>
          {actionButton}
        </Box>
      )}
    </Box>
  );
}

export default BreadcrumbsBar;
