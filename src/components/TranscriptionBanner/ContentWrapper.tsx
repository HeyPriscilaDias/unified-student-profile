'use client';

import { Box } from '@mui/material';

interface ContentWrapperProps {
  children: React.ReactNode;
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  // Banner space is now handled by AppLayout height adjustment
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {children}
    </Box>
  );
}

export default ContentWrapper;
