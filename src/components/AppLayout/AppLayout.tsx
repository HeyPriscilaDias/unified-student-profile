'use client';

import { Box } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import { BreadcrumbsBar, BreadcrumbItem } from '@/components/Breadcrumbs';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  currentStudentId?: string;
  breadcrumbs?: BreadcrumbItem[];
  actionButton?: ReactNode;
}

const GAP = 12; // Gap between surfaces in pixels

export function AppLayout({
  children,
  rightPanel,
  currentStudentId,
  breadcrumbs = [],
  actionButton,
}: AppLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      {/* Level 1: Sidebar */}
      <Sidebar currentStudentId={currentStudentId} />

      {/* Level 2: Everything else - with gaps */}
      <Box
        sx={{
          marginLeft: '220px', // Sidebar width
          flex: 1,
          display: 'flex',
          minWidth: 0,
          padding: `${GAP}px`,
          gap: `${GAP}px`,
        }}
      >
        {/* Left Column: Breadcrumbs + Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: `${GAP}px`,
            minWidth: 0,
          }}
        >
          {/* Breadcrumbs Bar */}
          <Box
            sx={{
              flexShrink: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
            }}
          >
            <BreadcrumbsBar items={breadcrumbs} actionButton={actionButton} />
          </Box>

          {/* Main Content Area */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
            }}
          >
            <Box
              sx={{
                maxWidth: 900,
                mx: 'auto',
                px: 4,
                py: 3,
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>

        {/* Right Panel - Full height */}
        {rightPanel && (
          <Box
            sx={{
              width: 350,
              flexShrink: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {rightPanel}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AppLayout;
