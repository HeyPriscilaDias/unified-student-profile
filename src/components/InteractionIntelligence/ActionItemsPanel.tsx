'use client';

import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import { Plus, X, Check, Edit2, ListTodo } from 'lucide-react';
import { useState } from 'react';
import type { ExtractedActionItem } from '@/lib/geminiService';
import { SectionCard } from '@/components/shared';

interface ActionItemsPanelProps {
  actionItems: ExtractedActionItem[];
  onActionItemsChange: (items: ExtractedActionItem[]) => void;
  onAddCounselorTask: (text: string) => void;
  onAddStudentTask: (text: string) => void;
}

function ActionItemRow({
  item,
  onEdit,
  onAdd,
  onDismiss,
  addLabel,
}: {
  item: ExtractedActionItem;
  onEdit: (text: string) => void;
  onAdd: () => void;
  onDismiss: () => void;
  addLabel: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [isDismissing, setIsDismissing] = useState(false);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss();
    }, 500);
  };

  if (item.status === 'added') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 1,
          px: 1.5,
          borderRadius: '6px',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
        }}
      >
        <Check size={16} color="#22C55E" />
        <Typography sx={{ fontSize: '13px', color: '#15803D', flex: 1 }}>
          {item.text}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: '#22C55E', fontWeight: 500 }}>
          Added to {item.assignee === 'student' ? 'student tasks' : 'my tasks'}
        </Typography>
      </Box>
    );
  }

  if (item.status === 'dismissed') {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.5,
        px: 1.5,
        borderRadius: '6px',
        backgroundColor: isDismissing ? '#FEF2F2' : '#FAFAFA',
        border: `1px solid ${isDismissing ? '#FECACA' : '#E5E7EB'}`,
        opacity: isDismissing ? 0 : 1,
        transform: isDismissing ? 'translateX(-10px)' : 'translateX(0)',
        transition: 'all 0.4s ease-out',
        '&:hover': {
          backgroundColor: isDismissing ? '#FEF2F2' : '#F5F5F5',
        },
      }}
    >
      {isEditing ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            size="small"
            fullWidth
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setEditText(item.text);
                setIsEditing(false);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': { fontSize: '13px' },
            }}
          />
          <IconButton size="small" onClick={handleSave}>
            <Check size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setEditText(item.text);
              setIsEditing(false);
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              flex: 1,
              fontSize: '13px',
              color: isDismissing ? '#9CA3AF' : '#374151',
              cursor: isDismissing ? 'default' : 'pointer',
              textDecoration: isDismissing ? 'line-through' : 'none',
              transition: 'all 0.2s ease-out',
              '&:hover': { textDecoration: isDismissing ? 'line-through' : 'underline' },
            }}
            onClick={() => !isDismissing && setIsEditing(true)}
          >
            {item.text}
          </Typography>
          {!isDismissing && (
            <>
              <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
                sx={{ color: '#9CA3AF', '&:hover': { color: '#6B7280' } }}
              >
                <Edit2 size={14} />
              </IconButton>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Plus size={14} />}
                onClick={onAdd}
                sx={{
                  textTransform: 'none',
                  fontSize: '12px',
                  py: 0.5,
                  px: 1,
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                {addLabel}
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={handleDismiss}
                sx={{
                  textTransform: 'none',
                  fontSize: '12px',
                  py: 0.5,
                  px: 1,
                  color: '#9CA3AF',
                  minWidth: 'auto',
                  '&:hover': {
                    color: '#EF4444',
                    backgroundColor: '#FEF2F2',
                  },
                }}
              >
                Dismiss
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export function ActionItemsPanel({
  actionItems,
  onActionItemsChange,
  onAddCounselorTask,
  onAddStudentTask,
}: ActionItemsPanelProps) {
  const counselorItems = actionItems.filter((i) => i.assignee === 'counselor');
  const studentItems = actionItems.filter((i) => i.assignee === 'student');

  const updateItem = (id: string, updates: Partial<ExtractedActionItem>) => {
    onActionItemsChange(
      actionItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAddCounselor = (item: ExtractedActionItem) => {
    onAddCounselorTask(item.text);
    updateItem(item.id, { status: 'added' });
  };

  const handleAddStudent = (item: ExtractedActionItem) => {
    onAddStudentTask(item.text);
    updateItem(item.id, { status: 'added' });
  };

  const handleDismiss = (id: string) => {
    updateItem(id, { status: 'dismissed' });
  };

  const handleEdit = (id: string, text: string) => {
    updateItem(id, { text });
  };

  const pendingCounselor = counselorItems.filter((i) => i.status === 'pending');
  const addedCounselor = counselorItems.filter((i) => i.status === 'added');
  const pendingStudent = studentItems.filter((i) => i.status === 'pending');
  const addedStudent = studentItems.filter((i) => i.status === 'added');

  const totalPending = actionItems.filter((i) => i.status === 'pending').length;
  const hasAnyItems =
    pendingCounselor.length > 0 ||
    addedCounselor.length > 0 ||
    pendingStudent.length > 0 ||
    addedStudent.length > 0;

  if (!hasAnyItems) {
    return null;
  }

  return (
    <SectionCard
      title="Suggested Action Items"
      icon={<ListTodo size={18} />}
      action={
        totalPending > 0 ? (
          <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
            {totalPending} pending
          </Typography>
        ) : undefined
      }
    >
      <Box>
        {/* Counselor Tasks */}
        {(pendingCounselor.length > 0 || addedCounselor.length > 0) && (
          <Box sx={{ mb: pendingStudent.length > 0 || addedStudent.length > 0 ? 3 : 0 }}>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1.5,
              }}
            >
              Your Tasks
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {pendingCounselor.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  onEdit={(text) => handleEdit(item.id, text)}
                  onAdd={() => handleAddCounselor(item)}
                  onDismiss={() => handleDismiss(item.id)}
                  addLabel="Add to my tasks"
                />
              ))}
              {addedCounselor.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => {}}
                  onAdd={() => {}}
                  onDismiss={() => {}}
                  addLabel=""
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Student Tasks */}
        {(pendingStudent.length > 0 || addedStudent.length > 0) && (
          <Box>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1.5,
              }}
            >
              Student Tasks
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {pendingStudent.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  onEdit={(text) => handleEdit(item.id, text)}
                  onAdd={() => handleAddStudent(item)}
                  onDismiss={() => handleDismiss(item.id)}
                  addLabel="Add to student tasks"
                />
              ))}
              {addedStudent.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => {}}
                  onAdd={() => {}}
                  onDismiss={() => {}}
                  addLabel=""
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </SectionCard>
  );
}

export default ActionItemsPanel;
