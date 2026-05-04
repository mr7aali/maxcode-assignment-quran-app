'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  compactLabel?: boolean;
}

export function ThemeToggle({ className, compactLabel = true }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={!isDark}
      className={cn(
        'relative h-8 w-16 rounded-full border border-[var(--border-default)] shadow-[var(--shadow-sm)] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold',
        isDark ? 'bg-[#1A1D27]' : 'bg-[#EDE7D9]',
        className,
      )}
      onClick={toggleTheme}
    >
      <span className="absolute inset-0 flex items-center justify-between px-2">
        <Moon
          className={cn(
            'h-4 w-4 transition-opacity duration-300',
            isDark ? 'text-slate-300 opacity-100' : 'text-text-muted opacity-35',
          )}
        />
        <Sun
          className={cn(
            'h-4 w-4 transition-opacity duration-300',
            isDark ? 'text-text-muted opacity-35' : 'text-amber-600 opacity-100',
          )}
        />
      </span>
      <span
        className={cn(
          'absolute top-1 h-6 w-6 rounded-full bg-white shadow-[var(--shadow-md)] transition-transform duration-300 ease-out',
          isDark ? 'translate-x-0.5' : 'translate-x-8',
        )}
      />
      {!compactLabel && (
        <span className="sr-only">{isDark ? 'Dark theme enabled' : 'Light theme enabled'}</span>
      )}
    </button>
  );
}
