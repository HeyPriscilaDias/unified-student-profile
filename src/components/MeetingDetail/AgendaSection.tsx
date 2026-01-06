'use client';

import { Box, Typography, Button, Chip } from '@mui/material';
import { ListChecks, CheckCircle, Circle, Clock, Sparkles, Edit } from 'lucide-react';
import { SectionCard } from '@/components/shared';
import type { AgendaItem } from '@/types/student';

interface AgendaSectionProps {
  agenda: AgendaItem[];
  isEditable?: boolean;
  onEditAgenda?: () => void;
}

export function AgendaSection({ agenda, isEditable = false, onEditAgenda }: AgendaSectionProps) {
  if (agenda.length === 0) {
    return (
      <SectionCard
        title="Agenda"
        icon={<ListChecks size={18} />}
        action={
          isEditable && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit size={14} />}
              onClick={onEditAgenda}
              sx={{ textTransform: 'none' }}
            >
              Add items
            </Button>
          )
        }
      >
        <Typography className="text-sm text-neutral-500 py-4 text-center">
          No agenda items yet
        </Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Agenda"
      icon={<ListChecks size={18} />}
      action={
        isEditable && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Edit size={14} />}
            onClick={onEditAgenda}
            sx={{ textTransform: 'none' }}
          >
            Edit
          </Button>
        )
      }
    >
      <Box className="flex flex-col">
        {agenda.map((item, index) => (
          <Box
            key={item.id}
            className="flex gap-3 py-4 border-b border-neutral-100 last:border-b-0"
          >
            {/* Status icon */}
            <Box className="flex-shrink-0 mt-0.5">
              {item.covered ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <Circle size={20} className="text-neutral-300" />
              )}
            </Box>

            {/* Content */}
            <Box className="flex-1 min-w-0">
              <Box className="flex items-center gap-2 mb-1">
                <Typography className="font-medium text-neutral-900 text-sm">
                  {index + 1}. {item.topic}
                </Typography>
                {item.source === 'ai_recommended' && (
                  <Chip
                    icon={<Sparkles size={12} />}
                    label="AI Suggested"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      color: '#B45309',
                      '& .MuiChip-icon': { color: '#B45309' },
                    }}
                  />
                )}
              </Box>

              {item.description && (
                <Typography className="text-sm text-neutral-600 mb-2">
                  {item.description}
                </Typography>
              )}

              {item.sourceReason && (
                <Typography className="text-xs text-neutral-500 italic mb-2">
                  {item.sourceReason}
                </Typography>
              )}

              {item.notes && (
                <Box className="bg-neutral-50 rounded-md p-2 mt-2">
                  <Typography className="text-xs font-medium text-neutral-500 mb-1">
                    Notes:
                  </Typography>
                  <Typography className="text-sm text-neutral-700">
                    {item.notes}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Duration */}
            {item.duration && (
              <Box className="flex items-center gap-1 text-neutral-400 flex-shrink-0">
                <Clock size={12} />
                <Typography className="text-xs">{item.duration} min</Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </SectionCard>
  );
}

export default AgendaSection;
