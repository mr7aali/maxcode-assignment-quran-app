import type { ReciterKey } from './audio.types';

export type ArabicFont = 'KFGQPC' | 'Amiri' | 'Scheherazade';

export interface AppSettings {
  arabicFont: ArabicFont;
  arabicFontSize: number;
  translationFontSize: number;
  showTranslation: boolean;
  reciter: ReciterKey;
}
