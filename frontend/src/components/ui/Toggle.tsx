'use client';

import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-12 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold',
        checked ? 'border-accent-gold bg-accent-gold/30' : 'border-border-default bg-bg-tertiary',
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-5 w-5 rounded-full bg-text-primary transition',
          checked ? 'left-6 bg-accent-gold-light' : 'left-1',
        )}
      />
    </button>
  );
}
