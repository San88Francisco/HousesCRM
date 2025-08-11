import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        sx: '420px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1536px',
      },
      colors: {
        foreground: {
          DEFAULT: '#1A1A1A',
          dark: '#F1F5F9',
        },

        text: {
          DEFAULT: '#4b5563',
          dark: '#94A3B8',
        },

        muted: {
          DEFAULT: '#E5E7EB',
          dark: '#1E293B',
        },

        'muted-foreground': {
          DEFAULT: '#6B7280',
          dark: '#64748B',
        },

        primary: 'var(--primary)',
        'primary-foreground': '#FFFFFF',

        secondary: {
          DEFAULT: '#A8DADC',
          dark: '#334155',
        },

        'secondary-foreground': {
          DEFAULT: '#1D3557',
          dark: '#F1F5F9',
        },

        border: {
          DEFAULT: '#D1D5DB',
          dark: '#374151',
        },

        destructive: {
          DEFAULT: '#DC2626',
          dark: '#EF4444',
        },
        'destructive-foreground': '#FFFFFF',

        blue: {
          light: '#A8DADC',
          DEFAULT: '#457B9D',
          dark: '#1D3557',
        },

        ring: {
          DEFAULT: '#0ea5e9',
          dark: '#0ea5e9',
        },
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '24px',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
