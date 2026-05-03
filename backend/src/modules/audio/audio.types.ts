import type { ReciterKey } from '../../shared/constants/reciters';

export interface AudioUrlRequest {
  surah: number;
  ayah: number;
  reciter: ReciterKey;
}

export interface AudioUrlResponse {
  surah: number;
  ayah: number;
  reciter: ReciterKey;
  url: string;
}

export interface ReciterOption {
  id: ReciterKey;
  name: string;
}
