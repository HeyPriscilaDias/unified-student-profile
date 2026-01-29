'use client';

import { Box } from '@mui/material';
import { AppLayout } from '@/components/AppLayout';
import { SidePanel } from '@/components/SidePanel';
import { MeetingsGrid } from '@/components/MeetingsGrid';
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
          minHeight: '100vh',
          backgroundColor: '#FBFBFB',
          px: 4,
          py: 4,
        }}
      >
        <MeetingsGrid />
      </Box>
    </AppLayout>
  );
}
