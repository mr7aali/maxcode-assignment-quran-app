'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'ghost' | 'solid' | 'outline';
type ButtonSize = 'sm' | 'md' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
  solid: 'bg-accent-gold text-bg-primary hover:bg-accent-gold-light',
  outline: 'border border-border-default bg-transparent text-text-primary hover:border-accent-gold hover:text-accent-gold',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  icon: 'h-10 w-10 p-0',
};

export function Button({
  children,
  className,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold disabled:pointer-events-none disabled:opacity-40',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
