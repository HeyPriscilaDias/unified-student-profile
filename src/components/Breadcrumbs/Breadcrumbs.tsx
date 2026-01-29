'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { NewMeetingModal } from '@/components/SidePanel/StudentPickerModal';
import { useInteractionsContext } from '@/contexts/InteractionsContext';
import { useActiveMeetingContext } from '@/contexts/ActiveMeetingContext';
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
  const { addInteraction, updateInteractionTalkingPoints, updateInteractionTemplate, updateInteractionCustomPrompt } = useInteractionsContext();
  const { startMeeting } = useActiveMeetingContext();

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
      meetingTitle = `${template.name} — ${studentName.split(' ')[0]}`;
    } else if (isOther) {
      meetingTitle = `Meeting with ${studentName.split(' ')[0]}`;
    } else if (options?.customTalkingPoints) {
      meetingTitle = `Custom Meeting — ${studentName.split(' ')[0]}`;
    } else {
      meetingTitle = `Meeting with ${studentName.split(' ')[0]}`;
    }

    const newInteraction = addInteraction({
      studentId: selectedStudentId,
      title: meetingTitle,
    });

    // Set talking points from template (not for "Other" - those are generated later)
    const talkingPoints = options?.customTalkingPoints || (template ? templateToHTML(template) : undefined);

    if (talkingPoints) {
      updateInteractionTalkingPoints(selectedStudentId, newInteraction.id, talkingPoints);
    }
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

    startMeeting(selectedStudentId, studentName, newInteraction.id, newInteraction.title, talkingPoints);

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
            variant="contained"
            onClick={() => setIsNewMeetingModalOpen(true)}
            sx={{
              backgroundColor: '#155E4C',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              py: 0.75,
              px: 2,
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0E4A3B',
                boxShadow: 'none',
              },
            }}
          >
            New Meeting
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
