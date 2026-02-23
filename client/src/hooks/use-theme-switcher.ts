import { SWITCHER_STORAGE_KEY, themeIconMap } from '@/shared/constants/theme';
import { NextTheme } from '@/types/core/theme';
import { getHours } from 'date-fns';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

export const useThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  const [switcherTheme, setSwitcherTheme] = useState<NextTheme>(NextTheme.System);

  useEffect(() => {
    const saved = localStorage.getItem(SWITCHER_STORAGE_KEY) as NextTheme | null;

    if (saved && [NextTheme.Light, NextTheme.Dark, NextTheme.System].includes(saved)) {
      setSwitcherTheme(saved);
    }

    setMounted(true);
  }, []);

  const updateSwitcherTheme = useCallback((value: NextTheme) => {
    setSwitcherTheme(value);
    localStorage.setItem(SWITCHER_STORAGE_KEY, value);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let realTheme = switcherTheme;

    if (switcherTheme === NextTheme.System) {
      const hour = getHours(new Date());
      realTheme = hour >= 5 && hour < 18 ? NextTheme.Light : NextTheme.Dark;
    }

    setTheme(realTheme);
  }, [switcherTheme, mounted, setTheme]);

  const CurrentIcon = themeIconMap[switcherTheme];

  return {
    mounted,
    switcherTheme,
    setSwitcherTheme: updateSwitcherTheme,
    CurrentIcon,
    realTheme: theme,
  };
};
