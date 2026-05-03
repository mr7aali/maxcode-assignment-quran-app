import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: 'gold' | 'teal' | 'muted';
}

const toneClass = {
  gold: 'border-accent-gold/40 bg-accent-gold/15 text-accent-gold-light',
  teal: 'border-accent-teal/40 bg-accent-teal/15 text-accent-teal',
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
