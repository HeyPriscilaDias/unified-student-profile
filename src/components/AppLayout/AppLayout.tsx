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
          marginRight: rightPanel ? '420px' : 0, // Right panel width
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Centered Container with 80px margins */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 'calc(100% - 160px)', // 80px margin on each side
            mx: '80px',
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
