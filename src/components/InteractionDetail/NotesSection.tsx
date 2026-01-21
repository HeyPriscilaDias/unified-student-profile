'use client';

import { useEffect } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { FileText, Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Alma } from '@/components/icons/AlmaIcon';
import { SectionCard } from '@/components/shared';
import { Slate } from '@/theme/primitives';

interface NotesSectionProps {
  notes?: string;
  onNotesChange?: (notes: string) => void;
  label?: string;
  placeholder?: string;
  showGenerateButton?: boolean;
  onGenerate?: () => void;
  readOnly?: boolean;
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
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
}: NotesSectionProps) {
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
      icon={<FileText size={18} />}
    >
      <Box
        sx={{
          border: `1px solid ${Slate[200]}`,
          borderRadius: '4px',
          backgroundColor: readOnly ? '#F9FAFB' : 'white',
          position: 'relative',
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
            minHeight: readOnly ? '300px' : '250px',
            maxHeight: readOnly ? '300px' : '400px',
            overflow: 'auto',
            p: 2,
            pb: showGenerateButton && !readOnly ? 7 : 2,
            '& .tiptap': {
              outline: 'none',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              fontFamily: 'inherit',
              '& p': {
                margin: 0,
                marginBottom: '0.5em',
              },
              '& h2': {
                fontSize: '1.1rem',
                fontWeight: 600,
                marginTop: '1em',
                marginBottom: '0.5em',
              },
              '& ul, & ol': {
                paddingLeft: '1.5em',
                marginBottom: '0.5em',
              },
              '& li': {
                marginBottom: '0.25em',
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
          <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
            <Button
              variant="outlined"
              startIcon={<Alma size={16} color="#12B76A" />}
              onClick={onGenerate}
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
              }}
            >
              Generate talking points
            </Button>
          </Box>
        )}
      </Box>
    </SectionCard>
  );
}

export default NotesSection;
