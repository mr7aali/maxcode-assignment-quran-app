export type ReciterKey =
  | 'Alafasy_128kbps'
  | 'Abdul_Basit_Murattal_192kbps'
  | 'Husary_128kbps'
  | 'Minshawi_Murattal_128kbps';

export interface ReciterOption {
  id: ReciterKey;
  name: string;
}

export interface AudioUrlResponse {
  surah: number;
  ayah: number;
  reciter: ReciterKey;
  url: string;
}
