'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { NewMeetingModal } from '@/components/SidePanel/StudentPickerModal';
import { useInteractionsContext } from '@/contexts/InteractionsContext';
import { MEETING_TEMPLATES, templateToHTML } from '@/lib/meetingTemplates';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsBarProps {
  items: BreadcrumbItem[];
  actionButton?: ReactNode;
}

export function BreadcrumbsBar({ items, actionButton }: BreadcrumbsBarProps) {
  const router = useRouter();
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const { addInteraction, updateInteractionTemplate, updateInteractionCustomPrompt } = useInteractionsContext();

  const handleStartMeeting = (
    selectedStudentId: string,
    studentName: string,
    options?: { templateId?: string; customTalkingPoints?: string; customPrompt?: string }
  ) => {
    setIsNewMeetingModalOpen(false);
    const isOther = options?.templateId === 'other';
    const template = options?.templateId && !isOther ? MEETING_TEMPLATES.find(t => t.id === options.templateId) : undefined;

    // Determine meeting title
    let meetingTitle: string;
    if (template) {
      meetingTitle = template.name;
    } else if (isOther) {
      meetingTitle = 'Meeting';
    } else if (options?.customTalkingPoints) {
      meetingTitle = 'Custom Meeting';
    } else {
      meetingTitle = 'Meeting';
    }

    // Get talking points from template (not for "Other" - those are generated later)
    const talkingPoints = options?.customTalkingPoints || (template ? templateToHTML(template) : undefined);

    const newInteraction = addInteraction({
      studentId: selectedStudentId,
      title: meetingTitle,
      summary: talkingPoints, // Pre-fill summary with talking points so they show on details page
    });
    if (template) {
      updateInteractionTemplate(selectedStudentId, newInteraction.id, template.id);
    }
    // For "Other" template, store the template ID and custom prompt
    if (isOther) {
      updateInteractionTemplate(selectedStudentId, newInteraction.id, 'other');
      if (options?.customPrompt) {
        updateInteractionCustomPrompt(selectedStudentId, newInteraction.id, options.customPrompt);
      }
    }

    // Navigate to the new meeting
    router.push(`/students/${selectedStudentId}/interactions/${newInteraction.id}`);
  };

  return (
    <>
      <Box
        sx={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
        }}
      >
        {/* Breadcrumbs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Home icon */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Home
              size={18}
              color="#6B7280"
              style={{ cursor: 'pointer' }}
            />
          </Link>

          {items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChevronRight size={16} color="#9CA3AF" />
              {item.href ? (
                <Link href={item.href} style={{ textDecoration: 'none' }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#6B7280',
                      '&:hover': {
                        color: '#374151',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ) : (
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {actionButton}
          <Button
            variant="outlined"
            onClick={() => setIsNewMeetingModalOpen(true)}
            startIcon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 6.75C6.66421 6.75 7 6.41421 7 6C7 5.58579 6.66421 5.25 6.25 5.25C5.83579 5.25 5.5 5.58579 5.5 6C5.5 6.41421 5.83579 6.75 6.25 6.75Z" fill="currentColor"/>
                <path d="M9.75 6.75C10.1642 6.75 10.5 6.41421 10.5 6C10.5 5.58579 10.1642 5.25 9.75 5.25C9.33579 5.25 9 5.58579 9 6C9 6.41421 9.33579 6.75 9.75 6.75Z" fill="currentColor"/>
                <path d="M9.75 8.5C9.22479 8.82679 8.61858 9 8 9C7.38142 9 6.77521 8.82679 6.25 8.5M2.82188 13.3819C2.74905 13.4431 2.66025 13.4823 2.56591 13.4949C2.47158 13.5074 2.37562 13.4928 2.28931 13.4527C2.20301 13.4126 2.12994 13.3487 2.07869 13.2685C2.02744 13.1883 2.00014 13.0952 2 13V3C2 2.86739 2.05268 2.74021 2.14645 2.64645C2.24021 2.55268 2.36739 2.5 2.5 2.5H13.5C13.6326 2.5 13.7598 2.55268 13.8536 2.64645C13.9473 2.74021 14 2.86739 14 3V11C14 11.1326 13.9473 11.2598 13.8536 11.3536C13.7598 11.4473 13.6326 11.5 13.5 11.5H5L2.82188 13.3819Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            sx={{
              borderColor: '#D1D5DB',
              color: '#374151',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              py: 0.75,
              px: 2,
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#9CA3AF',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            New 1:1 meeting
          </Button>
        </Box>
      </Box>

      <NewMeetingModal
        open={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        onStartMeeting={handleStartMeeting}
      />
    </>
  );
}

export default BreadcrumbsBar;
