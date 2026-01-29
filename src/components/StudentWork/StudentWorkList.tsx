'use client';

import { Box, Typography } from '@mui/material';
import { FileText } from 'lucide-react';
import { AttachmentItem } from './AttachmentItem';
import type { StudentWork, Attachment } from '@/types/student';

interface StudentWorkListProps {
  works: StudentWork[];
  onAttachmentAction?: (attachment: Attachment) => void;
}

function WorkItem({
  work,
  onAttachmentAction,
}: {
  work: StudentWork;
  onAttachmentAction?: (attachment: Attachment) => void;
}) {
  return (
    <Box className="border border-neutral-200 rounded-lg p-4">
      <Box className="flex items-start gap-3 mb-3">
        <Box className="p-2 bg-neutral-100 rounded-lg flex-shrink-0">
          <FileText size={20} className="text-neutral-600" />
        </Box>
        <Box>
          <Typography className="font-medium text-neutral-900">
            {work.title}
          </Typography>
          <Typography className="text-xs text-neutral-500">
            {work.dateRange} • {work.category}
          </Typography>
        </Box>
      </Box>

      <Typography className="text-sm text-neutral-600 mb-4 leading-relaxed">
        {work.description}
      </Typography>

      {work.attachments.length > 0 && (
        <Box className="space-y-2">
          {work.attachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              onAction={() => onAttachmentAction?.(attachment)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function StudentWorkList({
  works,
  onAttachmentAction,
}: StudentWorkListProps) {
  return (
    <Box>
      <Typography
        component="h3"
        sx={{
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 600,
          fontSize: '22px',
          color: '#111827',
          mb: 2,
        }}
      >
        Student work
      </Typography>
      {works.length === 0 ? (
        <Typography className="text-neutral-500 text-sm py-4">
          No student work added yet.
        </Typography>
      ) : (
        <Box className="space-y-4">
          {works.map((work) => (
            <WorkItem
              key={work.id}
              work={work}
              onAttachmentAction={onAttachmentAction}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default StudentWorkList;
