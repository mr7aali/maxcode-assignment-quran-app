'use client';

import { cn } from '@/lib/utils';

interface AudioProgressProps {
  progress: number;
  onSeek: (value: number) => void;
  className?: string;
}

export function AudioProgress({ progress, onSeek, className }: AudioProgressProps) {
  return (
    <input
      aria-label="Audio progress"
      className={cn('audio-slider h-1 w-full cursor-pointer accent-accent-gold', className)}
      min={0}
      max={100}
      step={0.1}
      type="range"
      value={Number.isFinite(progress) ? progress : 0}
      onChange={(event) => onSeek(Number(event.currentTarget.value))}
    />
  );
}
