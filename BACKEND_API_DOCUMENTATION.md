# Backend API Documentation

This backend is a Bun + Hono API server. The frontend does not call the external Quran providers directly; it calls this backend, and the backend either fetches Quran text/search data or returns a direct MP3 URL for audio.

## Backend Base URL

Default local backend:

```text
http://localhost:3001
```

The frontend reads this from:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## External APIs Used

### 1. AlQuran.Cloud API

Used for Quran text, translations, surah metadata, and search.

Default base URL:

```text
https://api.alquran.cloud/v1
```

Configured by:

```text
QURAN_API_BASE=https://api.alquran.cloud/v1
```

Official documentation:

```text
https://alquran.cloud/api
```

Editions used by this app:

| Purpose | Edition identifier | Meaning |
| --- | --- | --- |
| Arabic Quran text | `quran-uthmani` | Uthmani Arabic Quran text |
| English translation | `en.asad` | Muhammad Asad English translation |
| Bengali translation | `bn.bengali` | Muhiuddin Khan Bengali translation |

The edition identifiers are defined in:

```text
backend/src/shared/constants/api.ts
```

### 2. EveryAyah CDN

Used for verse-by-verse Quran recitation MP3 files.

Default base URL:

```text
https://everyayah.com/data
```

Configured by:

```text
EVERYAYAH_CDN=https://everyayah.com/data
```

EveryAyah directory:

```text
https://everyayah.com/data/
```

Important: the audio service does not call a JSON API. It creates direct MP3 URLs using the selected reciter folder, the surah number, and the ayah number.

Audio URL format:

```text
{EVERYAYAH_CDN}/{reciter}/{surah padded to 3 digits}{ayah padded to 3 digits}.mp3
```

Example:

```text
https://everyayah.com/data/Alafasy_128kbps/001001.mp3
```

This is Surah 1, Ayah 1, recited by Mishary Rashid Alafasy.

## Environment Variables

Backend defaults are defined in:

```text
backend/src/config/env.ts
```

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3001` | Backend server port |
| `QURAN_API_BASE` | `https://api.alquran.cloud/v1` | AlQuran.Cloud API base URL |
| `EVERYAYAH_CDN` | `https://everyayah.com/data` | EveryAyah CDN base URL |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |

## Standard Response Shape

Every backend endpoint returns the same wrapper:

```ts
{
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}
```

Success example:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-05-04T03:00:00.000Z"
}
```

Error example:

```json
{
  "success": false,
  "data": null,
  "error": "Surah number must be between 1 and 114",
  "timestamp": "2026-05-04T03:00:00.000Z"
}
```

## Local Backend Endpoints

### Health Check

```http
GET /api/health
```

Returns server health information.

Example response data:

```ts
{
  status: 'ok';
  service: 'quran-app-backend';
  uptime: number;
}
```

## Surah and Quran Text Endpoints

### List All Surahs

```http
GET /api/surahs
```

Backend service:

```text
backend/src/modules/surah/surah.service.ts
```

External API called:

```http
GET https://api.alquran.cloud/v1/surah
```

Returns all 114 surahs.

Response data type:

```ts
interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}
```

### Get One Surah With Arabic, English, and Bengali

```http
GET /api/surah/:number
```

Example:

```http
GET /api/surah/1
```

Validation:

```text
number must be an integer from 1 to 114
```

External APIs called in parallel:

```http
GET https://api.alquran.cloud/v1/surah/{number}/quran-uthmani
GET https://api.alquran.cloud/v1/surah/{number}/en.asad
GET https://api.alquran.cloud/v1/surah/{number}/bn.bengali
```

Response data type:

```ts
interface SurahDetail {
  summary: SurahSummary;
  arabic: SurahEdition;
  english: SurahEdition;
  bangla: SurahEdition;
}
```

`SurahEdition` contains surah metadata plus ayahs:

```ts
interface SurahEdition extends SurahSummary {
  ayahs: Ayah[];
}
```

Ayah fields returned by AlQuran.Cloud and passed through by the backend:

```ts
interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | {
    id: number;
    recommended: boolean;
    obligatory: boolean;
  };
  text: string;
}
```

### Get Ayahs Only

```http
GET /api/surah/:number/ayahs
```

Example:

```http
GET /api/surah/2/ayahs
```

Validation:

```text
number must be an integer from 1 to 114
```

External APIs called:

This endpoint reuses the same logic as `GET /api/surah/:number`, so it fetches:

```http
GET https://api.alquran.cloud/v1/surah/{number}/quran-uthmani
GET https://api.alquran.cloud/v1/surah/{number}/en.asad
GET https://api.alquran.cloud/v1/surah/{number}/bn.bengali
```

Then it combines Arabic ayahs with the matching English and Bengali translations by array index.

Response data type:

```ts
interface AyahPair {
  surahNumber: number;
  ayahNumber: number;
  globalAyahNumber: number;
  arabic: string;
  translation: string;
  banglaTranslation: string;
  juz: number;
  page: number;
}
```

## Search Endpoint

### Search Quran Ayahs

```http
GET /api/search?q={query}&lang={lang}
```

Examples:

```http
GET /api/search?q=mercy&lang=en
GET /api/search?q=%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86&lang=ar
GET /api/search?q=%E0%A6%B0%E0%A6%B9%E0%A6%AE%E0%A6%A4&lang=bn
```

Query parameters:

| Parameter | Required | Default | Validation |
| --- | --- | --- | --- |
| `q` | Yes | none | Minimum 2 characters after trimming |
| `lang` | No | `en` | Must be `en`, `ar`, or `bn` |

Edition mapping:

| `lang` | External edition used |
| --- | --- |
| `en` | `en.asad` |
| `ar` | `quran-uthmani` |
| `bn` | `bn.bengali` |

External API called:

```http
GET https://api.alquran.cloud/v1/search/{encodedQuery}/all/{edition}
```

Examples:

```http
GET https://api.alquran.cloud/v1/search/mercy/all/en.asad
GET https://api.alquran.cloud/v1/search/%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86/all/quran-uthmani
GET https://api.alquran.cloud/v1/search/%E0%A6%B0%E0%A6%B9%E0%A6%AE%E0%A6%A4/all/bn.bengali
```

Response data type:

```ts
interface SearchResult {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  text: string;
  edition: string;
}
```

## Audio Endpoints

### Get Verse Audio URL

```http
GET /api/audio/url?surah={surah}&ayah={ayah}&reciter={reciter}
```

Example:

```http
GET /api/audio/url?surah=1&ayah=1&reciter=Alafasy_128kbps
```

If `reciter` is missing, the backend defaults to:

```text
Alafasy_128kbps
```

Validation:

| Parameter | Validation |
| --- | --- |
| `surah` | Integer from 1 to 114 |
| `ayah` | Integer from 1 to 286 |
| `reciter` | Must be one of the configured reciter IDs |

Configured reciters:

| Reciter ID | Display name |
| --- | --- |
| `Alafasy_128kbps` | Mishary Rashid Alafasy |
| `Abdul_Basit_Murattal_192kbps` | Abdul Basit Abdus Samad |
| `Husary_128kbps` | Mahmoud Khalil Al-Husary |
| `Minshawi_Murattal_128kbps` | Mohamed Siddiq El-Minshawi |

Response data type:

```ts
interface AudioUrlResponse {
  surah: number;
  ayah: number;
  reciter: ReciterKey;
  url: string;
}
```

Example response data:

```json
{
  "surah": 1,
  "ayah": 1,
  "reciter": "Alafasy_128kbps",
  "url": "https://everyayah.com/data/Alafasy_128kbps/001001.mp3"
}
```

Important audio implementation detail:

```ts
surah.toString().padStart(3, '0') + ayah.toString().padStart(3, '0') + '.mp3'
```

So:

| Surah | Ayah | File name |
| --- | --- | --- |
| 1 | 1 | `001001.mp3` |
| 2 | 255 | `002255.mp3` |
| 114 | 6 | `114006.mp3` |

### List Available Reciters

```http
GET /api/reciters
```

Returns the configured reciters from:

```text
backend/src/shared/constants/reciters.ts
```

Response data type:

```ts
interface ReciterOption {
  id: ReciterKey;
  name: string;
}
```

## Caching

The backend has two caching layers:

### In-memory data cache

Used by:

- Surah list
- Surah details
- Search results

Implementation:

```text
backend/src/shared/utils/cache.ts
```

Settings:

| Setting | Value |
| --- | --- |
| Max entries | `500` |
| Default TTL | `1 hour` |
| Surah/search TTL | `1 hour` |

### HTTP cache header

Applied to successful GET responses:

```http
Cache-Control: public, max-age=60, stale-while-revalidate=3600
```

Implementation:

```text
backend/src/shared/middleware/cache.middleware.ts
```

## Rate Limiting

Applied to all `/api/*` routes.

Implementation:

```text
backend/src/shared/middleware/rateLimit.middleware.ts
```

Current rule:

```text
100 requests per IP per 60 seconds
```

If exceeded:

```json
{
  "success": false,
  "data": null,
  "error": "Rate limit exceeded. Try again in a minute.",
  "timestamp": "..."
}
```

## Error Handling

Validation errors return `400`.

External provider failures return `502`.

Unknown routes return `404`.

Rate limit failures return `429`.

All errors use the standard response wrapper:

```ts
{
  success: false;
  data: null;
  error: string;
  timestamp: string;
}
```

## Frontend API Client

The frontend calls the backend through:

```text
frontend/src/lib/api.ts
```

Client methods:

| Frontend method | Backend endpoint |
| --- | --- |
| `api.getSurahs()` | `GET /api/surahs` |
| `api.getSurah(number)` | `GET /api/surah/:number` |
| `api.search(query, lang)` | `GET /api/search?q=&lang=` |
| `api.getAudioUrl(surah, ayah, reciter)` | `GET /api/audio/url?surah=&ayah=&reciter=` |
| `api.getReciters()` | `GET /api/reciters` |

## Important Notes

1. The app currently uses Muhammad Asad's English translation (`en.asad`) and Muhiuddin Khan's Bengali translation (`bn.bengali`).
2. Audio is served from EveryAyah direct MP3 files, not from AlQuran.Cloud audio endpoints.
3. The backend validates ayah numbers only against the maximum ayah count in any surah (`286`), not against the selected surah's exact ayah count. For example, `/api/audio/url?surah=1&ayah=200` passes local validation but the generated MP3 URL will not exist.
4. The configured reciter ID `Minshawi_Murattal_128kbps` appears to be different from the EveryAyah folder name `Minshawy_Murattal_128kbps`. The current configured URL returns `404`, while the `Minshawy` URL exists.
