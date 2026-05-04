'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface AudioProgressProps {
  progress: number;
  onSeek: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

type ProgressStyle = CSSProperties & {
  '--progress-left': string;
  '--progress-width': string;
};

function getSafeProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(Math.max(progress, 0), 100);
}

export function AudioProgress({
  progress,
  onSeek,
  className,
  disabled = false,
}: AudioProgressProps) {
  const safeProgress = getSafeProgress(progress);
  const style: ProgressStyle = {
    '--progress-left': `${safeProgress}%`,
    '--progress-width': `${safeProgress}%`,
  };

  return (
    <div className={cn('relative h-5 w-full', disabled && 'opacity-60', className)} style={style}>
      <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 overflow-hidden rounded-full bg-border-default">
        <div className="h-full w-[var(--progress-width)] rounded-full bg-accent-gold transition-[width] duration-100 ease-linear" />
      </div>
      <span className="pointer-events-none absolute left-[var(--progress-left)] top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bg-elevated bg-accent-gold shadow-[0_1px_6px_rgba(45,58,51,0.22)] transition-[left] duration-100 ease-linear" />
      <input
        aria-label="Audio progress"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
        disabled={disabled}
        min={0}
        max={100}
        step={0.01}
        type="range"
        value={safeProgress}
        onChange={(event) => onSeek(Number(event.currentTarget.value))}
      />
    </div>
  );
}
