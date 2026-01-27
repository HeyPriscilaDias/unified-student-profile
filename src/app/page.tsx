'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AppLayout } from '@/components/AppLayout';
import { SidePanel } from '@/components/SidePanel';

export default function Home() {
  const [sidePanelTab, setSidePanelTab] = useState<'alma' | 'tasks'>('alma');

  return (
    <AppLayout
      rightPanel={
        <SidePanel
          studentFirstName=""
          tasks={[]}
          suggestedActions={[]}
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
