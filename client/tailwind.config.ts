import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'], // Залишено без змін - режим темної теми через клас
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
        // ЗМІНЕНО: додано підтримку темної теми для background
        background: {
          DEFAULT: '#F5F5F5', // Світла тема (було просто '#F5F5F5')
          dark: '#0F172A', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для foreground
        foreground: {
          DEFAULT: '#1A1A1A', // Світла тема (було просто '#1A1A1A')
          dark: '#F1F5F9', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для text
        text: {
          DEFAULT: '#4b5563', // Світла тема (було просто '#4b5563')
          dark: '#94A3B8', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для muted
        muted: {
          DEFAULT: '#E5E7EB', // Світла тема (було просто '#E5E7EB')
          dark: '#1E293B', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для muted-foreground
        'muted-foreground': {
          DEFAULT: '#6B7280', // Світла тема (було просто '#6B7280')
          dark: '#64748B', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для primary
        primary: {
          DEFAULT: '#457B9D', // Світла тема (було просто '#457B9D')
          dark: '#60A5FA', // ДОДАНО: темна тема
        },
        'primary-foreground': '#FFFFFF', // Залишено без змін
        // ЗМІНЕНО: додано підтримку темної теми для secondary
        secondary: {
          DEFAULT: '#A8DADC', // Світла тема (було просто '#A8DADC')
          dark: '#334155', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для secondary-foreground
        'secondary-foreground': {
          DEFAULT: '#1D3557', // Світла тема (було просто '#1D3557')
          dark: '#F1F5F9', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для border
        border: {
          DEFAULT: '#D1D5DB', // Світла тема (було просто '#D1D5DB')
          dark: '#374151', // ДОДАНО: темна тема
        },
        // ЗМІНЕНО: додано підтримку темної теми для destructive
        destructive: {
          DEFAULT: '#DC2626', // Світла тема (було просто '#DC2626')
          dark: '#EF4444', // ДОДАНО: темна тема
        },
        'destructive-foreground': '#FFFFFF', // Залишено без змін
        // ЗМІНЕНО: розширено card з підтримкою темної теми
        card: {
          DEFAULT: '#FFFFFF', // Світла тема (було просто DEFAULT)
          foreground: '#1A1A1A', // Світла тема (залишено)
          dark: '#1E293B', // ДОДАНО: темна тема для фону
          'dark-foreground': '#F1F5F9', // ДОДАНО: темна тема для тексту
        },
        blue: {
          light: '#A8DADC',
          DEFAULT: '#457B9D',
          dark: '#1D3557',
        }, // Залишено без змін
        // ЗМІНЕНО: додано підтримку темної теми для ring
        ring: {
          DEFAULT: '#457B9D', // Світла тема (було просто '#457B9D')
          dark: '#60A5FA', // ДОДАНО: темна тема
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        }, // Залишено без змін - використовує CSS змінні
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '24px',
      }, // Залишено без змін
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
      }, // Залишено без змін
      borderRadius: {
        xl: '1rem',
      }, // Залишено без змін
    },
  },
  plugins: [require('tailwindcss-animate')], // Залишено без змін
} satisfies Config;
