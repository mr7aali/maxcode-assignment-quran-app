# Quran App

A production-grade Quran web application built as a TypeScript monorepo.

## Stack

- Backend: Bun, Hono, strict TypeScript
- Frontend: Next.js 14 App Router, SSR, Tailwind CSS v3
- State: Zustand with persisted reader settings
- Icons: lucide-react
- Fonts: Inter, Noto Naskh Arabic, Amiri, Scheherazade New

## Setup

```bash
cd backend
cp .env.example .env
bun install
bun run dev
```

```bash
cd frontend
cp .env.example .env.local
bun install
bun run dev
```

Open `http://localhost:3000`. The backend runs on `http://localhost:3001`.

## Environment Variables

Backend:

```bash
PORT=3001
QURAN_API_BASE=https://api.alquran.cloud/v1
EVERYAYAH_CDN=https://everyayah.com/data
CORS_ORIGIN=http://localhost:3000
```

Frontend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API Docs

All responses use:

```ts
{
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}
```

Endpoints:

- `GET /api/health` health check
- `GET /api/surahs` list all 114 surahs
- `GET /api/surah/:number` surah with Arabic, English, and Bengali ayahs
- `GET /api/surah/:number/ayahs` ayahs only
- `GET /api/search?q=mercy&lang=en` search ayahs
- `GET /api/audio/url?surah=1&ayah=1&reciter=Alafasy_128kbps` audio URL
- `GET /api/reciters` available reciters

## Quality Checks

```bash
cd backend
bun run lint
```

```bash
cd frontend
bun run lint
bun run build
```

## Deployment

Deploy the backend to any Bun-compatible host and set the backend environment variables. Deploy the frontend to Vercel or any Next.js-compatible platform with `NEXT_PUBLIC_API_URL` pointing to the backend origin. Update `CORS_ORIGIN` on the backend to the deployed frontend URL.

## Git

Use Conventional Commits, for example:

```bash
git commit -m "feat: build quran reader shell"
git commit -m "fix: handle audio playback cleanup"
```
