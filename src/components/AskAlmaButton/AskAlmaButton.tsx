'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Dialog, DialogContent } from '@mui/material';
import { X, Plus } from 'lucide-react';
import { Alma } from '@willow/icons';
import { AlmaChatPanel } from '@/components/AlmaChatPanel';

interface StudentInfo {
  id: string;
  firstName: string;
  lastName: string;
}

interface AskAlmaButtonProps {
  currentStudent?: StudentInfo;
}

export function AskAlmaButton({ currentStudent }: AskAlmaButtonProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isContextDismissed, setIsContextDismissed] = useState(false);

  // Reset context dismissed state when student changes
  useEffect(() => {
    if (currentStudent) {
      setIsContextDismissed(false);
    }
  }, [currentStudent?.id]);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleDismissContext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsContextDismissed(true);
  };

  const handleAddContext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsContextDismissed(false);
  };

  const showStudentContext = currentStudent && !isContextDismissed;
  const showAddContextOption = currentStudent && isContextDismissed;

  // Format student name as "FirstName L."
  const formatStudentName = (student: StudentInfo) => {
    return `${student.firstName} ${student.lastName.charAt(0)}.`;
  };

  return (
    <>
      {/* Sticky Button */}
      <Box
        onClick={handleOpenPanel}
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 32,
          width: 350,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          backgroundColor: '#ffffff',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
          px: 2.5,
          py: 1.5,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          zIndex: 2147483647,
          isolation: 'isolate',
          '&:hover': {
            boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        {/* Alma Icon */}
        <Alma size={22} color="#062F29" />

        {/* Ask Alma Text */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1F2937',
          }}
        >
          Ask Alma
        </Typography>

        {/* Student Context Tag */}
        {showStudentContext && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              backgroundColor: '#F3F4F6',
              borderRadius: '20px',
              pl: 1.5,
              pr: 0.75,
              py: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                color: '#4B5563',
              }}
            >
              about {formatStudentName(currentStudent)}
            </Typography>
            <IconButton
              size="small"
              onClick={handleDismissContext}
              sx={{
                p: 0.25,
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: '#E5E7EB',
                },
              }}
            >
              <X size={16} />
            </IconButton>
          </Box>
        )}

        {/* Add Student Context Tag */}
        {showAddContextOption && (
          <Box
            onClick={handleAddContext}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: '#F3F4F6',
              borderRadius: '20px',
              px: 1.5,
              py: 0.5,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#E5E7EB',
              },
            }}
          >
            <Plus size={14} color="#6B7280" />
            <Typography
              sx={{
                fontSize: '14px',
                color: '#4B5563',
              }}
            >
              add student context
            </Typography>
          </Box>
        )}
      </Box>

      {/* Alma Chat Panel Dialog */}
      <Dialog
        open={isPanelOpen}
        onClose={handleClosePanel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 80,
            right: 40,
            m: 0,
            width: 420,
            maxWidth: 420,
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'transparent',
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0, height: 600 }}>
          <AlmaChatPanel
            studentFirstName={showStudentContext ? currentStudent.firstName : ''}
            studentId={showStudentContext ? currentStudent.id : undefined}
            isFloating
            onClose={handleClosePanel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AskAlmaButton;
