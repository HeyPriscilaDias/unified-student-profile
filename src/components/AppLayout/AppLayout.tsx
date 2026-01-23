'use client';

import { Box } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  currentStudentId?: string;
}

export function AppLayout({ children, rightPanel, currentStudentId }: AppLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#FBFBFB',
      }}
    >
      {/* Sidebar */}
      <Sidebar currentStudentId={currentStudentId} />

      {/* Main Content Area */}
      <Box
        sx={{
          marginLeft: '220px', // Sidebar width
          marginRight: rightPanel ? '398px' : 0, // Right panel width (350px content + 48px tabs)
          flex: 1,
          minWidth: 0, // Allow flex shrinking
          overflow: 'hidden', // Prevent children from pushing out
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Centered Container with 32px margins */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 'calc(100% - 64px)', // 32px margin on each side
            mx: '32px',
            minWidth: 0, // Allow content to shrink
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Right Panel */}
      {rightPanel}
    </Box>
  );
}

export default AppLayout;
