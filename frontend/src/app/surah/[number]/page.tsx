import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import type { SurahDetail, SurahSummary } from '@/types/quran.types';

export const dynamic = 'force-dynamic';

interface SurahPageProps {
  params: {
    number: string;
  };
}

async function loadInitialData(number: number): Promise<{ surahs: SurahSummary[]; surah: SurahDetail | null }> {
  try {
    const [surahs, surah] = await Promise.all([
      api.getSurahs({ cache: 'no-store' }),
      api.getSurah(number, { cache: 'no-store' }),
    ]);
    return { surahs, surah };
  } catch {
    return { surahs: [], surah: null };
  }
}

export default async function SurahPage({ params }: SurahPageProps) {
  const number = Number(params.number);

  if (!Number.isInteger(number) || number < 1 || number > 114) {
    notFound();
  }

  const { surahs, surah } = await loadInitialData(number);
  return <AppShell initialSurah={surah} initialSurahs={surahs} selectedNumber={number} />;
}
