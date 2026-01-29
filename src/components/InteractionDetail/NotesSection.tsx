'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FileText, Bold, Italic, List, ListOrdered, Heading2, Sparkles } from 'lucide-react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { SectionCard } from '@/components/shared';
import { Slate } from '@/theme/primitives';
import { MEETING_TEMPLATES, OTHER_MEETING_TEMPLATE } from '@/lib/meetingTemplates';

interface NotesSectionProps {
  notes?: string;
  onNotesChange?: (notes: string) => void;
  label?: string;
  placeholder?: string;
  showGenerateButton?: boolean;
  onGenerate?: () => void;
  readOnly?: boolean;
  isGenerating?: boolean;
  icon?: React.ReactNode;
  // Template selection props (for talking points mode)
  showTemplateSelector?: boolean;
  currentTemplateId?: string;
  onSelectTemplate?: (templateId: string) => void;
  onGenerateCustom?: (prompt: string) => void;
  // Initial custom prompt (pre-populated when "Other" was selected at creation)
  initialCustomPrompt?: string;
}

function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        p: 1,
        borderBottom: `1px solid ${Slate[200]}`,
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
      }}
    >
      <Tooltip title="Bold">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          sx={{
            backgroundColor: editor.isActive('bold') ? Slate[200] : 'transparent',
            '&:hover': { backgroundColor: Slate[100] },
          }}
        >
          <Bold size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          sx={{
            backgroundColor: editor.isActive('italic') ? Slate[200] : 'transparent',
            '&:hover': { backgroundColor: Slate[100] },
          }}
        >
          <Italic size={16} />
        </IconButton>
      </Tooltip>
      <Box sx={{ width: '1px', backgroundColor: Slate[200], mx: 0.5 }} />
      <Tooltip title="Heading">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          sx={{
            backgroundColor: editor.isActive('heading', { level: 2 }) ? Slate[200] : 'transparent',
            '&:hover': { backgroundColor: Slate[100] },
          }}
        >
          <Heading2 size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bullet List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          sx={{
            backgroundColor: editor.isActive('bulletList') ? Slate[200] : 'transparent',
            '&:hover': { backgroundColor: Slate[100] },
          }}
        >
          <List size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          sx={{
            backgroundColor: editor.isActive('orderedList') ? Slate[200] : 'transparent',
            '&:hover': { backgroundColor: Slate[100] },
          }}
        >
          <ListOrdered size={16} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export function NotesSection({
  notes = '',
  onNotesChange,
  label = 'Summary',
  placeholder = 'Add a summary of your interaction...',
  showGenerateButton = false,
  onGenerate,
  readOnly = false,
  isGenerating = false,
  icon,
  // Template selector props
  showTemplateSelector = false,
  currentTemplateId,
  onSelectTemplate,
  onGenerateCustom,
  initialCustomPrompt = '',
}: NotesSectionProps) {
  const [customPrompt, setCustomPrompt] = useState(initialCustomPrompt);

  // Whether "Other" is selected
  const isOtherSelected = currentTemplateId === 'other';

  const handleTemplateChange = (templateId: string) => {
    onSelectTemplate?.(templateId);
    // Clear custom prompt when switching away from "Other"
    if (templateId !== 'other') {
      setCustomPrompt('');
    }
  };

  const handleGenerateCustom = () => {
    if (onGenerateCustom && customPrompt.trim().length >= 10) {
      onGenerateCustom(customPrompt);
    }
  };

  const canGenerateCustom = customPrompt.trim().length >= 10 && !isGenerating;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: notes,
    editable: !readOnly,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    onUpdate: ({ editor }) => {
      onNotesChange?.(editor.getHTML());
    },
  });

  // Update editor content when notes prop changes externally
  useEffect(() => {
    if (editor && notes !== editor.getHTML()) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]);

  // Update editable state when readOnly changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  return (
    <SectionCard
      title={label}
      icon={icon || <FileText size={18} />}
    >
      {/* Template Selector (when enabled) */}
      {showTemplateSelector && !readOnly && (
        <Box sx={{ mb: 3 }}>
          {/* Meeting Type Dropdown */}
          <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 1.5 }}>
            Choose a meeting type to pre-fill your talking points.
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel
              sx={{
                fontSize: '14px',
                color: '#6B7280',
                '&.Mui-focused': {
                  color: '#062F29',
                },
              }}
            >
              Select meeting type
            </InputLabel>
            <Select
              value={currentTemplateId || ''}
              onChange={(e) => handleTemplateChange(e.target.value)}
              label="Select meeting type"
              disabled={isGenerating}
              sx={{
                fontSize: '14px',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#062F29',
                },
              }}
            >
              {MEETING_TEMPLATES.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      {template.name}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                      {template.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              {/* Other option */}
              <MenuItem value={OTHER_MEETING_TEMPLATE.id}>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                    {OTHER_MEETING_TEMPLATE.name}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                    {OTHER_MEETING_TEMPLATE.description}
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Custom prompt input - only show when "Other" is selected */}
          {isOtherSelected && (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1,
                }}
              >
                Meeting Purpose <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
              </Typography>
              <TextField
                placeholder="Describe what you want to discuss... (e.g., 'Focus on college application deadlines and financial aid options')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                fullWidth
                multiline
                rows={3}
                size="small"
                disabled={isGenerating}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB',
                    '& fieldset': {
                      borderColor: '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#062F29',
                    },
                  },
                }}
              />
              {customPrompt.trim().length >= 10 && (
                <Button
                  variant="outlined"
                  onClick={handleGenerateCustom}
                  disabled={!canGenerateCustom}
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : (
                      <Sparkles size={14} />
                    )
                  }
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    borderColor: '#D1D5DB',
                    color: '#374151',
                    borderRadius: '8px',
                    py: 0.75,
                    '&:hover': {
                      borderColor: '#062F29',
                      backgroundColor: '#F9FAFB',
                    },
                    '&.Mui-disabled': {
                      borderColor: '#E5E7EB',
                      color: '#9CA3AF',
                    },
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Talking Points'}
                </Button>
              )}
              <Typography sx={{ fontSize: '12px', color: '#9CA3AF', mt: 1 }}>
                {customPrompt.trim().length >= 10
                  ? 'Click the button above to generate AI talking points based on your description.'
                  : 'Enter at least 10 characters to generate AI talking points, or leave empty for a blank notes section.'}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Editor */}
      <Box
        sx={{
          border: `1px solid ${Slate[200]}`,
          borderRadius: '4px',
          backgroundColor: readOnly ? '#F9FAFB' : 'white',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: readOnly ? Slate[200] : Slate[300],
          },
          '&:focus-within': {
            borderColor: Slate[400],
          },
        }}
      >
        {!readOnly && <MenuBar editor={editor} />}
        <Box
          sx={{
            minHeight: readOnly ? 'auto' : '200px',
            maxHeight: readOnly ? '400px' : '350px',
            overflow: 'auto',
            p: 2,
            '& .tiptap': {
              outline: 'none',
              fontSize: '14px',
              lineHeight: 1.7,
              fontFamily: 'Inter, sans-serif',
              '& p': {
                margin: 0,
                marginBottom: '0.5em',
                fontSize: '14px',
              },
              '& h2': {
                fontSize: '14px',
                fontWeight: 600,
                marginTop: '1em',
                marginBottom: '0.5em',
              },
              '& h3': {
                fontSize: '14px',
                fontWeight: 600,
                marginTop: '0.75em',
                marginBottom: '0.5em',
              },
              '& ul, & ol': {
                paddingLeft: '1.5em',
                marginBottom: '0.5em',
                fontSize: '14px',
              },
              '& li': {
                marginBottom: '0.25em',
                fontSize: '14px',
              },
              '& strong': {
                fontWeight: 600,
              },
              '& em': {
                fontStyle: 'italic',
              },
              '& p.is-editor-empty:first-child::before': {
                content: 'attr(data-placeholder)',
                color: '#9CA3AF',
                float: 'left',
                height: 0,
                pointerEvents: 'none',
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
        {showGenerateButton && !readOnly && (
          <Box
            sx={{
              borderTop: `1px solid ${Slate[200]}`,
              p: 1.5,
              backgroundColor: '#FAFAFA',
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px',
            }}
          >
            <Button
              variant="outlined"
              startIcon={
                isGenerating ? (
                  <CircularProgress size={16} sx={{ color: '#12B76A' }} />
                ) : (
                  <Sparkles size={16} color="#12B76A" />
                )
              }
              onClick={onGenerate}
              disabled={isGenerating}
              sx={{
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                borderColor: '#E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white',
                px: 2,
                py: 0.75,
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                },
                '&:disabled': {
                  borderColor: '#E5E7EB',
                  backgroundColor: '#F9FAFB',
                  color: '#9CA3AF',
                },
              }}
            >
              {isGenerating
                ? 'Generating...'
                : notes && notes.replace(/<[^>]*>/g, '').trim()
                  ? 'Re-generate talking points'
                  : 'Generate talking points'}
            </Button>
          </Box>
        )}
      </Box>
    </SectionCard>
  );
}

export default NotesSection;
