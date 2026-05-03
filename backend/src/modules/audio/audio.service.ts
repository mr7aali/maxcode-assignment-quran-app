import { env } from '../../config/env';
import { RECITERS, isReciterKey } from '../../shared/constants/reciters';
import { AppError } from '../../shared/utils/errors';
import type { AudioUrlResponse, ReciterOption } from './audio.types';

function padVersePart(value: number): string {
  return value.toString().padStart(3, '0');
}

export function getAudioUrl(surah: number, ayah: number, reciter: string): AudioUrlResponse {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
    throw new AppError('surah must be between 1 and 114', 400);
  }

  if (!Number.isInteger(ayah) || ayah < 1 || ayah > 286) {
    throw new AppError('ayah must be between 1 and 286', 400);
  }

  if (!isReciterKey(reciter)) {
    throw new AppError('Unknown reciter', 400);
  }

  return {
    surah,
    ayah,
    reciter,
    url: `${env.EVERYAYAH_CDN}/${reciter}/${padVersePart(surah)}${padVersePart(ayah)}.mp3`,
  };
}

export function listReciters(): ReciterOption[] {
  return Object.entries(RECITERS).map(([id, name]) => ({
    id: id as keyof typeof RECITERS,
    name,
  }));
}
