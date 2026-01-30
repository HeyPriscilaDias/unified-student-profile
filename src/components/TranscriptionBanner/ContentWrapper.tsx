'use client';

import { Box } from '@mui/material';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';

interface ContentWrapperProps {
  children: React.ReactNode;
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  const { activeMeeting } = useActiveMeetingContext();

  // Add bottom padding when banner is visible (recording phase only)
  const hasBanner = activeMeeting && activeMeeting.phase === 'recording';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        paddingBottom: hasBanner ? '80px' : 0, // 56px banner + 12px bottom margin + 12px extra
        transition: 'padding-bottom 0.2s ease',
      }}
    >
      {children}
    </Box>
  );
}

export default ContentWrapper;
