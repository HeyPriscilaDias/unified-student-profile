'use client';

import { Box } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import { AskAlmaButton } from '@/components/AskAlmaButton';
import { useStudentData } from '@/hooks/useStudentData';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  currentStudentId?: string;
}

export function AppLayout({ children, rightPanel, currentStudentId }: AppLayoutProps) {
  // Get student data if we have a current student ID
  const studentData = useStudentData(currentStudentId || '');

  // Prepare student info for the Alma button
  const currentStudent = currentStudentId && studentData?.student
    ? {
        id: currentStudentId,
        firstName: studentData.student.firstName,
        lastName: studentData.student.lastName,
      }
    : undefined;

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
          marginRight: rightPanel ? '350px' : 0, // Right panel width
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

      {/* Ask Alma Button */}
      <AskAlmaButton currentStudent={currentStudent} />
    </Box>
  );
}

export default AppLayout;
