import { AppError } from '../shared/utils/errors';

export interface Env {
  PORT: number;
  QURAN_API_BASE: string;
  EVERYAYAH_CDN: string;
  CORS_ORIGIN: string;
}

const DEFAULTS = {
  PORT: '3001',
  QURAN_API_BASE: 'https://api.alquran.cloud/v1',
  EVERYAYAH_CDN: 'https://everyayah.com/data',
  CORS_ORIGIN: 'http://localhost:3000',
} as const;

function readEnv(key: keyof typeof DEFAULTS): string {
  return Bun.env[key] ?? DEFAULTS[key];
}

function parsePort(value: string): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new AppError('PORT must be an integer between 1 and 65535', 500);
  }
  return port;
}

function parseUrl(key: keyof typeof DEFAULTS, value: string): string {
  try {
    return new URL(value).toString().replace(/\/$/, '');
  } catch {
    throw new AppError(`${key} must be a valid URL`, 500);
  }
}

export const env: Env = {
  PORT: parsePort(readEnv('PORT')),
  QURAN_API_BASE: parseUrl('QURAN_API_BASE', readEnv('QURAN_API_BASE')),
  EVERYAYAH_CDN: parseUrl('EVERYAYAH_CDN', readEnv('EVERYAYAH_CDN')),
  CORS_ORIGIN: parseUrl('CORS_ORIGIN', readEnv('CORS_ORIGIN')),
};
