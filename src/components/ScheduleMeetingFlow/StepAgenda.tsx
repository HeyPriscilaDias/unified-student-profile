'use client';

import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { GripVertical, Trash2, Plus, Sparkles, Clock, RefreshCw } from 'lucide-react';
import type { AgendaItem } from '@/types/student';

interface StepAgendaProps {
  agenda: AgendaItem[];
  meetingTitle: string;
  duration: number;
  onAgendaChange: (agenda: AgendaItem[]) => void;
  onTitleChange: (title: string) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function StepAgenda({
  agenda,
  meetingTitle,
  duration,
  onAgendaChange,
  onTitleChange,
  onNext,
  onBack,
  canProceed,
}: StepAgendaProps) {
  const totalAllocatedTime = agenda.reduce((sum, item) => sum + (item.duration || 0), 0);
  const remainingTime = duration - totalAllocatedTime;

  const handleRemoveItem = (id: string) => {
    onAgendaChange(agenda.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<AgendaItem>) => {
    onAgendaChange(
      agenda.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const handleAddItem = () => {
    const newItem: AgendaItem = {
      id: `agenda-new-${Date.now()}`,
      topic: '',
      source: 'counselor_added',
      duration: Math.max(5, remainingTime),
      covered: false,
    };
    onAgendaChange([...agenda.slice(0, -1), newItem, ...agenda.slice(-1)]);
  };

  const handleRegenerate = () => {
    // In a real implementation, this would call an AI endpoint
    console.log('Regenerate agenda');
  };

  return (
    <Box className="p-4 flex flex-col h-full">
      <Box className="flex-1 overflow-y-auto space-y-4">
        {/* Meeting Title */}
        <Box>
          <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
            Meeting Title
          </Typography>
          <TextField
            value={meetingTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter meeting title..."
            fullWidth
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
          />
        </Box>

        {/* Agenda Header */}
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-2">
            <Typography className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Agenda
            </Typography>
            <Box className="flex items-center gap-1 text-xs text-neutral-400">
              <Sparkles size={12} className="text-amber-500" />
              <span>AI-generated</span>
            </Box>
          </Box>
          <Button
            variant="text"
            size="small"
            startIcon={<RefreshCw size={14} />}
            onClick={handleRegenerate}
            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
          >
            Regenerate
          </Button>
        </Box>

        {/* Time budget */}
        <Box className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg">
          <Clock size={14} className="text-neutral-500" />
          <Typography className="text-xs text-neutral-600">
            {totalAllocatedTime} of {duration} min allocated
          </Typography>
          {remainingTime > 0 && (
            <Typography className="text-xs text-amber-600">
              ({remainingTime} min unallocated)
            </Typography>
          )}
          {remainingTime < 0 && (
            <Typography className="text-xs text-red-600">
              ({Math.abs(remainingTime)} min over!)
            </Typography>
          )}
        </Box>

        {/* Agenda Items */}
        <Box className="space-y-2">
          {agenda.map((item, index) => (
            <AgendaItemEditor
              key={item.id}
              item={item}
              index={index}
              onUpdate={(updates) => handleUpdateItem(item.id, updates)}
              onRemove={() => handleRemoveItem(item.id)}
              canRemove={agenda.length > 1}
            />
          ))}
        </Box>

        {/* Add Item Button */}
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddItem}
          fullWidth
          sx={{
            textTransform: 'none',
            borderStyle: 'dashed',
            color: 'text.secondary',
          }}
        >
          Add agenda item
        </Button>
      </Box>

      {/* Actions */}
      <Box className="flex gap-2 pt-4 border-t border-neutral-100 mt-4">
        <Button
          variant="text"
          onClick={onBack}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!canProceed}
          sx={{ textTransform: 'none', flex: 1 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

interface AgendaItemEditorProps {
  item: AgendaItem;
  index: number;
  onUpdate: (updates: Partial<AgendaItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function AgendaItemEditor({ item, index, onUpdate, onRemove, canRemove }: AgendaItemEditorProps) {
  return (
    <Box className="flex items-start gap-2 p-3 border border-neutral-200 rounded-lg bg-white">
      {/* Drag handle (visual only for now) */}
      <Box className="text-neutral-300 cursor-grab mt-2">
        <GripVertical size={16} />
      </Box>

      {/* Content */}
      <Box className="flex-1 space-y-2">
        <Box className="flex items-center gap-2">
          <Typography className="text-xs text-neutral-400 font-medium">
            {index + 1}.
          </Typography>
          <TextField
            value={item.topic}
            onChange={(e) => onUpdate({ topic: e.target.value })}
            placeholder="Topic..."
            variant="standard"
            fullWidth
            sx={{
              '& .MuiInput-root': { fontSize: '0.875rem' },
              '& .MuiInput-root:before': { borderBottom: 'none' },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #E5E7EB' },
            }}
          />
          {item.source === 'ai_recommended' && (
            <Sparkles size={12} className="text-amber-500 flex-shrink-0" />
          )}
        </Box>

        <Box className="flex items-center gap-2">
          <TextField
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Description (optional)..."
            variant="standard"
            fullWidth
            size="small"
            sx={{
              '& .MuiInput-root': { fontSize: '0.75rem', color: 'text.secondary' },
              '& .MuiInput-root:before': { borderBottom: 'none' },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #E5E7EB' },
            }}
          />
        </Box>
      </Box>

      {/* Duration */}
      <Box className="flex items-center gap-1 flex-shrink-0">
        <TextField
          type="number"
          value={item.duration || 0}
          onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
          size="small"
          inputProps={{ min: 1, max: 60, style: { textAlign: 'center' } }}
          sx={{ width: 50, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
        />
        <Typography className="text-xs text-neutral-400">min</Typography>
      </Box>

      {/* Remove button */}
      {canRemove && (
        <IconButton
          size="small"
          onClick={onRemove}
          className="text-neutral-400 hover:text-red-500"
        >
          <Trash2 size={14} />
        </IconButton>
      )}
    </Box>
  );
}

export default StepAgenda;
