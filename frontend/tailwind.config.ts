import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f1117',
        'bg-secondary': '#1a1d27',
        'bg-tertiary': '#22263a',
        'bg-sidebar': '#141720',
        'accent-gold': '#c9a84c',
        'accent-gold-light': '#e8c97e',
        'accent-teal': '#2dd4bf',
        'border-default': '#2a2d3e',
        'text-primary': '#e8e8e8',
        'text-secondary': '#9ca3af',
        'text-muted': '#6b7280',
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
