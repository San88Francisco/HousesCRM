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
        background: '#F5F5F5',
        foreground: '#1A1A1A',
        text: '#4b5563',
        muted: '#E5E7EB',
        'muted-foreground': '#6B7280',
        primary: '#457B9D',
        'primary-foreground': '#FFFFFF',
        secondary: '#A8DADC',
        'secondary-foreground': '#1D3557',
        border: '#D1D5DB',
        destructive: '#DC2626',
        'destructive-foreground': '#FFFFFF',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },
        blue: {
          light: '#A8DADC',
          DEFAULT: '#457B9D',
          dark: '#1D3557',
        },
        ring: '#457B9D',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
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
