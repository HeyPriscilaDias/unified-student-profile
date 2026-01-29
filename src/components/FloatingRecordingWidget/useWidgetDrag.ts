'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseWidgetDragOptions {
  initialPosition?: Position;
  widgetWidth?: number;
  widgetHeight?: number;
}

// Helper to get initial position on client
function getInitialPosition(
  initialPosition: Position | undefined,
  widgetWidth: number,
  widgetHeight: number
): Position {
  if (initialPosition) return initialPosition;
  if (typeof window !== 'undefined') {
    return {
      x: window.innerWidth - widgetWidth - 24,
      y: window.innerHeight - widgetHeight - 24,
    };
  }
  return { x: 100, y: 100 }; // Fallback for SSR
}

export function useWidgetDrag({
  initialPosition,
  widgetWidth = 200,
  widgetHeight = 80,
}: UseWidgetDragOptions = {}) {
  // Use a ref to track if we've mounted for proper SSR hydration
  const isMountedRef = useRef(false);

  const [position, setPosition] = useState<Position>(() =>
    getInitialPosition(initialPosition, widgetWidth, widgetHeight)
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  // Mark as mounted after first render
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  const constrainPosition = useCallback((x: number, y: number): Position => {
    const maxX = window.innerWidth - widgetWidth - 8;
    const maxY = window.innerHeight - widgetHeight - 8;
    return {
      x: Math.max(8, Math.min(x, maxX)),
      y: Math.max(8, Math.min(y, maxY)),
    };
  }, [widgetWidth, widgetHeight]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start dragging on left click
    if (e.button !== 0) return;

    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newPosition = constrainPosition(
      dragStartRef.current.posX + deltaX,
      dragStartRef.current.posY + deltaY
    );

    setPosition(newPosition);
  }, [isDragging, constrainPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => constrainPosition(prev.x, prev.y));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [constrainPosition]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
}

export default useWidgetDrag;
