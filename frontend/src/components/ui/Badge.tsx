import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: 'gold' | 'teal' | 'muted';
}

const toneClass = {
  gold: 'border-[var(--accent-gold)] bg-accent-gold-bg text-accent-gold',
  teal: 'border-accent-teal bg-accent-teal-bg text-accent-teal',
  muted: 'border-border-default bg-bg-tertiary text-text-secondary',
} as const;

export function Badge({ children, className, tone = 'muted', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
