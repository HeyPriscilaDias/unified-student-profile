'use client';

import { Typography } from '@mui/material';
import { CollapsibleSection } from '@/components/shared';

export function NotesSection() {
  return (
    <CollapsibleSection title="Notepad" defaultExpanded={false}>
      <Typography className="text-neutral-500 text-sm">
        Personal notes about this student will be displayed here.
      </Typography>
    </CollapsibleSection>
  );
}

export default NotesSection;
