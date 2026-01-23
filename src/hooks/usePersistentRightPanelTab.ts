import { useState, useEffect } from 'react';
import type { SidePanelTabType } from '@/components/SidePanel';

const STORAGE_KEY = 'willow-right-panel-active-tab';

/**
 * Hook to persist the right panel tab selection across page navigations.
 * Uses localStorage to remember which tab the user had open.
 */
export function usePersistentRightPanelTab(defaultTab: SidePanelTabType = 'alma') {
  const [activeTab, setActiveTab] = useState<SidePanelTabType>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['alma', 'tasks', 'notes', 'interactions'].includes(stored)) {
        return stored as SidePanelTabType;
      }
    }
    return defaultTab;
  });

  // Persist to localStorage whenever the tab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, activeTab);
    }
  }, [activeTab]);

  return [activeTab, setActiveTab] as const;
}
