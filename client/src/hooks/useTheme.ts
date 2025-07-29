import { useState, useEffect, useCallback } from 'react';

export type ThemeValue = 'світла' | 'темна' | 'авто';
export type ActualTheme = 'світла' | 'темна';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeValue>(() => {
    const saved = localStorage.getItem('theme') as ThemeValue | null;
    return saved ?? 'авто';
  });
  const [actualTheme, setActualTheme] = useState<ActualTheme>('світла');

  const isNightTime = useCallback((): boolean => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 19 || hours < 6;
  }, []);

  const applyTheme = useCallback((themeToApply: ActualTheme) => {
    const root = document.documentElement;
    if (themeToApply === 'темна') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setActualTheme(themeToApply);
  }, []);

  const updateTheme = useCallback(() => {
    let themeToApply: ActualTheme;
    switch (theme) {
      case 'темна':
        themeToApply = 'темна';
        break;
      case 'світла':
        themeToApply = 'світла';
        break;
      case 'авто':
        themeToApply = isNightTime() ? 'темна' : 'світла';
        break;
    }
    applyTheme(themeToApply);
  }, [theme, isNightTime, applyTheme]);

  useEffect(() => {
    updateTheme();
  }, [updateTheme]);

  useEffect(() => {
    if (theme !== 'авто') return;
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, [theme, updateTheme]);

  const changeTheme = useCallback((newTheme: ThemeValue) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  return {
    theme,
    actualTheme,
    changeTheme,
    isNightTime: isNightTime(),
  };
}
