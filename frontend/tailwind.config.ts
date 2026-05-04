import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-sidebar': 'var(--bg-sidebar)',
        'bg-surah-list': 'var(--bg-surah-list)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent-gold': 'var(--accent-gold)',
        'accent-gold-light': 'var(--accent-gold-light)',
        'accent-gold-bg': 'var(--accent-gold-bg)',
        'accent-teal': 'var(--accent-teal)',
        'accent-teal-bg': 'var(--accent-teal-bg)',
        'border-default': 'var(--border-default)',
        'border-light': 'var(--border-light)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-arabic': 'var(--text-arabic)',
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeInUp 420ms ease-out both',
        'fade-scale': 'fadeScale 160ms ease-out both',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeScale: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
