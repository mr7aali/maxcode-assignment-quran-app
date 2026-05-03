import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import type { SurahDetail, SurahSummary } from '@/types/quran.types';

export const dynamic = 'force-dynamic';

async function loadInitialData(): Promise<{ surahs: SurahSummary[]; surah: SurahDetail | null }> {
  try {
    const [surahs, surah] = await Promise.all([
      api.getSurahs({ cache: 'no-store' }),
      api.getSurah(1, { cache: 'no-store' }),
    ]);
    return { surahs, surah };
  } catch {
    return { surahs: [], surah: null };
  }
}

export default async function HomePage() {
  const { surahs, surah } = await loadInitialData();
  return <AppShell initialSurah={surah} initialSurahs={surahs} selectedNumber={1} />;
}
