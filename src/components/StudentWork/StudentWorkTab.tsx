'use client';

import { Box } from '@mui/material';
import { AIReflectionsSection } from './AIReflectionsSection';
import { StudentWorkList } from './StudentWorkList';
import type { AIReflection, StudentWork, Attachment } from '@/types/student';

interface StudentWorkTabProps {
  reflections: AIReflection[];
  works: StudentWork[];
}

export function StudentWorkTab({
  reflections,
  works,
}: StudentWorkTabProps) {
  const handleAttachmentAction = (attachment: Attachment) => {
    console.log('Attachment action:', attachment.name);
    // In real app, would open link or download file
    if (attachment.type === 'link') {
      window.open(attachment.url, '_blank');
    }
  };

  return (
    <Box>
      <Box sx={{ py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* AI Reflections */}
        <AIReflectionsSection reflections={reflections} />

        {/* Student Work */}
        <StudentWorkList
          works={works}
          onAttachmentAction={handleAttachmentAction}
        />
      </Box>
    </Box>
  );
}

export default StudentWorkTab;
