'use client';

import { useRef, useEffect } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  isPaused?: boolean;
  barCount?: number;
  barColor?: string;
  width?: number;
  height?: number;
}

export function AudioWaveform({
  isActive,
  isPaused = false,
  barCount = 12,
  barColor = '#EF4444',
  width = 80,
  height = 32,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const barsRef = useRef<number[]>(Array(barCount).fill(0.3));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barWidth = (width - (barCount - 1) * 2) / barCount;
    const maxBarHeight = height - 4;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update bar heights with smooth animation
      barsRef.current = barsRef.current.map((currentHeight) => {
        if (!isActive || isPaused) {
          // Animate down to minimal height when paused or inactive
          return currentHeight + (0.15 - currentHeight) * 0.1;
        }
        // Generate random target and smoothly interpolate
        const target = 0.2 + Math.random() * 0.8;
        return currentHeight + (target - currentHeight) * 0.3;
      });

      // Draw bars
      barsRef.current.forEach((heightRatio, index) => {
        const barHeight = Math.max(4, heightRatio * maxBarHeight);
        const x = index * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isPaused, barCount, barColor, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
      }}
    />
  );
}

export default AudioWaveform;
