'use client';

import { Box, Divider } from '@mui/material';
import { AppLayout } from '@/components/AppLayout';
import { SidePanel } from '@/components/SidePanel';
import { MeetingsGrid } from '@/components/MeetingsGrid';
import { StaffDashboard } from '@/components/StaffDashboard';
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
      breadcrumbs={[]}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Staff Dashboard with Student Table */}
        <StaffDashboard />

        {/* Divider */}
        <Divider sx={{ my: 2 }} />

        {/* Recent Meetings Section */}
        <MeetingsGrid />
      </Box>
    </AppLayout>
  );
}
