'use client';

import { useEffect, useRef } from 'react';
import { Check, Type } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { arabicFontClass, cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { ReciterKey } from '@/types/audio.types';
import type { ArabicFont } from '@/types/settings.types';

const fontOptions: Array<{ value: ArabicFont; label: string }> = [
  { value: 'KFGQPC', label: 'KFGQPC' },
  { value: 'Amiri', label: 'Amiri' },
  { value: 'Scheherazade', label: 'Scheherazade' },
];

const reciters: Array<{ id: ReciterKey; name: string }> = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit Abdus Samad' },
  { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'Minshawi_Murattal_128kbps', name: 'Mohamed Siddiq El-Minshawi' },
];

export function FontPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = useAppStore((state) => state.isFontPanelOpen);
  const settings = useAppStore((state) => state.settings);
  const setFontPanelOpen = useAppStore((state) => state.setFontPanelOpen);
  const setArabicFont = useAppStore((state) => state.setArabicFont);
  const setArabicFontSize = useAppStore((state) => state.setArabicFontSize);
  const setTranslationFontSize = useAppStore((state) => state.setTranslationFontSize);
  const setShowTranslation = useAppStore((state) => state.setShowTranslation);
  const setReciter = useAppStore((state) => state.setReciter);

  useEffect(() => {
    function onPointerDown(event: PointerEvent): void {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setFontPanelOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener('pointerdown', onPointerDown);
    }

    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, setFontPanelOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="fixed right-4 top-16 z-50 w-80 origin-top-right animate-fade-scale rounded-xl border border-border-default bg-bg-surah-list p-4 shadow-[var(--shadow-lg)]"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
        <Type className="h-4 w-4 text-accent-gold" />
        Reader Settings
      </div>

      <div className="space-y-5">
        <section>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
            Arabic Font
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fontOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'flex h-9 items-center justify-center rounded-lg border text-xs transition',
                  settings.arabicFont === option.value
                    ? 'border-accent-gold bg-accent-gold-bg text-accent-gold'
                    : 'border-border-default text-text-secondary hover:bg-bg-secondary',
                )}
                onClick={() => setArabicFont(option.value)}
              >
                {settings.arabicFont === option.value && <Check className="mr-1 h-3.5 w-3.5" />}
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <div
          className={cn(
            'rounded-lg border border-border-default bg-bg-secondary p-4 text-center shadow-[var(--shadow-sm)]',
            arabicFontClass(settings.arabicFont),
          )}
          dir="rtl"
          style={{ fontSize: settings.arabicFontSize }}
        >
          بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>

        <label className="block text-sm text-text-secondary">
          Arabic size: <span className="text-accent-gold">{settings.arabicFontSize}px</span>
          <input
            className="mt-2 w-full accent-accent-gold"
            max={48}
            min={20}
            type="range"
            value={settings.arabicFontSize}
            onChange={(event) => setArabicFontSize(Number(event.currentTarget.value))}
          />
        </label>

        <label className="block text-sm text-text-secondary">
          Translation size:{' '}
          <span className="text-accent-gold">{settings.translationFontSize}px</span>
          <input
            className="mt-2 w-full accent-accent-gold"
            max={24}
            min={12}
            type="range"
            value={settings.translationFontSize}
            onChange={(event) => setTranslationFontSize(Number(event.currentTarget.value))}
          />
        </label>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Show Translation</span>
          <Toggle checked={settings.showTranslation} label="Show translation" onChange={setShowTranslation} />
        </div>

        <label className="block text-sm text-text-secondary">
          Reciter
          <select
            className="mt-2 h-10 w-full rounded-lg border border-border-default bg-bg-secondary px-3 text-sm text-text-primary shadow-[var(--shadow-sm)] outline-none focus:border-accent-gold"
            value={settings.reciter}
            onChange={(event) => setReciter(event.currentTarget.value as ReciterKey)}
          >
            {reciters.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
