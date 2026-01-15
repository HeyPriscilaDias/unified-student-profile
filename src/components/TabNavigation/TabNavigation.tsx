'use client';

import { Box, Tab, Tabs } from '@mui/material';
import type { TabType } from '@/types/student';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { value: TabType; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'profile', label: 'Profile' },
  { value: 'postsecondary', label: 'Postsecondary Planning' },
  { value: 'student-work', label: 'Student Work' },
  { value: 'activity', label: 'Activity' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const handleChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 'auto',
          '& .MuiTabs-indicator': {
            backgroundColor: '#181D27',
            height: 2,
          },
          '& .MuiTabs-flexContainer': {
            gap: 0,
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: '"Inter", sans-serif',
            color: '#6B7280',
            minHeight: 44,
            padding: '10px 16px',
            '&.Mui-selected': {
              color: '#181D27',
            },
            '&:hover': {
              color: '#414651',
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  );
}

export default TabNavigation;
