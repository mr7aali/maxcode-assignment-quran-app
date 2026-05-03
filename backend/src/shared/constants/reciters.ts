export const RECITERS = {
  Alafasy_128kbps: 'Mishary Rashid Alafasy',
  Abdul_Basit_Murattal_192kbps: 'Abdul Basit Abdus Samad',
  Husary_128kbps: 'Mahmoud Khalil Al-Husary',
  Minshawi_Murattal_128kbps: 'Mohamed Siddiq El-Minshawi',
} as const;

export type ReciterKey = keyof typeof RECITERS;

export function isReciterKey(value: string): value is ReciterKey {
  return Object.prototype.hasOwnProperty.call(RECITERS, value);
}
