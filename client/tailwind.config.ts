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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted-text)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        text: 'var(--text)',
        'active-bg': 'var(--active-bg)',
        'muted-text': 'var(--muted-text)',
        'bg-button': 'var(--bg-button)',
        'bg-input': 'var(--bg-input)',
        'active-border': 'var(--active-border)',
        dropdown: 'var(--bg-dropdown)',
        'drop-down-hover': 'var(--drop-down-hover)',

        red: 'var(--red)',
        blue: 'var(--blue)',
        'blue-medium': 'var(--blue-medium)',
        'blue-light': 'var(--blue-light)',

        purple: 'var(--purple)',
        'purple-medium': 'var(--purple-medium)',
        'purple-light': 'var(--purple-light)',
        'purple-lightest': 'var(--purple-lightest)',

        green: 'var(--green)',
        'green-light': 'var(--green-light)',

        yellow: 'var(--yellow)',

        dark: 'var(--dark)',
        'dark-medium': 'var(--dark-medium)',
        'dark-light': 'var(--dark-light)',
        'dark-lightest': 'var(--dark-lightest)',

        white: 'var(--white)',
        'white-medium': 'var(--white-medium)',
        'white-light': 'var(--white-light)',
        'white-lightest': 'var(--white-lightest)',

        gray: 'var(--gray)',
        'gray-medium': 'var(--gray-medium)',
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
        '80': '20rem',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
