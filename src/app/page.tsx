'use client';

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
      breadcrumbs={[]}
    >
      <MeetingsGrid />
    </AppLayout>
  );
}
