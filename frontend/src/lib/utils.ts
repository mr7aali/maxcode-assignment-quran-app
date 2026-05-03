import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ArabicFont } from '@/types/settings.types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function padNumber(value: number): string {
  return value.toString().padStart(3, '0');
}

export function arabicFontClass(font: ArabicFont): string {
  if (font === 'Amiri') {
    return 'arabic-amiri';
  }

  if (font === 'Scheherazade') {
    return 'arabic-scheherazade';
  }

  return 'arabic-text';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
