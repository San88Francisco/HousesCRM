import { MoonIcon } from '@/components/ui/moon';
import { SunIcon } from '@/components/ui/sun';
import { SunMoonIcon } from '@/components/ui/sunmoon';
import { NextTheme } from '@/types/core/theme';

export const THEME_OPTIONS = [NextTheme.Light, NextTheme.Dark, NextTheme.System];

export const themeIconMap = {
  [NextTheme.Light]: SunIcon,
  [NextTheme.Dark]: MoonIcon,
  [NextTheme.System]: SunMoonIcon,
};
