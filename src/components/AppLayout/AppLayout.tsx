'use client';

import { Box } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import { BreadcrumbsBar, BreadcrumbItem } from '@/components/Breadcrumbs';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  currentStudentId?: string;
  breadcrumbs?: BreadcrumbItem[];
  actionButton?: ReactNode;
}

const GAP = 12; // Gap between surfaces in pixels
const BANNER_HEIGHT = 56; // Transcription banner height
const BANNER_BOTTOM_MARGIN = 12; // Banner margin from viewport bottom

export function AppLayout({
  children,
  rightPanel,
  currentStudentId,
  breadcrumbs = [],
  actionButton,
}: AppLayoutProps) {
  const { activeMeeting } = useActiveMeetingContext();
  const isBannerVisible = activeMeeting?.phase === 'recording';

  // When banner is visible, reduce height to make room for it
  const bannerSpace = isBannerVisible ? BANNER_HEIGHT + BANNER_BOTTOM_MARGIN + GAP : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        height: isBannerVisible ? `calc(100vh - ${bannerSpace}px)` : '100vh',
        overflow: 'hidden',
        transition: 'height 0.2s ease',
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
          minHeight: 0,
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
            minHeight: 0,
          }}
        >
          {/* Breadcrumbs Bar */}
          <Box
            sx={{
              flexShrink: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
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
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
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
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
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
