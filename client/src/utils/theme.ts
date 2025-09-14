import { ActualTheme, ThemeValue } from '@/types/core/theme';

export const isNightTime = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 19 || hours < 6;
};

export const getInitialTheme = (): ThemeValue => {
  if (typeof window === 'undefined') return ThemeValue.Auto;
  const saved = localStorage.getItem('theme') as ThemeValue | null;
  return saved ?? ThemeValue.Auto;
};

export const calculateActualTheme = (theme: ThemeValue): ActualTheme => {
  switch (theme) {
    case ThemeValue.Dark:
      return ActualTheme.Dark;
    case ThemeValue.Light:
      return ActualTheme.Light;
    case ThemeValue.Auto:
      return isNightTime() ? ActualTheme.Dark : ActualTheme.Light;
  }
};

export const getInitialActualTheme = (): ActualTheme => {
  if (typeof window === 'undefined') return ActualTheme.Light;

  const theme = getInitialTheme();
  return calculateActualTheme(theme);
};

export const applyThemeToDOM = (actualTheme: ActualTheme): void => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  if (actualTheme === ActualTheme.Dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};
