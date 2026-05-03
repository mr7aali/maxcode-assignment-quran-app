import type { Metadata } from 'next';
import { Amiri, Inter, Noto_Naskh_Arabic, Scheherazade_New } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-naskh',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

const scheherazade = Scheherazade_New({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-scheherazade',
});

export const metadata: Metadata = {
  title: 'Quran App',
  description: 'A production-grade Quran reader with search, recitation audio, and reader settings.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${inter.variable} ${notoNaskh.variable} ${amiri.variable} ${scheherazade.variable}`}
      lang="en"
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
