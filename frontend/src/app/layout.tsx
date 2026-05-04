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
  const themeScript = `
    (function() {
      try {
        var directTheme = localStorage.getItem('quran-theme');
        var stored = localStorage.getItem('quran-app-settings');
        var parsed = stored ? JSON.parse(stored) : null;
        var theme = directTheme || (parsed && parsed.state && parsed.state.theme ? parsed.state.theme : 'dark');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch(e) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return (
    <html
      className={`${inter.variable} ${notoNaskh.variable} ${amiri.variable} ${scheherazade.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
