'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span className="tooltip-text pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-bg-tertiary px-2 py-1 text-xs text-text-primary opacity-0 shadow-xl transition group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}
