'use client';

import { useRef, useCallback, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Slate } from '@/theme/primitives';

interface SimpleTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxHeight?: number | string;
  className?: string;
}

export function SimpleTextEditor({
  value,
  onChange,
  placeholder = '',
  minRows = 8,
  maxHeight = 400,
  className = '',
}: SimpleTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value changes to the editor
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  }, [handleInput]);

  const handleBold = useCallback(() => {
    execCommand('bold');
  }, [execCommand]);

  const handleItalic = useCallback(() => {
    execCommand('italic');
  }, [execCommand]);

  const handleBulletList = useCallback(() => {
    execCommand('insertUnorderedList');
  }, [execCommand]);

  const handleNumberedList = useCallback(() => {
    execCommand('insertOrderedList');
  }, [execCommand]);

  const buttonStyle = {
    width: 32,
    height: 32,
    borderRadius: '6px',
    color: Slate[600],
    '&:hover': {
      backgroundColor: Slate[200],
      color: Slate[800],
    },
  };

  return (
    <Box
      className={className}
      sx={{
        border: `1px solid ${Slate[200]}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
        '&:focus-within': {
          borderColor: Slate[400],
        },
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderBottom: `1px solid ${Slate[200]}`,
          backgroundColor: Slate[50],
        }}
      >
        <Tooltip title="Bold" placement="top">
          <IconButton size="small" onMouseDown={(e) => e.preventDefault()} onClick={handleBold} sx={buttonStyle}>
            <Bold size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic" placement="top">
          <IconButton size="small" onMouseDown={(e) => e.preventDefault()} onClick={handleItalic} sx={buttonStyle}>
            <Italic size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bullet list" placement="top">
          <IconButton size="small" onMouseDown={(e) => e.preventDefault()} onClick={handleBulletList} sx={buttonStyle}>
            <List size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered list" placement="top">
          <IconButton size="small" onMouseDown={(e) => e.preventDefault()} onClick={handleNumberedList} sx={buttonStyle}>
            <ListOrdered size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editable content area */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        sx={{
          minHeight: `${minRows * 1.7}em`,
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          padding: '12px',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          color: '#374151',
          backgroundColor: 'transparent',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          '&:empty:before': {
            content: 'attr(data-placeholder)',
            color: Slate[400],
            pointerEvents: 'none',
          },
          '& ul, & ol': {
            marginLeft: '1.5em',
            paddingLeft: 0,
          },
          '& li': {
            marginBottom: '0.25em',
          },
        }}
      />
    </Box>
  );
}

export default SimpleTextEditor;
