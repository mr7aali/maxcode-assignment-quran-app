import { Badge } from '@/components/ui/Badge';
import { BasmalaDisplay } from '@/components/reader/BasmalaDisplay';
import type { SurahSummary } from '@/types/quran.types';

interface SurahHeaderProps {
  surah: SurahSummary;
}

export function SurahHeader({ surah }: SurahHeaderProps) {
  const showBasmala = surah.number !== 1 && surah.number !== 9;

  return (
    <header className="surah-hero relative overflow-hidden border-b border-border-default px-6 py-10 text-center md:px-10 md:py-14">
      <div className="ornament ornament-left" />
      <div className="ornament ornament-right" />
      <div className="relative z-10 mx-auto max-w-3xl animate-fade-up">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-gold/50 bg-accent-gold/15 font-semibold text-accent-gold-light">
          {surah.number}
        </div>
        <h1 className="arabic-text text-[38px] text-text-primary" dir="rtl">
          {surah.name}
        </h1>
        <p className="mt-2 text-xl font-semibold text-text-primary">{surah.englishName}</p>
        <p className="mt-1 text-sm text-text-secondary">{surah.englishNameTranslation}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Badge tone={surah.revelationType === 'Medinan' ? 'teal' : 'gold'}>
            {surah.revelationType}
          </Badge>
          <Badge tone="muted">{surah.numberOfAyahs} Ayahs</Badge>
        </div>
        {showBasmala && <BasmalaDisplay className="mt-8" />}
      </div>
    </header>
  );
}
