'use client';

import { Box, Typography } from '@mui/material';
import { AppLayout } from '@/components/AppLayout';
import { SidePanel } from '@/components/SidePanel';
import { usePersistentRightPanelTab } from '@/hooks/usePersistentRightPanelTab';

export default function Home() {
  const [sidePanelTab, setSidePanelTab] = usePersistentRightPanelTab('alma');

  return (
    <AppLayout
      rightPanel={
        <SidePanel
          activeTab={sidePanelTab}
          onTabChange={setSidePanelTab}
        />
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#FBFBFB',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#6B7280',
            fontWeight: 500,
          }}
        >
          General Context
        </Typography>
      </Box>
    </AppLayout>
  );
}
